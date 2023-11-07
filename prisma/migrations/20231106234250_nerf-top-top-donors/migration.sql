DROP VIEW "SupportScore";

CREATE VIEW "SupportScore" AS (
    WITH "projectsWithNulls" AS (
        SELECT
            "Project"."id" as "projectId",
            COUNT("User"."id") as "count",
            SUM("contribution" * "UserScore"."inverseRank") as "score"
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