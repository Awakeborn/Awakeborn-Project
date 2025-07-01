import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = "https://bfeoqbepzynvgtahkpna.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZW9xYmVwenludmd0YWhrcG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMzU4MjcsImV4cCI6MjA2NjYxMTgyN30.s_iuMBBtALFWzJlkhI2xRYaE_9FDHJkIhIk8XoTIifY";
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