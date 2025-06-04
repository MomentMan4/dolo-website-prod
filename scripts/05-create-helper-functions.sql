-- =====================================================
-- DOLO SUPABASE HELPER FUNCTIONS
-- Run this script to add helper functions to the database
-- =====================================================

-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (
  table_name TEXT,
  row_count BIGINT,
  has_rls BOOLEAN
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::TEXT,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t.tablename)::BIGINT,
    t.rowsecurity
  FROM 
    pg_tables t
  WHERE 
    t.schemaname = 'public'
  ORDER BY 
    t.tablename;
END;
$$;

-- Function to check database health
CREATE OR REPLACE FUNCTION check_db_health()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'status', 'healthy',
      'tables', (
        SELECT jsonb_agg(jsonb_build_object(
          'name', table_name,
          'rows', row_count,
          'has_rls', has_rls
        ))
        FROM get_tables()
      ),
      'timestamp', now()
    ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_tables TO authenticated;
GRANT EXECUTE ON FUNCTION check_db_health TO authenticated;
