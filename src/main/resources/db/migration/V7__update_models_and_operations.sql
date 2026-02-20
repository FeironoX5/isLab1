DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'country') THEN
        CREATE TYPE country AS ENUM ('USA', 'GERMANY', 'FRANCE', 'CHINA', 'INDIA');
    END IF;
END $$;

ALTER TABLE coordinates
    ALTER COLUMN x TYPE REAL USING x::REAL,
    ALTER COLUMN y TYPE BIGINT USING y::BIGINT,
    DROP CONSTRAINT IF EXISTS coordinates_x_check,
    DROP CONSTRAINT IF EXISTS coordinates_y_check;

ALTER TABLE coordinates
    ADD CONSTRAINT coordinates_y_min_check CHECK (y >= -920);

ALTER TABLE dragon_caves
    ALTER COLUMN depth TYPE DOUBLE PRECISION USING depth::DOUBLE PRECISION;

ALTER TABLE dragon_heads
    ALTER COLUMN size TYPE INTEGER USING size::INTEGER;

ALTER TABLE dragon_heads
    ADD COLUMN IF NOT EXISTS eyes_count REAL,
    ADD COLUMN IF NOT EXISTS tooth_count REAL;

UPDATE dragon_heads SET eyes_count = 1 WHERE eyes_count IS NULL;
ALTER TABLE dragon_heads ALTER COLUMN eyes_count SET NOT NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'people')
        AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'persons') THEN
        ALTER TABLE people RENAME TO persons;
    END IF;
END $$;

ALTER TABLE persons
    ALTER COLUMN eye_color SET NOT NULL,
    DROP COLUMN IF EXISTS birthday,
    DROP COLUMN IF EXISTS height,
    DROP COLUMN IF EXISTS passport_id,
    ALTER COLUMN weight TYPE DOUBLE PRECISION USING weight::DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS nationality country;

UPDATE persons SET nationality = 'USA' WHERE nationality IS NULL;
ALTER TABLE persons ALTER COLUMN nationality SET NOT NULL;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='dragons' AND column_name='dragon_color') THEN
        ALTER TABLE dragons RENAME COLUMN dragon_color TO color;
    END IF;
END $$;

ALTER TABLE dragons
    DROP COLUMN IF EXISTS type,
    DROP COLUMN IF EXISTS character,
    ADD COLUMN IF NOT EXISTS creation_date TIMESTAMP,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS speaking BOOLEAN;

UPDATE dragons SET creation_date = NOW() WHERE creation_date IS NULL;
UPDATE dragons SET description = '' WHERE description IS NULL;
UPDATE dragons SET speaking = false WHERE speaking IS NULL;

ALTER TABLE dragons
    ALTER COLUMN creation_date SET NOT NULL,
    ALTER COLUMN description SET NOT NULL,
    ALTER COLUMN speaking SET NOT NULL,
    ALTER COLUMN age TYPE BIGINT USING age::BIGINT,
    ALTER COLUMN age SET NOT NULL,
    ALTER COLUMN cave_id SET NOT NULL;
