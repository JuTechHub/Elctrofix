import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  type User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { NextRequest } from "next/server";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "customer" | "mechanic";
  phone: string;
  address: string;
  city: string;
  emailVerified: boolean;
  createdAt: string;
  // Mechanic specific fields
  experience?: string;
  specializations?: string;
  certifications?: string;
  rating?: number;
  completedJobs?: number;
  isVerified?: boolean;
  profileComplete?: boolean;
}

export interface AuthUser extends UserProfile {}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: "customer" | "mechanic";
  phone: string;
  address: string;
  city: string;
  experience?: string;
  specializations?: string;
  certifications?: string;
}): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: userData.name,
    });

    // Send email verification
    await sendEmailVerification(user);

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      ...(userData.role === "mechanic" && {
        experience: userData.experience,
        specializations: userData.specializations,
        certifications: userData.certifications,
        rating: 0,
        completedJobs: 0,
        isVerified: false,
        profileComplete: !!(userData.experience && userData.specializations),
      }),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);

    return { user, profile: userProfile };
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<FirebaseUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Logout failed");
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    console.log("Getting user profile for UID:", uid);
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const profile = docSnap.data() as UserProfile;
      console.log("Profile found:", profile);
      return profile;
    }
    console.log("No profile document found for UID:", uid);
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    throw new Error(error.message || "Profile update failed");
  }
}

// Server-side function to get user from request
// Note: This is a simplified implementation for development
// In production, you should implement proper JWT verification
export async function getUserFromRequest(
  request: NextRequest
): Promise<UserProfile | null> {
  try {
    // For now, we'll implement a basic version that returns null
    // This allows the middleware to work without authentication
    // You can implement proper JWT token verification here later

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return null;
    }

    // In a real implementation, you would:
    // 1. Extract the JWT token from the Authorization header
    // 2. Verify the token using Firebase Admin SDK
    // 3. Get the user profile from Firestore
    // 4. Return the user profile

    // For now, returning null to prevent middleware errors
    return null;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

export async function createMissingProfile(
  user: FirebaseUser,
  role: "customer" | "mechanic" = "customer"
): Promise<UserProfile> {
  try {
    console.log(
      "Creating missing profile for user:",
      user.uid,
      "with role:",
      role
    );

    // Create a basic profile for existing users
    const userProfile: UserProfile = {
      uid: user.uid,
      name: user.displayName || user.email?.split("@")[0] || "User",
      email: user.email || "",
      role: role,
      phone: "",
      address: "",
      city: "",
      emailVerified: user.emailVerified || false,
      createdAt: new Date().toISOString(),
      ...(role === "mechanic" && {
        experience: "",
        specializations: "",
        certifications: "",
        rating: 0,
        completedJobs: 0,
        isVerified: false,
        profileComplete: false,
      }),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
    console.log("Missing profile created successfully:", userProfile);

    return userProfile;
  } catch (error: any) {
    console.error("Error creating missing profile:", error);
    throw new Error(error.message || "Failed to create missing profile");
  }
}
