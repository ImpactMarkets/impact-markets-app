CREATE VIEW "Contribution" AS (
    WITH donations AS (
        SELECT
            "userId",
            "projectId",
            "time",
            "amount",
            (
                100 + SUM("amount") OVER (
                    PARTITION BY "projectId"
                    ORDER BY
                        "time" ASC,
                        "id" ASC
                )
            ) AS "runningTotal",
            (
                100 + SUM("amount") OVER (PARTITION BY "projectId")
            ) AS "projectTotal"
        FROM
            "Donation"
        WHERE
            "state" = 'CONFIRMED'
        ORDER BY
            "projectId" ASC,
            "time" ASC
    ),
    contributions AS (
        SELECT
            *,
            "amount" / "runningTotal" :: float AS "contribution",
            SUM("amount" / "runningTotal" :: float) OVER (PARTITION BY "projectId") AS "contributionTotal"
        FROM
            "donations"
    )
    SELECT
        "projectId",
        "userId",
        SUM("amount") :: numeric as "totalAmount",
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
        ) :: numeric as "score365"
    FROM
        "Contribution"
        JOIN "Project" ON "Project"."id" = "Contribution"."projectId"
    GROUP BY
        "userId"
);

CREATE VIEW "SupportScore" AS (
    SELECT
        "Project"."id" as "projectId",
        COUNT("User"."id") :: numeric as "count",
        SUM(
            -- Return 0 for incomplete rows because we can’t sort nulls to the end atm.
            CASE
                WHEN "User"."id" IS NOT NULL --
                THEN "relativeContribution" * "UserScore"."score"
                ELSE 0
            END
        ) :: numeric as "score"
    FROM
        "Project"
        LEFT JOIN "Contribution" ON "Contribution"."projectId" = "Project"."id"
        LEFT JOIN "UserScore" ON "UserScore"."userId" = "Contribution"."userId"
        LEFT JOIN "User" ON (
            -- only count contributions from users who have signed up
            "User"."id" = "Contribution"."userId"
            AND "User"."email" IS NOT NULL
        )
    GROUP BY
        "Project"."id"
);