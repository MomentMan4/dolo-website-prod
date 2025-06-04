-- Fix infinite recursion in admin_users policies
DROP POLICY IF EXISTS "Admin users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Only super_admins can modify admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin can view all admin users" ON admin_users;

-- Create simplified admin_users policies
CREATE POLICY "Anyone can view admin users" ON admin_users
    FOR SELECT USING (true);

CREATE POLICY "Only super_admins can modify admin users" ON admin_users
    FOR ALL USING (
        (auth.jwt() ->> 'email') IN (
            SELECT email FROM admin_users WHERE role = 'super_admin' AND is_active = true
        )
    );

-- Fix private_build_applications policies
DROP POLICY IF EXISTS "Admin can view all private build applications" ON private_build_applications;
DROP POLICY IF EXISTS "Admin users can access private build applications" ON private_build_applications;

-- Create simplified private_build_applications policies
CREATE POLICY "Anyone can insert private build applications" ON private_build_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin users can view private build applications" ON private_build_applications
    FOR SELECT USING (
        (auth.jwt() ->> 'email') IN (
            SELECT email FROM admin_users WHERE is_active = true
        )
    );

-- Fix quiz_results policies
DROP POLICY IF EXISTS "Admin can view all quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Admin users can access quiz results" ON quiz_results;

-- Create simplified quiz_results policies
CREATE POLICY "Anyone can insert quiz results" ON quiz_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin users can view quiz results" ON quiz_results
    FOR SELECT USING (
        (auth.jwt() ->> 'email') IN (
            SELECT email FROM admin_users WHERE is_active = true
        )
    );

-- Fix contact_submissions policies
DROP POLICY IF EXISTS "Admin can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin users can access contact submissions" ON contact_submissions;

-- Create simplified contact_submissions policies
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin users can view contact submissions" ON contact_submissions
    FOR SELECT USING (
        (auth.jwt() ->> 'email') IN (
            SELECT email FROM admin_users WHERE is_active = true
        )
    );

-- Ensure tables have RLS enabled
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS private_build_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_submissions ENABLE ROW LEVEL SECURITY;

-- Add comments for documentation
COMMENT ON TABLE admin_users IS 'Stores admin user information with RLS policies';
COMMENT ON TABLE private_build_applications IS 'Stores private build application submissions with RLS policies';
COMMENT ON TABLE quiz_results IS 'Stores quiz results with RLS policies';
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions with RLS policies';
