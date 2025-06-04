-- Create helper functions to create tables if they don't exist

-- Function to create contact_submissions table
CREATE OR REPLACE FUNCTION create_contact_submissions_table()
RETURNS void AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'contact_submissions'
  ) THEN
    -- Create the table
    CREATE TABLE public.contact_submissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      message TEXT NOT NULL,
      source TEXT,
      status TEXT DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add comment
    COMMENT ON TABLE public.contact_submissions IS 'Stores contact form submissions';
    
    -- Enable RLS
    ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions
      FOR INSERT WITH CHECK (true);
      
    CREATE POLICY "Admin users can view contact submissions" ON public.contact_submissions
      FOR SELECT USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create quiz_results table
CREATE OR REPLACE FUNCTION create_quiz_results_table()
RETURNS void AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'quiz_results'
  ) THEN
    -- Create the table
    CREATE TABLE public.quiz_results (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL,
      plan TEXT NOT NULL,
      description TEXT,
      link TEXT,
      consent BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add comment
    COMMENT ON TABLE public.quiz_results IS 'Stores quiz results and recommendations';
    
    -- Enable RLS
    ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Anyone can insert quiz results" ON public.quiz_results
      FOR INSERT WITH CHECK (true);
      
    CREATE POLICY "Admin users can view quiz results" ON public.quiz_results
      FOR SELECT USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create private_build_applications table
CREATE OR REPLACE FUNCTION create_private_build_applications_table()
RETURNS void AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'private_build_applications'
  ) THEN
    -- Create the table
    CREATE TABLE public.private_build_applications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      project_type TEXT NOT NULL,
      budget TEXT NOT NULL,
      timeline TEXT NOT NULL,
      vision TEXT NOT NULL,
      referral_source TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add comment
    COMMENT ON TABLE public.private_build_applications IS 'Stores private build application submissions';
    
    -- Enable RLS
    ALTER TABLE public.private_build_applications ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Anyone can insert private build applications" ON public.private_build_applications
      FOR INSERT WITH CHECK (true);
      
    CREATE POLICY "Admin users can view private build applications" ON public.private_build_applications
      FOR SELECT USING (true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
