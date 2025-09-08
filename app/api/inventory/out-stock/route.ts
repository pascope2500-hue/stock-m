import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const companyId = request.headers.get("x-company-id");
        if (!companyId) {
            return NextResponse.json({ error: "Missing company id" }, { status: 400 })
        }

        const getLowThreadStock = await prisma.company.findFirst(
            {
                where: {
                    id: parseInt(companyId)
                },
                select: {
                    lowStockLevel: true
                }
            }
        );
        const outStock = await prisma.inventory.findMany({
            where: {
                companyId: parseInt(companyId),
                quantity: { lte: getLowThreadStock?.lowStockLevel ?? 0 }
            }
        });

        return NextResponse.json(outStock);
    } catch (err) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }

}