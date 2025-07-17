"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Upload,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createProblem } from "@/lib/database";

export default function PostProblemPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    urgency: "",
    category: "",
    address: "",
    preferredTime: "",
    budget: "",
    isEmergency: false,
  });

  useEffect(() => {
    console.log("Post Problem page - Auth state:", {
      user: !!user,
      userId: user?.uid,
      profile: !!profile,
      profileData: profile,
      loading,
      role: profile?.role,
      emailVerified: profile?.emailVerified,
    });

    if (!loading && !user) {
      console.log("No user, redirecting to login");
      router.push("/auth/login");
      return;
    }

    if (user && profile && profile.role !== "customer") {
      console.log("User is not customer, redirecting to mechanic dashboard");
      router.push("/dashboard/mechanic");
      return;
    }

    if (user && profile) {
      console.log("User and profile loaded successfully, showing form");
    }
  }, [user, profile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!user || !profile) throw new Error("User not authenticated");

      // Import Firestore functions dynamically to avoid SSR issues
      const { collection, addDoc, serverTimestamp } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/lib/firebase");

      // Create service request directly on client side with proper authentication
      const serviceRequestData = {
        customerId: user.uid,
        customerName: profile.name || user.displayName || "Customer",
        customerEmail: user.email || "",
        title: formData.title,
        description: formData.description,
        urgency: formData.urgency,
        location: formData.location,
        status: "pending", // pending, assigned, in_progress, completed, cancelled
        mechanicId: null,
        mechanicName: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const serviceRequest = await addDoc(
        collection(db, "service_requests"),
        serviceRequestData
      );

      console.log("Service request created successfully:", serviceRequest.id);

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/customer");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating service request:", err);
      setError(err.message || "Failed to post problem");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
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

  if (success) {
    return (
      <div className="bg-gray-50 flex items-center justify-center py-20">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Problem Posted Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Your electrical problem has been posted. Nearby electricians will
              start responding soon.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
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
              <Link href="/dashboard/customer" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                ElectroFix
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Post Your Electrical Problem
          </h1>
          <p className="text-gray-600">
            Describe your issue in detail to get the best help from qualified
            electricians
          </p>
        </div>

        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Problem Details</CardTitle>
                <CardDescription>
                  Provide as much detail as possible to help electricians
                  understand your issue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Emergency Checkbox */}
                  <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <Checkbox
                      id="emergency"
                      checked={formData.isEmergency}
                      onCheckedChange={(checked) =>
                        handleInputChange("isEmergency", checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="emergency"
                      className="flex items-center text-red-700"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      This is an emergency (sparks, burning smell, no power)
                    </Label>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Problem Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Kitchen outlet not working"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Category and Urgency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Problem Category *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outlet">Outlet Issues</SelectItem>
                          <SelectItem value="lighting">
                            Lighting Problems
                          </SelectItem>
                          <SelectItem value="wiring">Wiring Issues</SelectItem>
                          <SelectItem value="panel">
                            Electrical Panel
                          </SelectItem>
                          <SelectItem value="installation">
                            New Installation
                          </SelectItem>
                          <SelectItem value="repair">General Repair</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Urgency Level *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("urgency", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            Low - Can wait a few days
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium - Within 24 hours
                          </SelectItem>
                          <SelectItem value="high">High - Same day</SelectItem>
                          <SelectItem value="emergency">
                            Emergency - Immediate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the problem in detail. Include when it started, what you were doing when it happened, any sounds or smells, etc."
                      rows={5}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Room/Area *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Kitchen, Living Room, Garage"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address *</Label>
                      <Input
                        id="address"
                        placeholder="Street address for service location"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Timing and Budget */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Time</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("preferredTime", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="When do you need this done?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">
                            As soon as possible
                          </SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="tomorrow">Tomorrow</SelectItem>
                          <SelectItem value="this-week">This week</SelectItem>
                          <SelectItem value="next-week">Next week</SelectItem>
                          <SelectItem value="flexible">I'm flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Budget Range</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("budget", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Expected budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-100">Under $100</SelectItem>
                          <SelectItem value="100-250">$100 - $250</SelectItem>
                          <SelectItem value="250-500">$250 - $500</SelectItem>
                          <SelectItem value="500-1000">$500 - $1000</SelectItem>
                          <SelectItem value="over-1000">Over $1000</SelectItem>
                          <SelectItem value="not-sure">Not sure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label>Photos (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload photos of the problem area
                      </p>
                      <Button type="button" variant="outline" size="sm">
                        Choose Files
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG up to 10MB each
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Link href="/dashboard/customer">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Posting Problem..." : "Post Problem"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Be specific about the problem and when it started
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Include photos if possible
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Mention any recent changes or work done
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Specify your availability for service
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Safety Warning */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Safety First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  If you smell burning, see sparks, or have no power, turn off
                  the main breaker and call for emergency service immediately.
                </p>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card>
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    1
                  </div>
                  <p className="text-sm text-gray-600">
                    Nearby electricians will see your post
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    2
                  </div>
                  <p className="text-sm text-gray-600">
                    You'll receive responses with quotes
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    3
                  </div>
                  <p className="text-sm text-gray-600">
                    Chat with electricians and choose one
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                    4
                  </div>
                  <p className="text-sm text-gray-600">
                    Schedule and get your problem fixed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
