/*
  # Add description field to complaints table

  1. Changes
    - Add `description` column to `complaints` table
    - Set appropriate default value and constraints
    - Handle existing data safely

  2. Security
    - Maintain existing RLS policies
*/

-- Add description column as nullable first to handle existing data
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS description text;

-- Set empty string for any existing NULL values
UPDATE complaints SET description = '' WHERE description IS NULL;

-- Make the column NOT NULL and set default
ALTER TABLE complaints 
  ALTER COLUMN description SET NOT NULL,
  ALTER COLUMN description SET DEFAULT '';