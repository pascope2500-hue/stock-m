import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const companyId = request.headers.get("x-company-id");
        if (!companyId) {
            return NextResponse.json({ error: "Missing company id" }, { status: 400 })
        }
        const expired = await prisma.inventory.findMany({
            where: {
                companyId: parseInt(companyId),
                expirationDate: {
                    lte: new Date()
                }
            }
        });

        return NextResponse.json(expired);
    } catch (err) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }

}