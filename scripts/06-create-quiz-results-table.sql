-- Create quiz_results table to store quiz submissions
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    description TEXT,
    link VARCHAR(255),
    consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_results_email ON quiz_results(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at);

-- Enable RLS
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can view all quiz results" ON quiz_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quiz_results_updated_at 
    BEFORE UPDATE ON quiz_results 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert a comment for documentation
COMMENT ON TABLE quiz_results IS 'Stores quiz submissions and plan recommendations';
