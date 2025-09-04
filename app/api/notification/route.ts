import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
export async function GET(request: NextRequest) {
    const companyId = request.headers.get("x-company-id");
    if (!companyId) {
        return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }
    // get company low level stock
    const lowLevelComp = await prisma.company.findFirst({
        where: {
            id: parseInt(companyId),
        },
        select: {
            lowStockLevel: true,
        }
    })
    if (!lowLevelComp) {
        return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    // ckeck if there is low level stock
    const lowLevelStock = await prisma.inventory.findMany({
        where: {
            companyId: parseInt(companyId),
            quantity: {
                lte: lowLevelComp?.lowStockLevel ?? 0
            }
        }, select: {
            id: true,
            productName: true,
            quantity: true
        }
    });
    // get users
    const useremail = await prisma.user.findMany({
        where: {
            companyId: parseInt(companyId),
        },
        select: {
            email: true
        }
    })
    if (lowLevelStock.length > 0) {
        // create notification
        await prisma.$transaction(async (tx) => {


            // check if lastest notification have atleast 3 days old
            const latestNotification = await tx.notification.findFirst({
                where: {
                    companyId: parseInt(companyId),
                    entity: 'Inventory',
                    type: 'Warning',
                    entityId: lowLevelStock[0].id,
                    timestamp: {
                        lte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
                    }
                }
            });
            if (latestNotification) {
                await tx.notification.create({
                    data: {
                        companyId: parseInt(companyId),
                        message: `Low level stock for ${lowLevelStock[0].productName} ${lowLevelStock.length > 1 ? `and ${lowLevelStock.length - 1} other products` : ""}`,
                        timestamp: new Date(),
                        read: false,
                        title: "Low level stock",
                        type: "Warning",
                        entityId: lowLevelStock[0].id,
                        entity: 'Inventory',
                    }
                });
                const emailText = `Low level stock for ${lowLevelStock[0].productName} ${lowLevelStock.length > 1 ? `and ${lowLevelStock.length - 1} other products` : ""}`;
                const emailHtml = `
            <h1>Low level stock</h1>
            <p>${emailText}</p>
            <p>Low level stock for ${lowLevelStock[0].productName} ${lowLevelStock.length > 1 ? `and ${lowLevelStock.length - 1} other products` : ""}</p>
            <u>All products</u>
            <ul>
                ${lowLevelStock.map((product) => `<li>${product.productName} - ${product.quantity}</li>`).join("")}
            </ul>
            `
                useremail.forEach(async (user) => {
                    await sendEmail(user.email, "Low level stock", emailText, emailHtml);
                });

            }
        })
    }
    // check for expired products
    const expiredProducts = await prisma.inventory.findMany({
        where: {
            companyId: parseInt(companyId),
            expirationDate: {
                lte: new Date()
            }
        }, select: {
            id: true,
            productName: true,
            expirationDate: true
        }
    });

    if (expiredProducts.length > 0) {
        await prisma.$transaction(async (tx) => {

            // check if lastest notification have atleast 3 days old
            const latestNotification = await tx.notification.findFirst({
                where: {
                    companyId: parseInt(companyId),
                    entity: 'Inventory',
                    type: 'Warning',
                    entityId: expiredProducts[0].id,
                    timestamp: {
                        lte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
                    }
                }
            });

            if (latestNotification) {
                await prisma.notification.create({
                    data: {
                        companyId: parseInt(companyId),
                        message: `Expired products ${expiredProducts[0].productName} ${expiredProducts.length > 1 ? `and ${expiredProducts.length - 1} other products` : ""}`,
                        timestamp: new Date(),
                        read: false,
                        title: "Expired products",
                        type: "Warning",
                        entityId: expiredProducts[0].id,
                        entity: 'Inventory',
                    }
                });

                const emailText = `Expired products ${expiredProducts[0].productName} ${expiredProducts.length > 1 ? `and ${expiredProducts.length - 1} other products` : ""}`;
                const emailHtml = `
            <h1>Expired products</h1>
            <p>${emailText}</p>
            <u>All products</u>
            <ul>
                ${expiredProducts.map((product) => `<li>${product.productName} - ${product.expirationDate}</li>`).join("")}
            </ul>`
                useremail.forEach(async (user) => {
                    await sendEmail(user.email, "Expired products", emailText, emailHtml);
                })
            }
        })
    }

    //  get latest 6 notifications
    const notifications = await prisma.notification.findMany({
        where: {
            companyId: parseInt(companyId)
        },
        orderBy: {
            timestamp: "desc"
        },
        take: 6
    });

    return NextResponse.json(notifications);
}