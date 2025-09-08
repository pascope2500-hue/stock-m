import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function DELETE(request: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get("x-user-id");
        const role = request.headers.get("x-user-role");
        if (!userId) {
            return new Response("Unauthorized", {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
         const { id } = await params;
        const sale = await prisma.sell.deleteMany({
            where: {
                id: parseInt(id),
                userId: role ==="Admin" ? undefined : parseInt(userId)
            }
        })
        return new Response(JSON.stringify(sale), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        })

    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    let startDate: Date | undefined;
    const { id } = await params;
    switch (id) {
        case 'today':
            startDate = new Date();
            startDate.setUTCHours(0, 0, 0, 0); // Start of today
            break;
        case 'yesterday':
            startDate = new Date();
            startDate.setUTCDate(startDate.getUTCDate() - 1);
            startDate.setUTCHours(0, 0, 0, 0); // Start of yesterday
            break;
        case 'last_week':
            startDate = new Date();
            startDate.setUTCDate(startDate.getUTCDate() - 7);
            startDate.setUTCHours(0, 0, 0, 0); // Start of 7 days ago
            break;
        case 'last_month':
            startDate = new Date();
            startDate.setUTCDate(startDate.getUTCDate() - 30);
            startDate.setUTCHours(0, 0, 0, 0); 
            break;
        case 'all':
            startDate = undefined; // No date filter for "all"
            break;
        default:
            startDate = undefined;
            break;
    }

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
                },
                ...(startDate && {
                    createdAt: {
                        gte: startDate
                    }
                })
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