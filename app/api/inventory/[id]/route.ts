import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const inventory = await prisma.inventory.delete({
            where: {
                id: parseInt(id)
            }
        }
        );
        return NextResponse.json({ status: 2020, message: "Inventory deleted successfully" });
    } catch (error) {
        return NextResponse.json({ status: 500, message: "Internal server error" });


    }

}