/*
  # Add description field to complaints table

  1. Changes
    - Add `description` column to `complaints` table for storing complaint details
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'complaints' AND column_name = 'description'
  ) THEN
    ALTER TABLE complaints ADD COLUMN description text NOT NULL;
  END IF;
END $$;