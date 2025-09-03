import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
        return NextResponse.redirect('/');
    }
    const decoded = await verifyToken(token);
    if (!decoded) {
        return NextResponse.redirect('/');
    }
    return NextResponse.json(decoded);
}