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

enum Range {
    "today" , "yesterday" ,"last_week" , "last_month", "all"
} 

export async function GET(request: NextRequest, params: { params: { range: Range } }) {
    let startDate: Date | undefined;
    const { range } = params.params;
    
    switch (range) {
        case Range.today:
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0); // Start of today
            break;
        case Range.yesterday:
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 1);
            startDate.setHours(0, 0, 0, 0); // Start of yesterday
            break;
        case Range.last_week:
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0); // Start of 7 days ago
            break;
        case Range.last_month:
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            startDate.setHours(0, 0, 0, 0); 
            break;
        case Range.all:
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