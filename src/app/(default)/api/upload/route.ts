import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json(
            { success: false, message: "Missing file!" },
            { status: 400 }
        );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = `${Date.now()}-${file.name}`;

    // Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await (supabase as any).storage
        .from("user-avatars")
        .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
        });

    if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
            { success: false, message: uploadError.message },
            { status: 500 }
        );
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData, error: publicUrlError } = (supabase as any).storage
        .from("user-avatars")
        .getPublicUrl(filePath);

    if (publicUrlError) {
        console.error("Get public URL error:", publicUrlError);
        return NextResponse.json(
            { success: false, message: publicUrlError.message },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Avatar uploaded successfully!",
        avatarUrl: publicUrlData.publicUrl
    });
}
