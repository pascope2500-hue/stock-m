import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
try{
const companyId = request.headers.get("x-company-id");
const userId = request.headers.get("x-user-id");
const role = request.headers.get("x-user-id");
if(!companyId || !userId || !role){
    return NextResponse.json({error: "Company ID, User ID, and Role are required"}, {status: 400})
}

  const sales = await prisma.sell.findMany({
    where: {
        inventory: {
            companyId: parseInt(companyId),
            sells: {
                some: {
                    userId: role === "Admin" ? undefined : parseInt(userId)
                }
            }
        }
    },
    include: {
        customer: true,
        inventory: true
    }
  });
  return NextResponse.json(sales);
} catch (error) {
    return NextResponse.json({error: "An error occurred while fetching sales"}, {status: 500})
}
}

export async function POST(request: NextRequest) {
    try{
    const companyId = request.headers.get("x-company-id");
    const userId = request.headers.get("x-user-id");
    const role = request.headers.get("x-user-id");
    if(!companyId || !userId || !role){
        return NextResponse.json({error: "Company ID, User ID, and Role are required"}, {status: 400})
    }
    
    const data = await request.json();
    const {customerName, customerPhone, items} = data;

    async function createSale() {
        if(!companyId || !userId || !role){
        return NextResponse.json({error: "Company ID, User ID, and Role are required"}, {status: 400})
    }
        // Create a new customer
        const customer = await prisma.customer.create({
            data: {
                customerName: customerName,
                customerPhone: customerPhone,
                companyId: parseInt(companyId),
            },
        });
        // Create a new sale
         await Promise.all(
            items.map(async (item: any) => {
                await prisma.sell.create({
                    data: {
                        status: 'Completed',
                        quantity: item.quantity,
                        price: item.price,
                        totalAmount: item.quantity * item.price,
                        userId: parseInt(userId),
                        customerId: customer.id,
                        inventoryId: item.productId,
                    },
                });
            })
        );
    }
    createSale();
    return NextResponse.json({message: "Sale created successfully" })
    
    }catch(err){
        return NextResponse.json({error: "An error occurred while creating the sale"}, {status: 500})
    }
}
