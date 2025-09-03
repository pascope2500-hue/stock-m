import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
    try{
        const companyId = request.headers.get("x-company-id");
        if(!companyId){
            return NextResponse.json({error: "No company id provided"});
        }
        const inventory = await prisma.inventory.findMany(
            {
                where: {
                    companyId: parseInt(companyId)
                }
            }
        );
        return NextResponse.json(inventory);
    }catch(e){
        return NextResponse.json({error: e});
    }
}

export async function POST(request: NextRequest) {
    
    try{
        const companyId = request.headers.get("x-company-id");
        if(!companyId){
            return NextResponse.json({error: "No company id provided"});
        }
        const data = await request.json();
        data.companyId = parseInt(companyId);
        const inventory = await prisma.inventory.create({
            data: data
        });
        return NextResponse.json({status: 201});
    }catch(e){
        
        
        return NextResponse.json({error: e});
    }
}

export async function PUT(request: NextRequest) {
    try{
        const companyId = request.headers.get("x-company-id");
        if(!companyId){
            return NextResponse.json({error: "No company id provided"});
        }
        const data = await request.json();
        data.companyId = parseInt(companyId);
        const inventory = await prisma.inventory.update({
            where: {
                id: data.id
            },
            data: data
        });
        return NextResponse.json({status: 201});
    }catch(e){
        return NextResponse.json({error: e});
    }
}