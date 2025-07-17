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
  MapPin,
  Clock,
  MessageCircle,
  Star,
  Zap,
  Bell,
  User,
  LogOut,
  DollarSign,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
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
  mechanicId?: string;
  createdAt: any;
  acceptedAt?: any;
}

interface ChatRoom {
  id: string;
  serviceRequestId: string;
  customerId: string;
  customerName: string;
  mechanicId: string;
  mechanicName: string;
  status: "active" | "closed";
}

export default function MechanicDashboard() {
  const { user, profile, logout, loading } = useAuth();
  const router = useRouter();
  const [availableJobs, setAvailableJobs] = useState<ServiceRequest[]>([]);
  const [myJobs, setMyJobs] = useState<ServiceRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"available" | "my-jobs">(
    "available"
  );
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [acceptingJob, setAcceptingJob] = useState<string | null>(null);
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
    console.log("Mechanic Dashboard - Auth state:", {
      user: !!user,
      userId: user?.uid,
      profile: !!profile,
      profileData: profile,
      loading,
      role: profile?.role,
    });

    if (!loading && !user) {
      console.log("No user, redirecting to login");
      router.push("/auth/login");
      return;
    }

    if (user && profile && profile.role !== "mechanic") {
      // For testing purposes, allow customers to view mechanic dashboard by adding ?test=mechanic
      const urlParams = new URLSearchParams(window.location.search);
      const testMode = urlParams.get("test");

      if (testMode !== "mechanic") {
        console.log("User is not mechanic, redirecting to customer dashboard");
        router.push("/dashboard/customer");
        return;
      } else {
        console.log("Test mode: allowing customer to view mechanic dashboard");
      }
    }

    if (user && profile) {
      console.log("User authenticated, fetching jobs");
      fetchJobs();
    }
  }, [user, profile, loading, router]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      // Import Firestore functions dynamically
      const { collection, query, where, getDocs } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      // Fetch available jobs (pending status, no mechanic assigned)
      const availableJobsQuery = query(
        collection(db, "service_requests"),
        where("status", "==", "pending")
      );

      const availableSnapshot = await getDocs(availableJobsQuery);
      const allJobs = availableSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as ServiceRequest[];

      // Filter for unassigned jobs
      const availableJobsData = allJobs.filter(
        (job) => !job.mechanicId || job.mechanicId === null
      );

      // Sort available jobs by creation date (newest first)
      availableJobsData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      // Fetch mechanic's assigned jobs
      const myJobsQuery = query(
        collection(db, "service_requests"),
        where("mechanicId", "==", user?.uid)
      );

      const myJobsSnapshot = await getDocs(myJobsQuery);
      const myJobsData = myJobsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        acceptedAt: doc.data().acceptedAt?.toDate?.() || null,
      })) as ServiceRequest[];

      // Sort mechanic's jobs by creation date (newest first)
      myJobsData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      setAvailableJobs(availableJobsData);
      setMyJobs(myJobsData);

      console.log("Jobs fetched successfully:", {
        available: availableJobsData.length,
        myJobs: myJobsData.length,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const createChatRoom = async (
    serviceRequestId: string,
    customerId: string,
    customerName: string,
    mechanicId: string,
    mechanicName: string
  ) => {
    try {
      const { collection, addDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      const chatRoomData = {
        serviceRequestId,
        customerId,
        customerName,
        mechanicId,
        mechanicName,
        status: "active",
        createdAt: serverTimestamp(),
      };

      console.log("Creating chat room with data:", chatRoomData);

      const chatRoomRef = await addDoc(
        collection(db, "chatRooms"),
        chatRoomData
      );

      console.log("Chat room created successfully:", chatRoomRef.id);

      return chatRoomRef.id;
    } catch (error) {
      console.error("Error creating chat room:", error);
      return null;
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
        "mechanic:",
        user?.uid
      );

      // Find existing chat room
      const chatRoomsQuery = query(
        collection(db, "chatRooms"),
        where("serviceRequestId", "==", serviceRequestId),
        where("mechanicId", "==", user?.uid)
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
            id: chatRoomData.customerId,
            name: chatRoomData.customerName,
            role: "customer",
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

  const acceptJob = async (jobId: string) => {
    setAcceptingJob(jobId);
    try {
      // Import Firestore functions dynamically
      const { doc, updateDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      // Find the job to get customer details
      const job = availableJobs.find((j) => j.id === jobId);
      if (!job) {
        throw new Error("Job not found");
      }

      // Update the service request to assign it to this mechanic
      const serviceRequestRef = doc(db, "service_requests", jobId);

      await updateDoc(serviceRequestRef, {
        mechanicId: user?.uid,
        mechanicName: profile?.name || user?.displayName || "Mechanic",
        status: "assigned",
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Create chat room between customer and mechanic
      await createChatRoom(
        jobId,
        job.customerId || "",
        job.customerName,
        user!.uid,
        profile?.name || user?.displayName || "Mechanic"
      );

      console.log("Job accepted successfully");

      // Refresh the jobs list
      await fetchJobs();
      // Switch to my jobs tab to show the accepted job
      setActiveTab("my-jobs");
    } catch (error) {
      console.error("Error accepting job:", error);
      alert("Failed to accept job");
    } finally {
      setAcceptingJob(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just posted";
    if (diffInHours === 1) return "1 hour ago";
    return `${diffInHours} hours ago`;
  };

  if (loading || loadingJobs) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <Zap className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show loading if user exists but profile is still being created
  if (user && !profile) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <Zap className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p>Setting up your profile...</p>
        </div>
      </div>
    );
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.name || "Mechanic"}!
          </h1>
          <p className="text-gray-600">
            Find new electrical jobs in your area and manage your current
            projects
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Available Jobs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availableJobs.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900">$0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile?.rating || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Jobs Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile?.completedJobs || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs Section */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("available")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "available"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Available Jobs ({availableJobs.length})
              </button>
              <button
                onClick={() => setActiveTab("my-jobs")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "my-jobs"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                My Jobs ({myJobs.length})
              </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              {activeTab === "available" && (
                <>
                  {availableJobs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No jobs available right now
                        </h3>
                        <p className="text-gray-600">
                          Check back later for new electrical jobs in your area.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    availableJobs.map((job) => (
                      <Card key={job.id} className="border border-gray-200">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg">
                                  {job.title}
                                </CardTitle>
                              </div>
                              <CardDescription className="flex items-center gap-4 text-sm">
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {timeAgo(job.createdAt)}
                                </span>
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {job.customerName}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getUrgencyColor(job.urgency)}>
                                {job.urgency === "emergency"
                                  ? "EMERGENCY"
                                  : job.urgency.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            {job.description}
                          </p>

                          <div className="flex justify-between items-center">
                            <Badge variant="outline">
                              Status: {job.status}
                            </Badge>
                            <div className="space-x-2">
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Contact Customer
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => acceptJob(job.id)}
                                disabled={acceptingJob === job.id}
                              >
                                {acceptingJob === job.id
                                  ? "Accepting..."
                                  : "Accept Job"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}

              {activeTab === "my-jobs" && (
                <>
                  {myJobs.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No assigned jobs
                        </h3>
                        <p className="text-gray-600">
                          Accept jobs from the available jobs tab to get
                          started.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    myJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="border border-blue-200 bg-blue-50"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg">
                                  {job.title}
                                </CardTitle>
                              </div>
                              <CardDescription className="flex items-center gap-4 text-sm">
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Accepted:{" "}
                                  {job.acceptedAt
                                    ? timeAgo(job.acceptedAt)
                                    : "N/A"}
                                </span>
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {job.customerName}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className="bg-green-100 text-green-800">
                                {job.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            {job.description}
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Customer: {job.customerEmail}
                            </span>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openChat(job.id)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat with Customer
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Mark Complete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Status */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Complete</span>
                    <Badge
                      variant={profile?.experience ? "default" : "secondary"}
                    >
                      {profile?.experience ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verified</span>
                    <Badge
                      variant={profile?.isVerified ? "default" : "secondary"}
                    >
                      {profile?.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Experience</span>
                    <span className="text-sm text-gray-600">
                      {profile?.experience || "Not set"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Update Location
                </Button>
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
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Earnings Report
                </Button>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-500">
                        No appointments scheduled
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle>This Week's Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">$0</p>
                  <p className="text-sm text-gray-500">0 jobs completed</p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Start accepting jobs to earn money!
                    </p>
                  </div>
                </div>
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
