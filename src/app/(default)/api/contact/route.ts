import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, category, description } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "awakeborn.ai@gmail.com",
      pass: "ceme tbvf afmv pbco"
    },
  });

  const mailOptions = {
    from: email,
    to: 'support@awakeborn.com',
    subject: `[Awakeborn Support] ${category} from ${name}`,
    text: `Category: ${category}\nFrom: ${name} (${email})\n\nMessage:\n${description}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
