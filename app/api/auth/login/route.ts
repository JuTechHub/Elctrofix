import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Use Firebase Auth for login
    const user = await loginUser(email, password)

    return NextResponse.json({
      message: "Login successful",
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified
      }
    })

  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 })
  }
}
