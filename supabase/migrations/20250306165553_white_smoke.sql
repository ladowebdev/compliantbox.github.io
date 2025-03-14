/*
  # Add description field to complaints table

  1. Changes
    - Add `description` column to `complaints` table for storing complaint details
    - Set default empty string for new rows
    - Make column NOT NULL to ensure all complaints have a description
*/

-- Add description column
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS description text DEFAULT '';

-- Update any existing NULL values to empty string
UPDATE complaints SET description = '' WHERE description IS NULL;

-- Make the column NOT NULL
ALTER TABLE complaints ALTER COLUMN description SET NOT NULL;