-- Comprehensive RLS Policy Fix for All Tables
-- This script resolves infinite recursion issues and ensures proper form submissions

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Admin users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Only super_admins can modify admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Anyone can view admin users" ON admin_users;

DROP POLICY IF EXISTS "Admin can view all private build applications" ON private_build_applications;
DROP POLICY IF EXISTS "Admin users can access private build applications" ON private_build_applications;
DROP POLICY IF EXISTS "Anyone can insert private build applications" ON private_build_applications;
DROP POLICY IF EXISTS "Admin users can view private build applications" ON private_build_applications;

DROP POLICY IF EXISTS "Admin can view all quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Admin users can access quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Anyone can insert quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Admin users can view quiz results" ON quiz_results;

DROP POLICY IF EXISTS "Admin can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin users can access contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin users can view contact submissions" ON contact_submissions;

-- Disable RLS temporarily to avoid conflicts
ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS private_build_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quiz_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_logs DISABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_select_policy" ON admin_users
    FOR SELECT USING (true);

CREATE POLICY "admin_users_insert_policy" ON admin_users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_users_update_policy" ON admin_users
    FOR UPDATE USING (true);

-- Create simple policies for contact_submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_submissions_insert_policy" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_submissions_select_policy" ON contact_submissions
    FOR SELECT USING (true);

CREATE POLICY "contact_submissions_update_policy" ON contact_submissions
    FOR UPDATE USING (true);

-- Create simple policies for quiz_results (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quiz_results') THEN
        ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "quiz_results_insert_policy" ON quiz_results
            FOR INSERT WITH CHECK (true);
            
        CREATE POLICY "quiz_results_select_policy" ON quiz_results
            FOR SELECT USING (true);
            
        CREATE POLICY "quiz_results_update_policy" ON quiz_results
            FOR UPDATE USING (true);
    END IF;
END $$;

-- Create simple policies for private_build_applications (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'private_build_applications') THEN
        ALTER TABLE private_build_applications ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "private_build_applications_insert_policy" ON private_build_applications
            FOR INSERT WITH CHECK (true);
            
        CREATE POLICY "private_build_applications_select_policy" ON private_build_applications
            FOR SELECT USING (true);
            
        CREATE POLICY "private_build_applications_update_policy" ON private_build_applications
            FOR UPDATE USING (true);
    END IF;
END $$;

-- Create simple policies for email_logs (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_logs') THEN
        ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "email_logs_insert_policy" ON email_logs
            FOR INSERT WITH CHECK (true);
            
        CREATE POLICY "email_logs_select_policy" ON email_logs
            FOR SELECT USING (true);
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Add comments for documentation
COMMENT ON TABLE admin_users IS 'Admin users with simplified RLS policies to prevent recursion';
COMMENT ON TABLE contact_submissions IS 'Contact form submissions with open access policies';

-- Log the completion
DO $$
BEGIN
    RAISE NOTICE 'Comprehensive RLS policy fix completed successfully';
END $$;
