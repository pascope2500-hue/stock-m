// app/api/auth/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken, setTokenCookieApp, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const { email, password } = formData;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstName: true,
        lastName: true,
        companyId: true,
        status: true,
        company: {
          select: {
            name: true,
            address: true
          },
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // if active
    if (user.status !== "Active") {
      return NextResponse.json(
        { message: "Your account is not active, please contact the administrator" },
        { status: 401 }
      );
      
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateToken({ id: user.id, role: user.role, companyId: user.companyId, names: user.firstName + " " + user.lastName, email: user.email, companyName: user.company.name, companyAddress: user.company.address ?? "" });
    // Create response with user data
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          // Don't include password in response
        }
      },
      { status: 200 }
    );

    // Set cookie in the response
    setTokenCookieApp(response, await token);
    // if(user.role ==="Admin"){
    //   return NextResponse.redirect('/dashboard/admin');
    // }else if(user.role ==="User"){
    //   return NextResponse.redirect('/dashboard/user');
    // }else if(user.role ==="Seller"){
    //   return NextResponse.redirect('/dashboard/seller');
    // }
    return response;
  } catch (err) {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}