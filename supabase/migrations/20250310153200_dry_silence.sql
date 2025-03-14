/*
  # Add SMS logs table and admin response column

  1. New Tables
    - `sms_logs`
      - `id` (uuid, primary key)
      - `complaint_id` (uuid, foreign key to complaints)
      - `message_id` (text, Twilio message SID)
      - `status` (text)
      - `error` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add `admin_response` column to complaints table

  3. Security
    - Enable RLS on `sms_logs` table
    - Add policy for admins to read SMS logs
*/

-- Add admin_response column to complaints table
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS admin_response text;

-- Create SMS logs table
CREATE TABLE IF NOT EXISTS sms_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid REFERENCES complaints(id),
  message_id text,
  status text NOT NULL,
  error text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'undelivered'))
);

-- Enable RLS
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Admins can read SMS logs"
  ON sms_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );