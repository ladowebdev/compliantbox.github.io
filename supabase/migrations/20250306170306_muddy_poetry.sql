/*
  # Add description field to complaints table

  1. Changes
    - Add `description` column to complaints table
    
  2. Notes
    - Description field is required and has a default value
*/

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT 'No description provided';