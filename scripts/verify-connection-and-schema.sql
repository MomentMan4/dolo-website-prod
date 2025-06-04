-- =====================================================
-- DOLO SUPABASE CONNECTION & SCHEMA VERIFICATION
-- Comprehensive validation of database setup
-- =====================================================

-- =====================================================
-- 1. CONNECTION TEST - Basic Query
-- =====================================================
SELECT 
  'Connection Test' as test_type,
  current_database() as database_name,
  current_user as connected_user,
  version() as postgres_version,
  now() as connection_time;

-- =====================================================
-- 2. TABLE EXISTENCE VERIFICATION
-- =====================================================
SELECT 
  'Table Verification' as test_type,
  table_name,
  table_type,
  CASE 
    WHEN table_name IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs') 
    THEN '✅ REQUIRED TABLE FOUND'
    ELSE '⚠️ UNEXPECTED TABLE'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY 
  CASE 
    WHEN table_name = 'admin_users' THEN 1
    WHEN table_name = 'customers' THEN 2
    WHEN table_name = 'projects' THEN 3
    WHEN table_name = 'contact_submissions' THEN 4
    WHEN table_name = 'email_logs' THEN 5
    ELSE 99
  END;

-- =====================================================
-- 3. DETAILED SCHEMA VALIDATION
-- =====================================================

-- Admin Users Table Schema
SELECT 
  'admin_users Schema' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'email', 'name', 'role', 'is_active', 'created_at', 'updated_at') 
    THEN '✅ REQUIRED'
    ELSE '📋 OPTIONAL'
  END as column_status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'admin_users'
ORDER BY ordinal_position;

-- Customers Table Schema
SELECT 
  'customers Schema' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'stripe_customer_id', 'email', 'name', 'chat_access_token', 'created_at') 
    THEN '✅ REQUIRED'
    ELSE '📋 OPTIONAL'
  END as column_status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'customers'
ORDER BY ordinal_position;

-- Projects Table Schema
SELECT 
  'projects Schema' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'customer_id', 'project_type', 'status', 'total_amount', 'created_at') 
    THEN '✅ REQUIRED'
    ELSE '📋 OPTIONAL'
  END as column_status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'projects'
ORDER BY ordinal_position;

-- =====================================================
-- 4. ROW LEVEL SECURITY STATUS
-- =====================================================
SELECT 
  'RLS Status' as test_type,
  tablename as table_name,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS ENABLED' 
    ELSE '⚠️ RLS DISABLED' 
  END as security_status,
  CASE 
    WHEN rowsecurity THEN '✅ SECURE'
    ELSE '❌ NEEDS ATTENTION'
  END as recommendation
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
ORDER BY tablename;

-- =====================================================
-- 5. RLS POLICIES VERIFICATION
-- =====================================================
SELECT 
  'RLS Policies' as test_type,
  tablename,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ' ORDER BY policyname) as policy_names,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ ADEQUATE POLICIES'
    WHEN COUNT(*) = 1 THEN '⚠️ MINIMAL POLICIES'
    ELSE '❌ NO POLICIES'
  END as policy_status
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
GROUP BY tablename
ORDER BY tablename;

-- =====================================================
-- 6. FOREIGN KEY CONSTRAINTS CHECK
-- =====================================================
SELECT 
  'Foreign Keys' as test_type,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column,
  '✅ CONSTRAINT ACTIVE' as status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('projects', 'email_logs')
ORDER BY tc.table_name;

-- =====================================================
-- 7. INDEX VERIFICATION
-- =====================================================
SELECT 
  'Indexes' as test_type,
  tablename,
  indexname,
  CASE 
    WHEN indexname LIKE 'idx_%' THEN '🚀 PERFORMANCE INDEX'
    WHEN indexname LIKE '%_pkey' THEN '🔑 PRIMARY KEY'
    WHEN indexname LIKE '%_key' THEN '🔒 UNIQUE CONSTRAINT'
    ELSE '📋 SYSTEM INDEX'
  END as index_type,
  '✅ ACTIVE' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
ORDER BY tablename, indexname;

-- =====================================================
-- 8. DATA VALIDATION - Check Admin Users
-- =====================================================
SELECT 
  'Admin Users Data' as test_type,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'viewer' THEN 1 END) as viewers,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ ADMIN USERS CONFIGURED'
    WHEN COUNT(*) > 0 THEN '⚠️ PARTIAL SETUP'
    ELSE '❌ NO ADMIN USERS'
  END as setup_status
FROM admin_users;

-- Show actual admin users (if any exist)
SELECT 
  'Admin User Details' as test_type,
  email,
  name,
  role,
  is_active,
  created_at,
  CASE 
    WHEN email LIKE '%dolobuilds.com' THEN '✅ CORRECT DOMAIN'
    ELSE '⚠️ CHECK DOMAIN'
  END as email_validation
FROM admin_users 
ORDER BY 
  CASE role 
    WHEN 'super_admin' THEN 1 
    WHEN 'admin' THEN 2 
    WHEN 'viewer' THEN 3 
  END;

-- =====================================================
-- 9. WRITE PERMISSION TEST
-- =====================================================
-- Test INSERT capability (will rollback)
BEGIN;

-- Test contact submission insert (should work - public access)
INSERT INTO contact_submissions (name, email, company, message, source) 
VALUES ('Test User', 'test@example.com', 'Test Company', 'Connection test message', 'verification-test');

SELECT 
  'Write Test' as test_type,
  'contact_submissions' as table_name,
  'INSERT' as operation,
  '✅ SUCCESS' as result,
  'Public table write access confirmed' as details;

-- Rollback the test data
ROLLBACK;

-- =====================================================
-- 10. COMPREHENSIVE STATUS REPORT
-- =====================================================
SELECT 
  'Final Status Report' as report_type,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')) as tables_found,
  (SELECT COUNT(*) FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
   AND rowsecurity = true) as tables_with_rls,
  (SELECT COUNT(*) FROM pg_policies 
   WHERE schemaname = 'public') as total_policies,
  (SELECT COUNT(*) FROM admin_users) as admin_users_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')) = 5
    THEN '✅ DATABASE FULLY OPERATIONAL'
    ELSE '⚠️ SETUP INCOMPLETE'
  END as overall_status;

-- =====================================================
-- 11. NEXT STEPS RECOMMENDATIONS
-- =====================================================
SELECT 
  'Recommendations' as category,
  CASE 
    WHEN (SELECT COUNT(*) FROM admin_users) = 0 
    THEN '1. Create admin users in admin_users table'
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') < 10
    THEN '2. Verify all RLS policies are created'
    WHEN (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false) > 0
    THEN '3. Enable RLS on all tables'
    ELSE '✅ Database setup is complete - ready for application integration'
  END as next_action,
  now() as checked_at;
