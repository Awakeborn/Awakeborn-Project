import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userParam = searchParams.get('id');

    const { data, error } = await supabase
        .from('user_list')
        .select('username, userbirth, avatar_url, credit_balance')
        .eq('id', userParam)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows found
            return NextResponse.json(
                { success: false, message: 'User not found.' },
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

export async function POST(req: NextRequest) {
    const { user_name, user_birth, avatar_url, credit_balance, wallet_address, connect_state } = await req.json();
    // Check if user already exists
    if (!wallet_address) {
        return NextResponse.json({ success: false, message: 'Missing wallet_address' }, { status: 400 });
    }
    const { data: existData, error: selectError } = await supabase
        .from("user_list")
        .select('*')
        .eq('wallet_address', wallet_address)
        .single();

    if (existData) {
        const { error: updateError } = await supabase
            .from('user_list')
            .update({
                ...(user_name !== undefined ? { user_name } : {}),
                ...(user_birth !== undefined ? { user_birth } : {}),
                ...(avatar_url !== undefined ? { avatar_url } : {}),
                ...(credit_balance !== undefined ? { credit_balance } : {}),
                ...(connect_state !== undefined ? { connect_state } : {})
            })
            .eq('wallet_address', wallet_address)

        const { data: updateData, error: selectError } = await supabase
            .from('user_list')
            .select('*')
            .eq('wallet_address', wallet_address)
            .single();

        if (updateError || selectError) {
            return NextResponse.json({ success: false, message: updateError ? updateError?.message : selectError?.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: updateData }, { status: 200 });
    } else {
        const { error: insertError } = await supabase
            .from("user_list")
            .insert([{ wallet_address }])
        const { data: insertedData, error: selectError } = await supabase
            .from("user_list")
            .select('*')
            .eq('wallet_address', wallet_address)
            .single();

        if (insertError || selectError) {
            return NextResponse.json(
                { success: false, message: insertError ? insertError?.message : selectError?.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User added successfully!",
            data: insertedData
        });
    }
}
