import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = "https://jkpswqodrvbyemeaatwo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcHN3cW9kcnZieWVtZWFhdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEwNjEsImV4cCI6MjA2NjY5NzA2MX0.P2ZuI5QhzmAu-yI09gOgiM-tF8Rh3TdyOLPfiAN9Rr8";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    const { data, error } = await supabase
        .from('admin_config')
        .select('credit_price')
        .single();
    if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
}