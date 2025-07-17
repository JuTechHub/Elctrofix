import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { findUserById } from "@/lib/database";

// Mark this route as dynamic to avoid static rendering issues
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request);

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(authUser.uid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        ...(user.role === "mechanic" && {
          experience: user.experience,
          specializations: user.specializations,
          certifications: user.certifications,
          rating: user.rating,
          completedJobs: user.completedJobs,
          isVerified: user.isVerified,
        }),
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
