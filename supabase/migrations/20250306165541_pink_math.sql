/*
  # Add description field to complaints table

  1. Changes
    - Add `description` column to `complaints` table for storing complaint details
    - Set default empty string for existing rows
*/

-- Add description column as nullable first
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS description text;

-- Set default value for existing rows
UPDATE complaints SET description = '' WHERE description IS NULL;

-- Make the column NOT NULL after setting defaults
ALTER TABLE complaints ALTER COLUMN description SET NOT NULL;

-- Set default for new rows
ALTER TABLE complaints ALTER COLUMN description SET DEFAULT '';