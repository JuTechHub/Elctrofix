"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MapPin,
  Clock,
  MessageCircle,
  Star,
  Zap,
  Bell,
  User,
  LogOut,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { EmailVerificationBanner } from "@/components/email-verification-banner";
import { ChatWindow } from "@/components/chat/chat-window";
import ChatComponent from "@/components/chat/chat-component";

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  urgency: string;
  location: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerId?: string;
  mechanicId: string | null;
  mechanicName: string | null;
  createdAt: any;
  updatedAt: any;
}

export default function CustomerDashboard() {
  const { user, profile, logout, loading } = useAuth();
  const router = useRouter();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loadingServiceRequests, setLoadingServiceRequests] = useState(true);
  const [chatMessages, setChatMessages] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    chatRoomId: string;
    serviceRequestId: string;
    otherParticipant: {
      id: string;
      name: string;
      role: "customer" | "mechanic";
    };
  } | null>(null);

  useEffect(() => {
    console.log("Customer Dashboard state:", {
      loading,
      user: !!user,
      profile: !!profile,
      profileRole: profile?.role,
    });

    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      router.push("/auth/login");
      return;
    }

    if (user && !loading) {
      console.log("User found, fetching service requests");
      // Skip profile check for now due to Firestore permissions
      fetchServiceRequests();
    }

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loadingServiceRequests) {
        console.log("Timeout reached, stopping loading");
        setLoadingServiceRequests(false);
      }
    }, 3000); // Reduced timeout

    return () => clearTimeout(timeout);
  }, [user, loading, router]); // Removed profile dependency

  // Fetch chat messages count
  useEffect(() => {
    if (!user) return;

    const fetchChatMessageCount = async () => {
      try {
        console.log("🔄 Fetching chat message count for customer:", user.uid);

        const { collection, query, where, getDocs } = await import(
          "firebase/firestore"
        );
        const { db } = await import("@/lib/firebase");

        // Get all chat rooms where the customer is a participant
        const chatRoomsQuery = query(
          collection(db, "chatRooms"),
          where("customerId", "==", user.uid)
        );

        const chatRoomsSnapshot = await getDocs(chatRoomsQuery);
        let totalMessages = 0;

        console.log(
          `📊 Found ${chatRoomsSnapshot.size} chat rooms for customer`
        );

        // For each chat room, count the messages
        for (const chatRoomDoc of chatRoomsSnapshot.docs) {
          const messagesQuery = query(
            collection(db, "messages"),
            where("chatRoomId", "==", chatRoomDoc.id)
          );

          const messagesSnapshot = await getDocs(messagesQuery);
          const messageCount = messagesSnapshot.size;
          totalMessages += messageCount;

          console.log(
            `💬 Chat room ${chatRoomDoc.id} has ${messageCount} messages`
          );
        }

        console.log(`📈 Total messages for customer: ${totalMessages}`);
        setChatMessages(totalMessages);
      } catch (error) {
        console.error("❌ Error fetching chat message count:", error);
      }
    };

    fetchChatMessageCount();
  }, [user, serviceRequests]); // Re-fetch when service requests change

  const fetchServiceRequests = async () => {
    if (!user) {
      setLoadingServiceRequests(false);
      return;
    }

    try {
      console.log("Fetching service requests for user:", user.uid);

      // Import Firestore functions dynamically
      const { collection, query, where, getDocs } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      // Fetch customer's service requests (removed orderBy to avoid index requirement)
      const serviceRequestsQuery = query(
        collection(db, "service_requests"),
        where("customerId", "==", user.uid)
      );

      const querySnapshot = await getDocs(serviceRequestsQuery);
      const userServiceRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      })) as ServiceRequest[];

      // Sort by createdAt in descending order (newest first)
      userServiceRequests.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      console.log(
        "Service requests fetched successfully:",
        userServiceRequests.length
      );
      setServiceRequests(userServiceRequests);

      // If we successfully fetched (even if 0), Firestore is working
      console.log("✅ Firestore connection is working!");
    } catch (error: any) {
      console.error("❌ Error fetching service requests:", error);
      // If it's a permission error, set empty array and continue
      if (error.message?.includes("permissions")) {
        console.log(
          "❌ Permission error - Firestore rules may not be applied yet"
        );
        setServiceRequests([]);
      }
    } finally {
      setLoadingServiceRequests(false);
    }
  };

  const openChat = async (serviceRequestId: string) => {
    try {
      const { collection, query, where, getDocs } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      console.log(
        "Opening chat for service request:",
        serviceRequestId,
        "customer:",
        user?.uid
      );

      // Find existing chat room
      const chatRoomsQuery = query(
        collection(db, "chatRooms"),
        where("serviceRequestId", "==", serviceRequestId),
        where("customerId", "==", user?.uid)
      );

      const chatRoomsSnapshot = await getDocs(chatRoomsQuery);

      if (!chatRoomsSnapshot.empty) {
        const chatRoom = chatRoomsSnapshot.docs[0];
        const chatRoomData = chatRoom.data();

        console.log("Found chat room:", chatRoom.id, chatRoomData);

        setSelectedChat({
          chatRoomId: chatRoom.id,
          serviceRequestId,
          otherParticipant: {
            id: chatRoomData.mechanicId,
            name: chatRoomData.mechanicName,
            role: "mechanic",
          },
        });
        setChatOpen(true);
      } else {
        console.log("No chat room found for this service request");
      }
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Waiting for responses";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <Zap className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (loadingServiceRequests) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <Zap className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p>Loading your service requests...</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>User: {user ? "✓" : "✗"}</p>
            <p>Profile: {profile ? "✓" : "✗"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                ElectroFix
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Firestore Setup Notice */}
        {serviceRequests.length === 0 && !loadingServiceRequests && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Firestore Configuration
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    If you've already added the Firestore rules and this message
                    persists:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Wait 2-3 minutes for Firebase rules to propagate</li>
                    <li>Refresh this page (Ctrl+Shift+R)</li>
                    <li>
                      Make sure the rules were published in Firebase Console
                    </li>
                    <li>Try creating a test problem to verify connectivity</li>
                  </ul>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log("🔄 Testing Firestore connection...");
                        fetchServiceRequests();
                      }}
                    >
                      Test Firestore Connection
                    </Button>
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer font-medium">
                      Show Firestore Rules (click to expand)
                    </summary>
                    <pre className="mt-2 bg-yellow-100 p-2 rounded text-xs overflow-x-auto">
                      {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /problems/{document} {
      allow read, write: if request.auth != null;
    }
    match /messages/{document} {
      allow read, write: if request.auth != null;
    }
    match /chatRooms/{document} {
      allow read, write: if request.auth != null;
    }
  }
}`}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Verification Banner */}
        <div className="mb-6">
          <EmailVerificationBanner />
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.name || user.email}!
          </h1>
          <p className="text-gray-600">
            Manage your electrical service requests and track progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      serviceRequests.filter(
                        (sr) =>
                          sr.status === "pending" ||
                          sr.status === "assigned" ||
                          sr.status === "in_progress"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      serviceRequests.filter((sr) => sr.status === "completed")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {chatMessages}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {serviceRequests.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Requests List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Your Service Requests
              </h2>
              <Link href="/dashboard/customer/post-problem">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Problem
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {serviceRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No service requests yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Get started by posting your first electrical problem and
                      connect with local electricians.
                    </p>
                    <Link href="/dashboard/customer/post-problem">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Post Your First Problem
                      </Button>
                    </Link>
                    {!profile?.emailVerified && (
                      <p className="text-sm text-orange-600 mt-2">
                        Please verify your email to post problems
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                serviceRequests.map((serviceRequest) => (
                  <Card key={serviceRequest.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {serviceRequest.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            {serviceRequest.location} • Posted on{" "}
                            {new Date(
                              serviceRequest.createdAt
                            ).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          className={getStatusColor(serviceRequest.status)}
                        >
                          {getStatusText(serviceRequest.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        {serviceRequest.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Urgency: {serviceRequest.urgency}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {serviceRequest.mechanicId && (
                            <Button
                              size="sm"
                              onClick={() => openChat(serviceRequest.id)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Chat with Mechanic
                            </Button>
                          )}
                          {serviceRequest.status === "completed" && (
                            <Button size="sm">Leave Review</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/customer/post-problem">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Post New Problem
                  </Button>
                </Link>
                <Link href="/ai-electrician">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
                  >
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    AI Electrician Chat
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View Messages
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Star className="h-4 w-4 mr-2" />
                  My Reviews
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {serviceRequests.slice(0, 3).map((serviceRequest, index) => (
                    <div
                      key={serviceRequest.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">
                          Service request posted
                        </p>
                        <p className="text-xs text-gray-500">
                          {serviceRequest.title} •{" "}
                          {new Date(
                            serviceRequest.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {serviceRequests.length === 0 && (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Safety Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Never attempt to fix electrical issues yourself. Always turn
                  off the main breaker before any electrical work and wait for a
                  professional.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Component */}
      {chatOpen && selectedChat && (
        <ChatComponent
          chatRoomId={selectedChat.chatRoomId}
          serviceRequestId={selectedChat.serviceRequestId}
          otherParticipant={selectedChat.otherParticipant}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
