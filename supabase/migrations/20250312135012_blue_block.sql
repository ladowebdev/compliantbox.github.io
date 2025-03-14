/*
  # Clean up unused tables and add user_email field

  1. Changes
    - Drop unused tables (sms_logs, email_logs)
    - Add user_email field to complaints table for better tracking
    
  2. Notes
    - Safely removes unused functionality
    - Maintains data integrity
*/

-- Drop unused tables
DROP TABLE IF EXISTS sms_logs;
DROP TABLE IF EXISTS email_logs;

-- Add user_email field to complaints
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS user_email text NOT NULL;