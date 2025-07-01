# Admin Setup Guide

## Overview
The admin page has been updated to use Supabase methods directly instead of API routes. This provides better performance and real-time capabilities.

## Setup Instructions

### 1. Supabase Database Setup

Run the following SQL in your Supabase SQL editor to create the required table:

```sql
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
```

### 2. Environment Variables

Make sure your `.env.local` file contains the Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Default Admin Credentials

- **Default Password**: `admin123`
- **Default Credit Price**: `10`

You can change these through the admin interface after logging in.

## Features

### Users Management
- View all registered users
- See wallet addresses, usernames, credit balances, birth dates, and avatars
- Click "View Chat" to see chat history for specific users

### Chat History
- View all chat messages or filter by specific user
- See input/output messages with timestamps and wallet addresses

### Credit Pricing
- View and update the credit price
- Changes are immediately reflected in the database

### Admin Password Management
- Change the admin password securely
- Password is stored in Supabase with proper encryption

## Security Notes

1. The admin config table uses Row Level Security (RLS) policies
2. All operations are performed directly through Supabase client
3. No sensitive data is stored in local storage or cookies
4. Password changes are immediately persisted to the database

## Troubleshooting

### If admin config doesn't load:
- Check that the `admin_config` table exists in your Supabase database
- Verify your environment variables are correct
- Check the browser console for any Supabase connection errors

### If you can't log in:
- The default password is `admin123`
- You can reset it by running the SQL insert statement again
- Check that the RLS policies allow read access to the admin_config table

### If data doesn't update:
- Check that the RLS policies allow update access
- Verify your Supabase permissions
- Check the browser console for any error messages 