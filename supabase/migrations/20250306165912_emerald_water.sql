/*
  # Add description field to complaints table

  1. Changes
    - Add `description` column to complaints table with proper constraints
    - Set default value to handle existing and new records
  
  2. Notes
    - Column is required for all new complaints
    - Existing records will get an empty string as description
*/

-- Add description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'complaints' AND column_name = 'description'
  ) THEN
    -- Add column as nullable first
    ALTER TABLE complaints ADD COLUMN description text;
    
    -- Set default value for existing records
    UPDATE complaints SET description = '' WHERE description IS NULL;
    
    -- Make it non-nullable with default
    ALTER TABLE complaints 
      ALTER COLUMN description SET NOT NULL,
      ALTER COLUMN description SET DEFAULT '';
  END IF;
END $$;