import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(request) {
  try {
    const { otp, token } = await request.json();

    if (!otp || !token) {
      return NextResponse.json({ error: "OTP and token are required" }, { status: 400 });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    if (!decoded || decoded.otp !== otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }
}
