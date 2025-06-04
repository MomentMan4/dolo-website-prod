-- Drop the problematic policy causing infinite recursion
DROP POLICY IF EXISTS "Admin can view all private build applications" ON private_build_applications;

-- Create a new policy that avoids recursion by using a direct email check
CREATE POLICY "Admin users can access private build applications" ON private_build_applications
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users WHERE is_active = true
        )
    );

-- Fix any potential recursion in admin_users policies
DROP POLICY IF EXISTS "Admin users can view admin users" ON admin_users;

-- Create a simpler policy for admin_users that avoids recursion
CREATE POLICY "Admin users can view admin users" ON admin_users
    FOR SELECT USING (true);

-- Create policy for insert/update/delete that only allows super_admins
CREATE POLICY "Only super_admins can modify admin users" ON admin_users
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users WHERE role = 'super_admin' AND is_active = true
        )
    );

-- Add comment for documentation
COMMENT ON TABLE private_build_applications IS 'Stores private build application submissions';
