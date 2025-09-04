import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const companyId = request.headers.get("x-company-id");
    if (!companyId) {
        return NextResponse.json({ error: "Company ID is required" }, { status: 400 }); 
    }
    const response = await prisma.company.findFirst(
        {
            where: {
                id: parseInt(companyId)
            }
        }
    );

    return NextResponse.json(response);
}

export async function PUT(request: NextRequest) {
    const companyId = request.headers.get("x-company-id");
    if (!companyId) {
        return NextResponse.json({ error: "Company ID is required" }, { status: 400 }); 
    }
    const data = await request.json();
    const response = await prisma.company.update({
        where: {
            id: parseInt(companyId)
        },
        data: data
    });

    return NextResponse.json(response);
}