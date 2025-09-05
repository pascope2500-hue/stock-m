import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const companyId = request.headers.get("x-company-id");
        const userId = request.headers.get("x-user-id");
        const role = request.headers.get("x-user-role");
        if (!companyId || !userId || !role) {
            return NextResponse.json({ error: "Company ID, User ID, and Role are required" }, { status: 400 })
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
        return NextResponse.json({ error: "An error occurred while fetching sales" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const companyId = request.headers.get("x-company-id");
        const userId = request.headers.get("x-user-id");
        const role = request.headers.get("x-user-id");
        if (!companyId || !userId || !role) {
            return NextResponse.json({ error: "Company ID, User ID, and Role are required" }, { status: 400 })
        }

        const data = await request.json();
        const { customerName, customerPhone, items } = data;

        async function createSale() {
            if (!companyId || !userId || !role) {
                return NextResponse.json({ error: "Company ID, User ID, and Role are required" }, { status: 400 })
            }
            await prisma.$transaction(async (tx) => {
                // check stock level
                // Create a new customer
                const customer = await tx.customer.create({
                    data: {
                        customerName: customerName,
                        customerPhone: customerPhone,
                        companyId: parseInt(companyId),
                    },
                });
                // Create a new sale
                await Promise.all(
                    items.map(async (item: any) => {
                        // check is stock level is enough
                        const inventory = await tx.inventory.findUnique({
                            where: {
                                id: item.productId,
                            },
                        });
                        if (inventory && inventory.quantity < item.quantity) {
                            return NextResponse.json({ error: "Stock level is not enough" }, { status: 400 });
                        }

                        await tx.sell.create({
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
                        await tx.inventory.update({
                            where: {
                                id: item.productId,
                            },
                            data: {
                                quantity: {
                                    decrement: item.quantity
                                }
                            }
                        })
                    })
                );
            });

        }
        createSale();
        return NextResponse.json({status: 200, message: "Sale created successfully" })
    } catch (err) {
        console.log(err);

        return NextResponse.json({ error: "An error occurred while creating the sale" }, { status: 500 })
    }
}
