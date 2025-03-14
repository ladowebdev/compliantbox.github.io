/*
  # Complaint Registration System Schema

  1. New Tables
    - `complaints`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `address` (text)
      - `district` (text)
      - `service_category` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on complaints table
    - Add policies for:
      - Users can create complaints
      - Users can read their own complaints
      - Admins can read all complaints
*/

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  district text NOT NULL,
  service_category text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Allow users to create complaints
CREATE POLICY "Users can create complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own complaints
CREATE POLICY "Users can read own complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to read all complaints
CREATE POLICY "Admins can read all complaints"
  ON complaints
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );