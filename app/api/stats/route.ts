import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
    const companyId = request.headers.get("x-company-id");
    const userId = request.headers.get("x-user-id");
    const role = request.headers.get("x-user-role");

    // get total product, low stock, total expired and total revenue
    const last_month = new Date();
    last_month.setMonth(last_month.getMonth() - 1);
    try {
        if (!companyId || !userId || !role) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const totalProd = await prisma.inventory.count(
            {
                where: {
                    companyId: parseInt(companyId),
                    // createdAt: {
                    //     gte: last_month
                    // }
                }
            }
        );
        const getLowThreadStock = await prisma.company.findFirst(
            {
                where: {
                    id: parseInt(companyId)
                },
                select: {
                    lowStockLevel: true
                }
            }
        );
        const lowStock = await prisma.inventory.count({
            where: {
                quantity: {
                    lt: getLowThreadStock?.lowStockLevel ? getLowThreadStock.lowStockLevel : 0
                },
                companyId: parseInt(companyId)
            }
        });
        const totalExpired = await prisma.inventory.count({
            where: {
                expirationDate: {
                    lt: new Date()
                },
                companyId: parseInt(companyId)
            }
        });
        const totalRevenue = await prisma.sell.findMany({
            where: {
                inventory: {
                    companyId: parseInt(companyId)
                },
                createdAt: {
                    gte: last_month
                },
                userId: role === "Admin" ? undefined : parseInt(userId)
            },
            select: {
                    totalAmount: true
            }
        });
        const totalRevenueSum = totalRevenue.reduce((acc, curr) => acc + curr.totalAmount, 0);

      
        
        return NextResponse.json({ totalProd, lowStock, totalExpired, totalRevenue: totalRevenueSum, totalSales: totalRevenue.length }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}