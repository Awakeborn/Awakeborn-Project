-- Create admin_config table for admin settings
CREATE TABLE IF NOT EXISTS admin_config (
    id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL DEFAULT 'admin123',
    credit_price INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin config if table is empty
INSERT INTO admin_config (id, password, credit_price)
VALUES (1, 'admin123', 10)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for admin_config table
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Allow read access to admin_config (for admin login)
CREATE POLICY "Allow read access to admin_config" ON admin_config
    FOR SELECT USING (true);

-- Allow update access to admin_config (for admin operations)
CREATE POLICY "Allow update access to admin_config" ON admin_config
    FOR UPDATE USING (true);

-- Allow insert access to admin_config (for initial setup)
CREATE POLICY "Allow insert access to admin_config" ON admin_config
    FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_config_updated_at 
    BEFORE UPDATE ON admin_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 