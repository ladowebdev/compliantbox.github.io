/*
  # Optimize Database Schema

  1. Changes
    - Remove unused tables
    - Add performance indexes
    - Add user email tracking
    
  2. Notes
    - Improves query performance
    - Enhances data tracking
*/

-- Drop unused tables if they exist
DROP TABLE IF EXISTS sms_logs;
DROP TABLE IF EXISTS email_logs;

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_district ON complaints(district);
CREATE INDEX IF NOT EXISTS idx_complaints_service_category ON complaints(service_category);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);

-- Add user_email column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'complaints' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE complaints ADD COLUMN user_email text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Clean up any orphaned complaints
DELETE FROM complaints WHERE user_id NOT IN (SELECT id FROM auth.users);