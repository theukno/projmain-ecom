import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Store in .env
const OTP_EXPIRY = 5 * 60; // 5 minutes

export async function POST(request) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create JWT storing OTP securely
    const token = jwt.sign({ email, phone, otp, exp: Math.floor(Date.now() / 1000) + OTP_EXPIRY }, SECRET_KEY);

    console.log(`OTP for ${email || phone}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      token, // Send token to client for verification
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
  }
}
