import type { UserProfile } from "./auth";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export async function createUser(
  userData: Partial<UserProfile>
): Promise<UserProfile> {
  try {
    const userId = userData.uid!;
    const userProfile: UserProfile = {
      uid: userId,
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "customer",
      phone: userData.phone || "",
      address: userData.address || "",
      city: userData.city || "",
      emailVerified: userData.emailVerified || false,
      createdAt: new Date().toISOString(),
      ...(userData.role === "mechanic" && {
        experience: userData.experience || "",
        specializations: userData.specializations || "",
        certifications: userData.certifications || "",
        rating: userData.rating || 0,
        completedJobs: userData.completedJobs || 0,
        isVerified: userData.isVerified || false,
        profileComplete: userData.profileComplete || false,
      }),
    };

    await setDoc(doc(db, "users", userId), userProfile);
    return userProfile;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

// Users database functions (using Firebase Firestore)
export async function findUserByEmail(
  email: string
): Promise<UserProfile | null> {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { uid: doc.id, ...doc.data() } as UserProfile;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}

export async function findUserById(id: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
}

// Problems database
export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  location: string;
  address: string;
  budget: string;
  preferredTime: string;
  isEmergency: boolean;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  customerId: string;
  mechanicId?: string;
  createdAt: string;
  updatedAt: string;
  responses: ProblemResponse[];
}

export interface ProblemResponse {
  id: string;
  mechanicId: string;
  message: string;
  quote: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  problemId: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "mechanic";
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  problemId: string;
  customerId: string;
  mechanicId: string;
  lastMessage?: string;
  lastMessageTime?: Timestamp;
  customerUnread: number;
  mechanicUnread: number;
  createdAt: Timestamp;
}

// Problems
export async function createProblem(
  problemData: Omit<
    Problem,
    "id" | "createdAt" | "updatedAt" | "responses" | "status"
  >
): Promise<Problem> {
  try {
    const docRef = await addDoc(collection(db, "problems"), {
      ...problemData,
      status: "pending",
      responses: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const docSnap = await getDoc(docRef);
    return { id: docRef.id, ...docSnap.data() } as Problem;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create problem");
  }
}

export async function getProblemsByCustomerId(
  customerId: string
): Promise<Problem[]> {
  try {
    const q = query(
      collection(db, "problems"),
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Problem[];
  } catch (error) {
    console.error("Error getting problems:", error);
    return [];
  }
}

export async function getAvailableProblems(): Promise<Problem[]> {
  try {
    const q = query(
      collection(db, "problems"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Problem[];
  } catch (error) {
    console.error("Error getting available problems:", error);
    return [];
  }
}

export async function updateProblem(
  id: string,
  updates: Partial<Problem>
): Promise<void> {
  try {
    const docRef = doc(db, "problems", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update problem");
  }
}

// Chat functions
export async function createChatRoom(
  problemId: string,
  customerId: string,
  mechanicId: string
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "chatRooms"), {
      problemId,
      customerId,
      mechanicId,
      customerUnread: 0,
      mechanicUnread: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create chat room");
  }
}

export async function getChatRoom(
  problemId: string,
  customerId: string,
  mechanicId: string
): Promise<string | null> {
  try {
    const q = query(
      collection(db, "chatRooms"),
      where("problemId", "==", problemId),
      where("customerId", "==", customerId),
      where("mechanicId", "==", mechanicId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error getting chat room:", error);
    return null;
  }
}

export async function sendMessage(
  chatRoomId: string,
  problemId: string,
  senderId: string,
  senderName: string,
  senderRole: "customer" | "mechanic",
  message: string
): Promise<void> {
  try {
    // Add message to messages collection
    await addDoc(collection(db, "messages"), {
      chatRoomId,
      problemId,
      senderId,
      senderName,
      senderRole,
      message,
      timestamp: serverTimestamp(),
      read: false,
    });

    // Update chat room with last message info
    const chatRoomRef = doc(db, "chatRooms", chatRoomId);
    const updateData: any = {
      lastMessage: message,
      lastMessageTime: serverTimestamp(),
    };

    // Increment unread count for the recipient
    if (senderRole === "customer") {
      updateData.mechanicUnread =
        (await getDoc(chatRoomRef)).data()?.mechanicUnread + 1 || 1;
    } else {
      updateData.customerUnread =
        (await getDoc(chatRoomRef)).data()?.customerUnread + 1 || 1;
    }

    await updateDoc(chatRoomRef, updateData);
  } catch (error: any) {
    throw new Error(error.message || "Failed to send message");
  }
}

export function subscribeToMessages(
  chatRoomId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const q = query(
    collection(db, "messages"),
    where("chatRoomId", "==", chatRoomId),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];
    callback(messages);
  });
}

export async function markMessagesAsRead(
  chatRoomId: string,
  userRole: "customer" | "mechanic"
): Promise<void> {
  try {
    const chatRoomRef = doc(db, "chatRooms", chatRoomId);
    const updateData: any = {};

    if (userRole === "customer") {
      updateData.customerUnread = 0;
    } else {
      updateData.mechanicUnread = 0;
    }

    await updateDoc(chatRoomRef, updateData);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}
