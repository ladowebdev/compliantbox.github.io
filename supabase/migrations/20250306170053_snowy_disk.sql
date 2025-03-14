/*
  # Remove description field from complaints table

  1. Changes
    - Remove `description` column from complaints table
    
  2. Notes
    - This migration safely removes the description field
*/

ALTER TABLE complaints DROP COLUMN IF EXISTS description;