-- =====================================================
-- DOLO SUPABASE ROW LEVEL SECURITY POLICIES
-- Run this script second in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. DROP EXISTING POLICIES (IF ANY)
-- =====================================================
DROP POLICY IF EXISTS "Admin users can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admin can insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admin can update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can view customers" ON customers;
DROP POLICY IF EXISTS "Admin users can insert customers" ON customers;
DROP POLICY IF EXISTS "Admin users can update customers" ON customers;
DROP POLICY IF EXISTS "Admin users can view projects" ON projects;
DROP POLICY IF EXISTS "Admin users can insert projects" ON projects;
DROP POLICY IF EXISTS "Admin users can update projects" ON projects;
DROP POLICY IF EXISTS "Admin users can view contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can insert contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin users can update contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin users can view email_logs" ON email_logs;
DROP POLICY IF EXISTS "System can insert email_logs" ON email_logs;

-- =====================================================
-- 3. ADMIN_USERS TABLE POLICIES
-- =====================================================

-- Only authenticated admin users can view admin_users table
CREATE POLICY "Admin users can view admin_users" ON admin_users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- Only super_admin can insert new admin users
CREATE POLICY "Super admin can insert admin_users" ON admin_users
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE role = 'super_admin' AND is_active = true
      )
    )
  );

-- Only super_admin can update admin users
CREATE POLICY "Super admin can update admin_users" ON admin_users
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE role = 'super_admin' AND is_active = true
      )
    )
  );

-- =====================================================
-- 4. CUSTOMERS TABLE POLICIES
-- =====================================================

-- Admin users can view all customers
CREATE POLICY "Admin users can view customers" ON customers
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- Admin users can insert customers
CREATE POLICY "Admin users can insert customers" ON customers
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- Admin users can update customers
CREATE POLICY "Admin users can update customers" ON customers
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- =====================================================
-- 5. PROJECTS TABLE POLICIES
-- =====================================================

-- Admin users can view all projects
CREATE POLICY "Admin users can view projects" ON projects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- Admin users can insert projects
CREATE POLICY "Admin users can insert projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- Admin users can update projects
CREATE POLICY "Admin users can update projects" ON projects
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- =====================================================
-- 6. CONTACT_SUBMISSIONS TABLE POLICIES
-- =====================================================

-- Admin users can view all contact submissions
CREATE POLICY "Admin users can view contact_submissions" ON contact_submissions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- Anyone can insert contact submissions (for public forms)
CREATE POLICY "Anyone can insert contact_submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Admin users can update contact submissions
CREATE POLICY "Admin users can update contact_submissions" ON contact_submissions
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- =====================================================
-- 7. EMAIL_LOGS TABLE POLICIES
-- =====================================================

-- Admin users can view all email logs
CREATE POLICY "Admin users can view email_logs" ON email_logs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT auth.uid() FROM auth.users 
      WHERE auth.users.email IN (
        SELECT email FROM admin_users WHERE is_active = true
      )
    )
  );

-- System can insert email logs (for automated emails)
CREATE POLICY "System can insert email_logs" ON email_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 8. VERIFY RLS IS ENABLED
-- =====================================================
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
ORDER BY tablename;
