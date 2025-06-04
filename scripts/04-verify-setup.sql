-- =====================================================
-- DOLO SUPABASE SETUP VERIFICATION
-- Run this script last to verify everything is working
-- =====================================================

-- =====================================================
-- 1. VERIFY ALL TABLES EXIST
-- =====================================================
SELECT 
  'Tables Created' as check_type,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
ORDER BY table_name;

-- =====================================================
-- 2. CHECK ROW LEVEL SECURITY STATUS
-- =====================================================
SELECT 
  'RLS Status' as check_type,
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
ORDER BY tablename;

-- =====================================================
-- 3. VERIFY RLS POLICIES EXIST
-- =====================================================
SELECT 
  'RLS Policies' as check_type,
  tablename,
  policyname,
  cmd as operation,
  CASE WHEN permissive = 'PERMISSIVE' THEN 'ALLOW' ELSE 'RESTRICT' END as policy_type
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
ORDER BY tablename, policyname;

-- =====================================================
-- 4. CHECK INDEXES ARE CREATED
-- =====================================================
SELECT 
  'Indexes' as check_type,
  tablename,
  indexname,
  CASE WHEN indexname LIKE 'idx_%' THEN 'CUSTOM' ELSE 'SYSTEM' END as index_type
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')
ORDER BY tablename, indexname;

-- =====================================================
-- 5. VERIFY TRIGGERS ARE ACTIVE
-- =====================================================
SELECT 
  'Triggers' as check_type,
  event_object_table as table_name,
  trigger_name,
  event_manipulation as trigger_event,
  action_timing
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
  AND event_object_table IN ('admin_users', 'customers', 'projects')
  AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 6. CHECK FOREIGN KEY CONSTRAINTS
-- =====================================================
SELECT 
  'Foreign Keys' as check_type,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('projects', 'email_logs')
ORDER BY tc.table_name;

-- =====================================================
-- 7. VERIFY ADMIN USERS ARE CONFIGURED
-- =====================================================
SELECT 
  'Admin Users' as check_type,
  email,
  name,
  role,
  is_active,
  created_at
FROM admin_users 
ORDER BY 
  CASE role 
    WHEN 'super_admin' THEN 1 
    WHEN 'admin' THEN 2 
    WHEN 'viewer' THEN 3 
  END;

-- =====================================================
-- 8. FINAL SETUP SUMMARY
-- =====================================================
SELECT 
  'Setup Summary' as component,
  (SELECT COUNT(*) FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('admin_users', 'customers', 'projects', 'contact_submissions', 'email_logs')) as tables_created,
  (SELECT COUNT(*) FROM pg_policies 
   WHERE schemaname = 'public') as rls_policies_created,
  (SELECT COUNT(*) FROM admin_users) as admin_users_created,
  (SELECT COUNT(*) FROM pg_indexes 
   WHERE schemaname = 'public' 
   AND indexname LIKE 'idx_%') as custom_indexes_created;
