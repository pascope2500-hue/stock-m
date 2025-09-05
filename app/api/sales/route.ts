import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";

export async function GET(request: NextRequest) {
    try {
        const companyId = request.headers.get("x-company-id");
        const userId = request.headers.get("x-user-id");
        const role = request.headers.get("x-user-role");
        
        if (!companyId || !userId || !role) {
            return NextResponse.json(
                { error: "Company ID, User ID, and Role are required" }, 
                { status: 400 }
            );
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
                inventory: true,
                user: {
                    include: {
                        company: true
                    }
                }
            }
        });
        
        return NextResponse.json(sales);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching sales" }, 
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const companyId = request.headers.get("x-company-id");
        const userId = request.headers.get("x-user-id");
        const role = request.headers.get("x-user-role");
        
        if (!companyId || !userId || !role) {
            return NextResponse.json(
                { error: "Company ID, User ID, and Role are required" }, 
                { status: 400 }
            );
        }

        const data = await request.json();
        const { customerName, customerPhone, items } = data;

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Items array is required and cannot be empty" }, 
                { status: 400 }
            );
        }

        // Check stock levels first (before transaction)
        for (const item of items) {
            const inventory = await prisma.inventory.findUnique({
                where: { id: item.productId },
            });
            
            if (!inventory) {
                return NextResponse.json(
                    { error: `Product with ID ${item.productId} not found` }, 
                    { status: 404 }
                );
            }
            
            if (inventory.quantity < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for product: ${inventory.productName}. Available: ${inventory.quantity}, Requested: ${item.quantity}` }, 
                    { status: 400 }
                );
            }
        }

        // Execute transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create customer
            const customer = await tx.customer.create({
                data: {
                    customerName: customerName,
                    customerPhone: customerPhone,
                    companyId: parseInt(companyId),
                },
            });

            // Process each item
            const saleResults: { id: number; status: $Enums.Status; createdAt: Date; updatedAt: Date; quantity: number; price: number; totalAmount: number; customerId: number; userId: number; inventoryId: number; }[] = [];
            for (const item of items) {
                // Create sale
                const sale = await tx.sell.create({
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

                // Update inventory
                await tx.inventory.update({
                    where: { id: item.productId },
                    data: { quantity: { decrement: item.quantity } }
                });

                saleResults.push(sale);
            }

            return { customer, sales: saleResults };
        });

        return NextResponse.json(
            { 
                message: "Sale created successfully", 
                data: result 
            }, 
            { status: 201 }
        );

    } catch (err) {
        console.error("POST Error:", err);
        
        // Handle specific Prisma errors
        if (err instanceof Error) {
            if (err.message.includes("insufficient")) {
                return NextResponse.json(
                    { error: "Insufficient stock for one or more items" }, 
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: "An error occurred while creating the sale" }, 
            { status: 500 }
        );
    }
}