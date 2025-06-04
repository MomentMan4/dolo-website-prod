-- Create private_build_applications table
CREATE TABLE IF NOT EXISTS private_build_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    project_type VARCHAR(100) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    timeline VARCHAR(50) NOT NULL,
    vision TEXT NOT NULL,
    referral_source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_private_build_applications_email ON private_build_applications(email);
CREATE INDEX IF NOT EXISTS idx_private_build_applications_status ON private_build_applications(status);
CREATE INDEX IF NOT EXISTS idx_private_build_applications_created_at ON private_build_applications(created_at);

-- Enable RLS
ALTER TABLE private_build_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can view all private build applications" ON private_build_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Add trigger for updated_at
CREATE TRIGGER update_private_build_applications_updated_at 
    BEFORE UPDATE ON private_build_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE private_build_applications IS 'Stores private build application submissions';
