// app/api/wallets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET wallets (all or single by query param)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletParam = searchParams.get('wallet');

  if (walletParam) {
    // Fetch a single wallet
    const walletLower = walletParam.toLowerCase();

    const { data, error } = await supabase
      .from('paid_wallets')
      .select('wallet, user_id, state')
      .eq('wallet', walletLower)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return NextResponse.json(
          { success: false, message: 'Wallet not found.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  }

  // If no wallet param, fetch all wallets
  const { data, error } = await supabase
    .from('paid_wallets')
    .select('wallet, user_id, state')
    .order('inserted_at', { ascending: false });

  if (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// POST a new wallet
export async function POST(req: NextRequest) {
  const { wallet, user_id, state } = await req.json();

  if (!wallet || !user_id) {
    return NextResponse.json({ success: false, message: 'Missing wallet or user_id' }, { status: 400 });
  }

  const walletLower = wallet.toLowerCase();

  // Check if wallet exists by wallet address
  const { data: existing, error: selectError } = await supabase
    .from('paid_wallets')
    .select('id')
    .eq('wallet', walletLower)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    return NextResponse.json({ success: false, message: selectError.message }, { status: 500 });
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('paid_wallets')
      .update({
        user_id,
        ...(state !== undefined ? { state } : {})
      })
      .eq('id', existing.id)

    const { data: existData, error: selectError } = await supabase
      .from("paid_wallets")
      .select('id, wallet, state, user_id')
      .eq('id', existing.id)
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, message: updateError.message },
        { status: 500 }
      );
    } else if (selectError) {
      return NextResponse.json(
        { success: false, message: selectError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: existData,
      message: 'Wallet updated successfully.'
    });
  }

  // Insert new wallet
  const { error: insertError } = await supabase
    .from('paid_wallets')
    .insert([{ wallet: walletLower, user_id, ...(state !== undefined ? { state } : {}) }])

  const { data: insertedData, error: addError } = await supabase
    .from("paid_wallets")
    .select('id, wallet, state, user_id')
    .eq('wallet', walletLower)
    .single();

  if (insertError) {
    return NextResponse.json({ success: false, message: insertError.message }, { status: 500 });
  } else if (addError) {
    return NextResponse.json({ success: false, message: addError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: insertedData, message: 'Wallet added successfully.' });
}
