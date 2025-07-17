import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    console.log("Service request API called");

    // Get user info from request body
    const body = await request.json();
    console.log("Request body:", body);

    const {
      title,
      description,
      urgency,
      location,
      customerId,
      customerName,
      customerEmail,
    } = body;

    // Validate required fields
    if (!title || !description || !urgency || !location || !customerId) {
      console.log("Missing required fields:", {
        title: !!title,
        description: !!description,
        urgency: !!urgency,
        location: !!location,
        customerId: !!customerId,
      });
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("Creating service request in Firestore...");

    // Create service request with a simple timestamp instead of serverTimestamp
    const now = new Date();
    const serviceRequestData = {
      customerId,
      customerName: customerName || "Unknown Customer",
      customerEmail: customerEmail || "",
      title,
      description,
      urgency,
      location,
      status: "pending", // pending, assigned, in_progress, completed, cancelled
      mechanicId: null,
      mechanicName: null,
      createdAt: now,
      updatedAt: now,
    };

    const serviceRequest = await addDoc(
      collection(db, "service_requests"),
      serviceRequestData
    );

    console.log("Service request created successfully:", serviceRequest.id);

    return NextResponse.json({
      message: "Service request created successfully",
      requestId: serviceRequest.id,
    });
  } catch (error) {
    console.error("Error creating service request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create service request: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const userRole = url.searchParams.get("userRole");
    const userId = url.searchParams.get("userId");

    let serviceRequests;
    const serviceRequestsCollection = collection(db, "service_requests");

    if (userRole === "customer") {
      // Get customer's own service requests
      const q = query(
        serviceRequestsCollection,
        where("customerId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      serviceRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else if (userRole === "mechanic") {
      if (status === "available") {
        // Available jobs (not assigned to any mechanic)
        const q = query(
          serviceRequestsCollection,
          where("status", "==", "pending"),
          where("mechanicId", "==", null),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        serviceRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else if (status === "my-jobs") {
        // Mechanic's assigned jobs
        const q = query(
          serviceRequestsCollection,
          where("mechanicId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        serviceRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        // For now, just get available jobs - you might need to adjust this for complex queries
        const q = query(
          serviceRequestsCollection,
          where("status", "==", "pending"),
          where("mechanicId", "==", null),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        serviceRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 403 });
    }

    return NextResponse.json({ serviceRequests });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch service requests" },
      { status: 500 }
    );
  }
}
