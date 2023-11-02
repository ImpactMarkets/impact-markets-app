DROP VIEW "SupportScore";

DROP VIEW "UserScore";

DROP VIEW "Contribution";

CREATE VIEW "Contribution" AS (
    WITH funding AS (
        SELECT
            -- Choose magic number and consider shifted hyperbolic function 1/(x + initial) instead
            -- of hyperbolic function 1/x to avoid infinities.
            1e3 AS "initial"
    ),
    "contributionsStep1" AS (
        SELECT
            "userId",
            "projectId",
            "time",
            "amount",
            SUM("amount") OVER (
                PARTITION BY "projectId"
            ) AS "projectTotal",
            SUM("amount") OVER (
                PARTITION BY "projectId"
                ORDER BY
                    "time" ASC,
                    "id" ASC
            ) AS "runningTotal"
        FROM
            "Donation"
        WHERE
            "state" = 'CONFIRMED'
        ORDER BY
            "projectId" ASC,
            "time" ASC
    ),
    "contributions" AS (
        SELECT
            *,
            -- For each donation compute the area under the curve f(x) = 1/(x + 100), 
            -- between x0 = previous donation total and x1 = previous donation total + current
            -- donation. It turns out the area under the curve f(x) = 1/x from 100 to x + 100 is
            -- Area = log(x + 100) - log(100). So the area under the curve between x_1 and x_0 is
            -- log(x_1 + 100) - log(x_0 + 100). We call this the contribution of a donor.
            LN("initial" + "runningTotal") - LN("initial" + "runningTotal" - "amount") AS "rawContribution"
        FROM
            "contributionsStep1",
            "funding"
    )
    SELECT
        "projectId",
        "userId",
        MIN("time") as "minTime",
        MAX("time") as "maxTime",
        -- Should all be equal though
        SUM("amount") as "totalAmount",
        -- The contributions do not sum to one. We compute their sum so that we can divide by it to
        -- get what fraction of the impact credits each donor should receive. This step can be 
        -- simplified by noting that sum_of_contributions = log(total of contributions + initial)
        -- log(initial)
        SUM(
            "rawContribution" / (LN("initial" + "projectTotal") - LN("initial"))
        ) AS "contribution"
    FROM
        "contributions"
    GROUP BY
        "projectId",
        "userId"
    ORDER BY
        "projectId",
        "contribution" DESC
);

CREATE VIEW "UserScore" AS (
    SELECT
        "userId",
        SUM("contribution" * "credits") as "score",
        SUM(
            CASE
                WHEN AGE("maxTime") < INTERVAL '365 days' --
                THEN "contribution" * "credits"
                ELSE 0
            END
        ) as "score365",
        RANK() OVER (
            ORDER BY
                SUM("contribution" * "credits") ASC
        ) as "inverseRank"
    FROM
        "Contribution"
        JOIN "Project" ON "Project"."id" = "Contribution"."projectId"
    WHERE
        -- Skip if a project is carried by just one person as that usually means that our
        -- data is highly incomplete
        "contribution" < 0.90
    GROUP BY
        "userId"
);

CREATE VIEW "SupportScore" AS (
    WITH "projectsWithNulls" AS (
        SELECT
            "Project"."id" as "projectId",
            COUNT("User"."id") as "count",
            SUM("contribution" * "UserScore"."score") as "score"
        FROM
            "Project"
            LEFT JOIN "Contribution" ON (
                -- Skip if a project is carried by just one person as that usually means that our
                -- data is highly incomplete
                "Contribution"."projectId" = "Project"."id"
                AND "Contribution"."contribution" < 0.90
            )
            LEFT JOIN "UserScore" ON "UserScore"."userId" = "Contribution"."userId"
            LEFT JOIN "User" ON "User"."id" = "Contribution"."userId"
        GROUP BY
            "Project"."id"
    )
    SELECT
        "projectId",
        "count",
        -- Return 0 for incomplete rows because we can’t sort nulls to the end atm.
        -- https://github.com/prisma/prisma/issues/19761
        COALESCE("score", 0) as "score"
    FROM
        "projectsWithNulls"
    ORDER BY
        "score" desc
);