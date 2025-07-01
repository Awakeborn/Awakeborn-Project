// app/api/user-count/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Get the current count
    const { data, error: selectError } = await supabase
      .from('user_counter')
      .select('id, count')
      .limit(1)
      .single();

    if (selectError) {
      return NextResponse.json(
        { success: false, error: selectError.message },
        { status: 500 }
      );
    }

    const newCount = data.count + 1;

    // Update the count
    const { error: updateError } = await supabase
      .from('user_counter')
      .update({ count: newCount })
      .eq('id', data.id);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, newCount });
  } catch (error) {
    console.error('Error updating user count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update count' },
      { status: 500 }
    );
  }
}
