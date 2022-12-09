INSERT INTO "Holding" (
    "certificateId",
    "userId",
    "type",
    "size",
    "cost"
  )
SELECT "certificateId",
  "userId",
  "type",
  "size",
  "cost"
FROM (
    VALUES (
        2,
        'cl3ahmzcn0123a4opvnc35uyg',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        3,
        'cl3ahq4wj0182a4opv1v3zcvs',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        4,
        'cl3aelpg70006rxopul24lqxm',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        6,
        'cl3ahq4wj0182a4opv1v3zcvs',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        7,
        'cl3w7u2uc1195stopujdvit9q',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        8,
        'cl3w7i9gn1111stop8guunoqc',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        9,
        'cl3xh0b540123rpopqgdw2gut',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        10,
        'cl3yhfeb80346jxopyc94e1v3',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        11,
        'cl45hjt3v0034qnopbthd60ec',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        12,
        'cl463s0780546pdop6iwq014b',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        13,
        'cl45wfa750192ppopl6puaubs',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        14,
        'cl3ralqx800190qop0eb1rctf',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        15,
        'cl4nw2von1305pcop26a39raa',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        16,
        'cl4nw2von1305pcop26a39raa',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        17,
        'cl3yhfeb80346jxopyc94e1v3',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        18,
        'cl3yhfeb80346jxopyc94e1v3',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        19,
        'cl3yhfeb80346jxopyc94e1v3',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        20,
        'cl4xac0073816pcoprkbcr4w1',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        21,
        'cl4xxz5yi4050pcopjc9fa8ts',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        22,
        'cl3ralqx800190qop0eb1rctf',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        23,
        'cl50fnq0c6644pcop87cc8z0t',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        24,
        'cl5100wkw6793pcoptfb4mvof',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        25,
        'cl51ejlys7229pcop9n9e7ijg',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        26,
        'cl4xkdjkk3944pcopqp36ystr',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        27,
        'cl5b05t0z10459pcoptr3m2pvo',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        28,
        'cl5bivaaz0052xuopr19f2ak3',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      ),
      (
        30,
        'cl3ahmzcn0123a4opvnc35uyg',
        'OWNERSHIP'::"HoldingType",
        1,
        0
      )
  ) AS holdings (
    "certificateId",
    "userId",
    "type",
    "size",
    "cost"
  )
  INNER JOIN "Certificate" ON "Certificate"."id" = "certificateId"
  INNER JOIN "User" ON "User"."id" = "userId";

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000101ol3u5g1avh'
WHERE "id" = 2
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kfeto000001ll8z61goyl'
WHERE "id" = 3
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000201ol369z68ow'
WHERE "id" = 4
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvtz000001ol0v366vt7'
WHERE "id" = 6
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000301ol3dyb6kak'
WHERE "id" = 7
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000401ol45fldr1a'
WHERE "id" = 8
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000501ol0bf0h563'
WHERE "id" = 9
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000601olhudx1d6t'
WHERE "id" = 10
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000701olcjtjg217'
WHERE "id" = 11
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000801olc10f0dxm'
WHERE "id" = 12
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000901ole5xy7krw'
WHERE "id" = 13
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000a01ol3vxe3syj'
WHERE "id" = 14
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000b01ol44eqbszr'
WHERE "id" = 15
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000c01ol6k9273cc'
WHERE "id" = 16
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000d01olbkz58w9p'
WHERE "id" = 17
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000e01ol0z45fdca'
WHERE "id" = 18
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000f01olefle59fx'
WHERE "id" = 19
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000g01olebre5tzl'
WHERE "id" = 20
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000h01ol9o1x2q3s'
WHERE "id" = 21
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000i01olh4adhbpv'
WHERE "id" = 22
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000j01olf3rg6lzn'
WHERE "id" = 23
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000k01ol92fzb88b'
WHERE "id" = 24
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000l01olaxku5l7z'
WHERE "id" = 25
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000m01ol4k510c94'
WHERE "id" = 26
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000n01olg5vlgcaa'
WHERE "id" = 27
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl79kcvu1000o01ol8zp9azcj'
WHERE "id" = 28
  AND "cuid" IS NULL;

UPDATE "Certificate"
SET "cuid" = 'cl9h33trz000001qq9wfx4cpv'
WHERE "id" = 30
  AND "cuid" IS NULL;