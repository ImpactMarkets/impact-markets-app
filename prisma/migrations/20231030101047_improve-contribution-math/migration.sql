CREATE
OR REPLACE VIEW "Contribution" AS (
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
            "userId",
            "projectId",
            "time",
            "amount",
            (
                "funding"."initial" + SUM("amount") OVER (
                    PARTITION BY "projectId"
                    ORDER BY
                        "time" ASC,
                        "id" ASC
                )
            ) AS "runningTotal",
            (
                "funding"."initial" + (SUM("amount") OVER (PARTITION BY "projectId"))
            ) AS "projectTotal",
            -- Age of the project in seconds, according to the first donation
            -- Funding goal as product of the age and the per-second funding goal
            EXTRACT(
                EPOCH
                from
                    AGE(
                        MIN("time") OVER (PARTITION BY "projectId")
                    )
            ) * "funding"."goal" AS "fundingGoal"
        FROM
            "Donation",
            funding
        WHERE
            "state" = 'CONFIRMED'
        ORDER BY
            "projectId" ASC,
            "time" ASC
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
                -- Adjustment for crowdedness
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
        SUM("contribution" / "contributionTotal") :: numeric AS "relativeContribution"
    FROM
        "contributions"
    GROUP BY
        "projectId",
        "userId"
    ORDER BY
        "projectId",
        "relativeContribution" DESC
);