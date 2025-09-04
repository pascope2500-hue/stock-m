import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    await prisma.notification.deleteMany({
        where: {
            id: Number(id)
        }
    })
    return NextResponse.json({ message: "Notification deleted" },{status: 200});
    
}