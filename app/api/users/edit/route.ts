import { hashPassword, verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
        const { currentPassword, newPassword, confirmNewPassword } = await request.json();

        if (newPassword !== confirmNewPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 })
        }
        // check if the current password is correct
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        if (!await verifyPassword(currentPassword, user.password)) {
            return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
        }

        // if new password is same as current password
        if (await verifyPassword(newPassword, user.password)) {
            return NextResponse.json({ message: "New password cannot be same as current password" }, { status: 400 })
        }

        const password = await hashPassword(newPassword);

        await prisma.user.update({
            where: {
                id: parseInt(userId)
            },
            data: {
                password
            }
        });
        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}