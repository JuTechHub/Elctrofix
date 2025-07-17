"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard redirect check:", {
      user: !!user,
      profile,
      loading,
    });

    if (!loading) {
      if (!user) {
        console.log("No user, redirecting to login");
        router.push("/auth/login");
      } else if (profile) {
        console.log("User profile found:", profile.role);
        // User authenticated, redirect based on role
        if (profile.role === "customer") {
          console.log("Redirecting to customer dashboard");
          router.push("/dashboard/customer");
        } else if (profile.role === "mechanic") {
          console.log("Redirecting to mechanic dashboard");
          router.push("/dashboard/mechanic");
        } else {
          console.log("No valid role, defaulting to customer dashboard");
          router.push("/dashboard/customer");
        }
      } else if (user && !profile) {
        console.log(
          "User exists but no profile, defaulting to customer dashboard"
        );
        // If user exists but no profile is loaded, default to customer
        router.push("/dashboard/customer");
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Redirecting to your dashboard...</p>
        <div className="mt-4 text-sm text-gray-600">
          <p>User: {user ? "✓" : "✗"}</p>
          <p>Profile: {profile ? `✓ (${profile.role})` : "✗"}</p>
          <p>Loading: {loading ? "Yes" : "No"}</p>
        </div>
        {/* Fallback redirect button */}
        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/customer")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Customer Dashboard
          </button>
          <button
            onClick={() => router.push("/dashboard/mechanic")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2"
          >
            Go to Mechanic Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
