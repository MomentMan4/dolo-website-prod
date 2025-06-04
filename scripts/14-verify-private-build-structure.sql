-- Check the exact structure and permissions of private_build_applications
-- This is working, so we need to replicate this exactly

-- Check if private_build_applications has RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('private_build_applications', 'contact_submissions');

-- Check policies on private_build_applications
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'private_build_applications';

-- Check table permissions for private_build_applications
SELECT 
    grantee,
    privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'private_build_applications';

-- Check sequence permissions for private_build_applications
SELECT 
    grantee,
    privilege_type
FROM information_schema.usage_privileges 
WHERE object_name = 'private_build_applications_id_seq';

-- Now check contact_submissions for comparison
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- Test both tables with identical inserts
DO $$
DECLARE
    pb_id INTEGER;
    cs_id INTEGER;
BEGIN
    -- Test private_build_applications (this should work)
    BEGIN
        INSERT INTO private_build_applications (name, email, project_type, budget, timeline, vision, status, created_at)
        VALUES ('Test PB', 'test@pb.com', 'website', '1000-5000', '1-2 months', 'Test vision', 'new', NOW())
        RETURNING id INTO pb_id;
        
        RAISE NOTICE 'Private build test successful: ID %', pb_id;
        
        DELETE FROM private_build_applications WHERE id = pb_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Private build test failed: %', SQLERRM;
    END;
    
    -- Test contact_submissions (this should now work too)
    BEGIN
        INSERT INTO contact_submissions (name, email, message, source, status, created_at)
        VALUES ('Test CS', 'test@cs.com', 'Test message', 'test', 'new', NOW())
        RETURNING id INTO cs_id;
        
        RAISE NOTICE 'Contact submissions test successful: ID %', cs_id;
        
        DELETE FROM contact_submissions WHERE id = cs_id;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Contact submissions test failed: %', SQLERRM;
    END;
END $$;
