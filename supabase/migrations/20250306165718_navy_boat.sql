/*
  # Add description field to complaints table

  1. Changes
    - Add `description` column to `complaints` table with default value
    - Ensure data consistency by handling existing rows
*/

-- First add the column as nullable to handle existing data
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS description text;

-- Set default value for any existing NULL entries
UPDATE complaints SET description = '' WHERE description IS NULL;

-- Now make it NOT NULL with a default
ALTER TABLE complaints ALTER COLUMN description SET NOT NULL;
ALTER TABLE complaints ALTER COLUMN description SET DEFAULT '';