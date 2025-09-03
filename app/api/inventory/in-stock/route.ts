import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const companyId = request.headers.get("x-company-id");
        if (!companyId) {
            return NextResponse.json({ error: "Missing company id" }, { status: 400 })
        }
        const inStock = await prisma.inventory.findMany({
            where: {
                companyId: parseInt(companyId),
                quantity: {
                    gt: 0
                }
            }
        });

        console.log(inStock);
        return NextResponse.json(inStock);
    } catch (err) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }

}