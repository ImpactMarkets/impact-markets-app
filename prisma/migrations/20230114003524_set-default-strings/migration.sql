-- Table "Certificate"
UPDATE
    "Certificate"
SET
    "tags" = ''
WHERE
    "tags" IS NULL;

ALTER TABLE "Certificate"
    ALTER COLUMN "tags" SET NOT NULL,
    ALTER COLUMN "tags" SET DEFAULT '';

-- Table "Project"
UPDATE
    "Project"
SET
    "tags" = ''
WHERE
    "tags" IS NULL;

ALTER TABLE "Project"
    ALTER COLUMN "tags" SET NOT NULL,
    ALTER COLUMN "tags" SET DEFAULT '';

-- Table "User"
UPDATE
    "User"
SET
    "name" = 'Anonymous'
WHERE
    "name" IS NULL;

UPDATE
    "User"
SET
    "image" = ''
WHERE
    "image" IS NULL;

UPDATE
    "User"
SET
    "title" = ''
WHERE
    "title" IS NULL;

ALTER TABLE "User"
    ALTER COLUMN "name" SET NOT NULL,
    ALTER COLUMN "name" SET DEFAULT 'Anonymous',
    ALTER COLUMN "image" SET NOT NULL,
    ALTER COLUMN "image" SET DEFAULT '',
    ALTER COLUMN "title" SET NOT NULL,
    ALTER COLUMN "title" SET DEFAULT '';

