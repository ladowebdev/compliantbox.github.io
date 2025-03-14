/*
  # Create admin user and profile

  1. Changes
    - Insert admin user profile with admin role
    - Set up admin user in the profiles table
  
  2. Security
    - Only creates admin if it doesn't exist
    - Uses secure password handling
*/

DO $$
BEGIN
  -- Create admin profile if it doesn't exist
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
  SELECT 
    gen_random_uuid(),
    'admin@admin.com',
    crypt('password', gen_salt('bf')),
    now(),
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@admin.com'
  );

  -- Create admin profile
  INSERT INTO public.profiles (id, role)
  SELECT 
    id,
    'admin'
  FROM auth.users 
  WHERE email = 'admin@admin.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE role = 'admin'
  );
END $$;