-- =====================================================
-- DOLO ADMIN USERS SETUP
-- Run this script third in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. INSERT DOLO ADMIN USERS
-- =====================================================

-- Insert Super Admin
INSERT INTO admin_users (email, name, role) 
VALUES ('admin@dolobuilds.com', 'Dolo Super Admin', 'super_admin')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = true,
  updated_at = NOW();

-- Insert Standard Admin
INSERT INTO admin_users (email, name, role) 
VALUES ('hello@dolobuilds.com', 'Dolo Admin Team', 'admin')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = true,
  updated_at = NOW();

-- Insert Viewer (Social Media Team)
INSERT INTO admin_users (email, name, role) 
VALUES ('socials@dolobuilds.com', 'Dolo Social Media Team', 'viewer')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = true,
  updated_at = NOW();

-- =====================================================
-- 2. VERIFY ADMIN USERS CREATION
-- =====================================================
SELECT 
  id,
  email,
  name,
  role,
  is_active,
  created_at,
  updated_at
FROM admin_users 
ORDER BY 
  CASE role 
    WHEN 'super_admin' THEN 1 
    WHEN 'admin' THEN 2 
    WHEN 'viewer' THEN 3 
  END,
  created_at ASC;

-- =====================================================
-- 3. DISPLAY ROLE SUMMARY
-- =====================================================
SELECT 
  'Admin Users Summary' as component,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewers,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
FROM admin_users;
