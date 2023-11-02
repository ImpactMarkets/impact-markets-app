DROP VIEW "SupportScore";

DROP VIEW "UserScore";

DROP VIEW "Contribution";

CREATE VIEW "Contribution" AS (
    WITH funding AS (
        SELECT
            -- Choose magic number 100 (or anything else positive) and consider shifted hyperbolic
            -- function 1/(x + 100) instead of hyperbolic function 1/x to avoid infinities.
            1e3 :: numeric AS "initial",
            -- 100,000 annual funding goal, but in seconds.
            -- This assumes that every project has this funding goal. Eventually we will want to
            -- make this a column in the project table.
            1e5 / 365.0 / 24.0 / 60.0 / 60.0 :: numeric AS "goal"
    ),
    "contributionsStep1" AS (
        SELECT
            "Donation"."userId",
            "Donation"."projectId",
            "Donation"."time",
            "Donation"."amount",
            (
                "funding"."initial" + SUM("Donation"."amount") OVER (
                    PARTITION BY "Donation"."projectId"
                    ORDER BY
                        "Donation"."time" ASC,
                        "Donation"."id" ASC
                )
            ) AS "runningTotal",
            (
                "funding"."initial" + (
                    SUM("Donation"."amount") OVER (PARTITION BY "Donation"."projectId")
                )
            ) AS "projectTotal",
            -- Age of the project in seconds, according to the first donation
            -- Funding goal as product of the age and the per-second funding goal
            EXTRACT(
                EPOCH
                from
                    AGE(
                        LEAST(
                            MIN("time") OVER (PARTITION BY "Donation"."projectId"),
                            MIN("Project"."createdAt") OVER (PARTITION BY "Donation"."projectId"),
                            MIN("Project"."actionStart") OVER (PARTITION BY "Donation"."projectId")
                        )
                    )
            ) * "funding"."goal" AS "fundingGoal"
        FROM
            "funding",
            "Donation"
            JOIN "Project" ON "Project"."id" = "Donation"."projectId"
        WHERE
            "Donation"."state" = 'CONFIRMED'
        ORDER BY
            "Donation"."projectId" ASC,
            "Donation"."time" ASC
    ),
    "contributionsStep2" AS (
        SELECT
            *,
            -- For each donation compute the area under the curve f(x) = 1/(x + 100), 
            -- between x0 = previous donation total and x1 = previous donation total + current
            -- donation. It turns out the area under the curve f(x) = 1/x from 100 to x + 100 is
            -- Area = log(x + 100) - log(100). So the area under the curve between x_1 and x_0 is
            -- log(x_1 + 100) - log(x_0 + 100). We call this the contribution of a donor.
            (
                ln("runningTotal") - ln("runningTotal" - "amount")
            ) :: float AS "contribution"
        FROM
            "contributionsStep1",
            "funding"
    ),
    "contributions" AS (
        SELECT
            *,
            SUM("contribution" :: float) OVER (PARTITION BY "projectId") AS "bareContributionTotal",
            CASE
                -- Adjustment for very early-stage projects that a donor can monopolize cheaply
                WHEN "projectTotal" < "fundingGoal" THEN ln("fundingGoal") / ln("projectTotal")
                ELSE 0.0
            END + (
                SUM("contribution" :: float) OVER (PARTITION BY "projectId")
            ) AS "contributionTotal"
        FROM
            "contributionsStep2"
    )
    SELECT
        "projectId",
        "userId",
        SUM("amount") :: numeric as "totalAmount",
        -- The contributions do not sum to one. We compute their sum so that we can divide by it to
        -- get what fraction of the impact credits each donor should receive. This step can be 
        -- simplified by noting that sum_of_contributions = log(total of contributions + 100)
        SUM("contribution" / "contributionTotal") :: numeric AS "relativeContribution",
        SUM("contribution" / "bareContributionTotal") :: numeric AS "relativeBareContribution",
        MAX(SUM("contribution" / "bareContributionTotal")) OVER (PARTITION BY "projectId") AS "maxContribution"
    FROM
        "contributions"
    GROUP BY
        "projectId",
        "userId"
    ORDER BY
        "projectId",
        "relativeContribution" DESC
);

CREATE VIEW "UserScore" AS (
    SELECT
        "userId",
        SUM("relativeContribution" * "Project"."credits") :: numeric as "score",
        SUM(
            CASE
                WHEN "Project"."updatedAt" > NOW() - INTERVAL '365 days' --
                THEN "relativeContribution" * "Project"."credits"
                ELSE 0
            END
        ) :: numeric as "score365",
        RANK() OVER (
            ORDER BY
                SUM("relativeContribution" * "Project"."credits") ASC
        ) as "inverseRank"
    FROM
        "Contribution"
        JOIN "Project" ON "Project"."id" = "Contribution"."projectId"
    WHERE
        -- Skip if a project is carried by just one person as that usually means that our
        -- data is highly incomplete
        "maxContribution" < 0.99
    GROUP BY
        "userId"
);

CREATE VIEW "SupportScore" AS (
    WITH "projectsWithNulls" AS (
        SELECT
            "Project"."id" as "projectId",
            COUNT("User"."id") as "count",
            MAX("Contribution"."maxContribution") as "maxContribution",
            SUM("relativeContribution" * "UserScore"."score") as "score"
        FROM
            "Project"
            LEFT JOIN "Contribution" ON (
                -- Skip if a project is carried by just one person as that usually means that our
                -- data is highly incomplete
                "Contribution"."projectId" = "Project"."id"
                AND "Contribution"."maxContribution" < 0.99
            )
            LEFT JOIN "UserScore" ON "UserScore"."userId" = "Contribution"."userId"
            LEFT JOIN "User" ON "User"."id" = "Contribution"."userId"
        GROUP BY
            "Project"."id"
    )
    SELECT
        "projectId",
        "count" :: numeric,
        "maxContribution" :: numeric,
        CASE
            -- Return 0 for incomplete rows because we can’t sort nulls to the end atm.
            -- https://github.com/prisma/prisma/issues/19761
            WHEN "score" is not null THEN "score"
            ELSE 0
        END :: numeric as "score"
    FROM
        "projectsWithNulls"
    ORDER BY
        "score" desc
);