import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
export async function POST(req: NextRequest) {
    try{
        // get x-company-id from header
        const companyId = req.headers.get('x-company-id');
        const formData = await req.json();
         const password = await hashPassword(formData.password);
        formData.password = password;
        formData.status = "Active";
       if(companyId) formData.companyId = parseInt(companyId);
        const user = await prisma.user.create({
            data: formData
        });
       
        return NextResponse.json({status:201, message: 'success'});
    }catch(error){
        return NextResponse.json({status: 400, message: 'error'});
    }
    
}

export async function PUT(req: NextRequest,  { params }: { params: { id: string } }) {
    try{
        // get id
     console.log('this id',params);
        const id = params.id;
        if(!id){
            return NextResponse.json({message: 'Id is not found'});
        }

        const formData = await req.json();
         const password = await hashPassword(formData.password);
        formData.password = password
        const user = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: formData
        });
        return NextResponse.json({status:202, message: 'success'});
    }catch(error){
        console.log(error);
        return NextResponse.json({message: 'error'});
    }
}

export async function GET() {
    const users = await prisma.user.findMany(
    {
        // where role not admin
        where:{
            role: {
                not: "Admin"
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
            email: true,
            status: true,
            role: true,
        }
    }
    );
    return NextResponse.json(users);
}