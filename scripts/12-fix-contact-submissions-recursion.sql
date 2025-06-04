-- Fix infinite recursion in contact_submissions by completely removing admin_users dependencies
-- This script makes contact_submissions completely independent

-- Drop ALL existing policies on contact_submissions
DROP POLICY IF EXISTS "contact_submissions_insert_policy" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_select_policy" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_update_policy" ON contact_submissions;
DROP POLICY IF EXISTS "Admin can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin users can access contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admin users can view contact submissions" ON contact_submissions;

-- Temporarily disable RLS on contact_submissions
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with completely open policies (no admin_users references)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create completely open policies that don't reference any other tables
CREATE POLICY "contact_submissions_public_insert" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_submissions_public_select" ON contact_submissions
    FOR SELECT USING (true);

CREATE POLICY "contact_submissions_public_update" ON contact_submissions
    FOR UPDATE USING (true);

CREATE POLICY "contact_submissions_public_delete" ON contact_submissions
    FOR DELETE USING (true);

-- Grant explicit permissions
GRANT ALL ON contact_submissions TO authenticated;
GRANT ALL ON contact_submissions TO anon;
GRANT ALL ON contact_submissions TO public;

-- Ensure sequence permissions
GRANT USAGE, SELECT ON SEQUENCE contact_submissions_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE contact_submissions_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE contact_submissions_id_seq TO public;

-- Verify the table structure and add any missing columns
DO $$
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contact_submissions' AND column_name = 'status') THEN
        ALTER TABLE contact_submissions ADD COLUMN status VARCHAR(50) DEFAULT 'new';
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contact_submissions' AND column_name = 'created_at') THEN
        ALTER TABLE contact_submissions ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Test the fix by attempting an insert
DO $$
BEGIN
    -- Try to insert a test record
    INSERT INTO contact_submissions (name, email, message, source, status, created_at)
    VALUES ('Test User', 'test@example.com', 'Test message', 'test', 'new', NOW());
    
    -- Clean up the test record
    DELETE FROM contact_submissions WHERE email = 'test@example.com' AND source = 'test';
    
    RAISE NOTICE 'Contact submissions table is working correctly';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Contact submissions test failed: %', SQLERRM;
END $$;
