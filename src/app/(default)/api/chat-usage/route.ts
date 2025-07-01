// app/api/chat-usage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('chat_usage')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();
  const today = new Date().toISOString().split('T')[0];

  const normalizedWallet = wallet.toLowerCase();
  // Check if a record already exists
  const { data: existing, error: selectError } = await supabase
    .from('chat_usage')
    .select('id, count')
    .eq('wallet', normalizedWallet)
    .eq('date', today)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    // This error code means "No rows returned"; ignore it.
    console.log(selectError, selectError.code)
    return NextResponse.json({ success: false, message: selectError.message }, { status: 500 });
  }

  if (existing) {
    // Update the count
    const { error: updateError } = await supabase
      .from('chat_usage')
      .update({ count: existing.count + 1 })
      .eq('id', existing.id);

    if (updateError) {
      return NextResponse.json({ success: false, message: updateError.message }, { status: 500 });
    }
  } else {
    // Insert a new record
    const { error: insertError } = await supabase
      .from('chat_usage')
      .insert([{ wallet: normalizedWallet, date: today, count: 1 }]);

    if (insertError) {
      return NextResponse.json({ success: false, message: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
