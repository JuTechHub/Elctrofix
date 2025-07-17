import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { createProblem, getProblemsByCustomerId, getAvailableProblems } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user || user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, urgency, location, address, budget, preferredTime, isEmergency } = body

    if (!title || !description || !category || !urgency || !location || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const problem = await createProblem({
      title,
      description,
      category,
      urgency,
      location,
      address,
      budget: budget || "",
      preferredTime: preferredTime || "",
      isEmergency: isEmergency || false,
      customerId: user.id,
    })

    return NextResponse.json({
      message: "Problem posted successfully",
      problem,
    })
  } catch (error) {
    console.error("Create problem error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let problems
    if (user.role === "customer") {
      problems = await getProblemsByCustomerId(user.id)
    } else {
      problems = await getAvailableProblems()
    }

    return NextResponse.json({ problems })
  } catch (error) {
    console.error("Get problems error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
