import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, address, city, role, experience, specializations, certifications } = body

    // Validation
    if (!name || !email || !password || !phone || !address || !city || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["customer", "mechanic"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      role,
      ...(role === "mechanic" && {
        experience,
        specializations,
        certifications,
      }),
    }

    const user = await createUser(userData)

    // Generate token
    const token = await generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    // Create response with cookie
    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
