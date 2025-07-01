import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/chat-histories?wallet=0xabc...
export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet');
  if (!wallet) {
    return NextResponse.json([], { status: 400 });
  }
  const normalizedWallet = wallet.toLowerCase();
  const { data, error } = await supabase
    .from('chat_histories')
    .select('*')
    .eq('wallet', normalizedWallet)
    .order('date', { ascending: true });

  if (error) {  
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/chat-histories
export async function POST(req: NextRequest) {
  const { wallet, input, output } = await req.json();

  if (!wallet || !input || !output) {
    return NextResponse.json(
      { success: false, message: 'Missing wallet, input, or output' },
      { status: 400 }
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase.from('chat_histories').insert([
    {
      wallet: wallet.toLowerCase(),
      date: today,
      input,
      output,
    },
  ]);

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
