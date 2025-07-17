import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { mechanicId, mechanicName } = await request.json();

    if (!mechanicId || !mechanicName) {
      return NextResponse.json(
        { error: "Mechanic information required" },
        { status: 400 }
      );
    }

    const requestId = params.id;

    // Check if the service request exists and is available
    const serviceRequestRef = doc(db, "service_requests", requestId);
    const serviceRequestSnap = await getDoc(serviceRequestRef);

    if (!serviceRequestSnap.exists()) {
      return NextResponse.json(
        { error: "Service request not found" },
        { status: 404 }
      );
    }

    const serviceRequestData = serviceRequestSnap.data();

    if (
      serviceRequestData.status !== "pending" ||
      serviceRequestData.mechanicId !== null
    ) {
      return NextResponse.json(
        { error: "Service request already assigned" },
        { status: 400 }
      );
    }

    // Assign the job to the mechanic
    await updateDoc(serviceRequestRef, {
      mechanicId,
      mechanicName,
      status: "assigned",
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      message: "Job accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting job:", error);
    return NextResponse.json(
      { error: "Failed to accept job" },
      { status: 500 }
    );
  }
}
