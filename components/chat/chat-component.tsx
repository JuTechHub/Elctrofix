"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Send, X, Phone, Video, MoreVertical } from "lucide-react";

interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "mechanic";
  message: string;
  timestamp: any;
  read: boolean;
}

interface ChatComponentProps {
  chatRoomId: string;
  serviceRequestId: string;
  otherParticipant: {
    id: string;
    name: string;
    role: "customer" | "mechanic";
  };
  onClose: () => void;
}

export default function ChatComponent({
  chatRoomId,
  serviceRequestId,
  otherParticipant,
  onClose,
}: ChatComponentProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Real-time message listener
  useEffect(() => {
    if (!chatRoomId) return;

    const fetchMessages = async () => {
      try {
        const { collection, query, where, orderBy, onSnapshot } = await import(
          "firebase/firestore"
        );
        const { db } = await import("@/lib/firebase");

        const messagesQuery = query(
          collection(db, "messages"),
          where("chatRoomId", "==", chatRoomId)
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          })) as ChatMessage[];

          // Sort messages by timestamp on client side
          messagesData.sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            return timeA - timeB;
          });

          console.log("Messages received:", messagesData.length, messagesData);
          setMessages(messagesData);
          setLoading(false);

          // Scroll to bottom when new message arrives
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up message listener:", error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { collection, addDoc, doc, updateDoc, serverTimestamp } =
        await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      await addDoc(collection(db, "messages"), {
        chatRoomId,
        senderId: user.uid,
        senderName: user.displayName || user.email || "Unknown User",
        senderRole:
          user.uid === otherParticipant.id
            ? otherParticipant.role
            : otherParticipant.role === "customer"
            ? "mechanic"
            : "customer",
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false,
      });

      console.log("Message sent:", {
        chatRoomId,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        message: newMessage.trim(),
      });

      // Update last message in chat room
      await updateDoc(doc(db, "chatRooms", chatRoomId), {
        lastMessage: newMessage.trim(),
        lastMessageTime: serverTimestamp(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-end p-4">
      <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              {otherParticipant.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold">{otherParticipant.name}</h3>
              <p className="text-xs text-blue-100 capitalize">
                {otherParticipant.role}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-blue-700 rounded">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-blue-700 rounded">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-blue-700 rounded">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Start your conversation</p>
              <p className="text-sm">Ask questions about the electrical work</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?.uid
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.senderId === user?.uid
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === user?.uid
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
