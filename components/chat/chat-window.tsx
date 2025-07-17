"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { subscribeToMessages, sendMessage, markMessagesAsRead, type ChatMessage } from "@/lib/database"
import SocketService from "@/lib/socket"

interface ChatWindowProps {
  chatRoomId: string
  problemId: string
  otherUser: {
    id: string
    name: string
    role: "customer" | "mechanic"
  }
  onClose: () => void
}

export function ChatWindow({ chatRoomId, problemId, otherUser, onClose }: ChatWindowProps) {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!chatRoomId) return

    // Subscribe to messages
    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages)
      scrollToBottom()
    })

    // Join chat room via socket
    SocketService.getInstance().joinChatRoom(chatRoomId)

    // Listen for real-time messages
    SocketService.getInstance().onNewMessage((message) => {
      // Messages are already handled by Firestore subscription
      // This is for additional real-time features like notifications
    })

    // Listen for typing indicators
    SocketService.getInstance().onUserTyping(({ userId, isTyping }) => {
      if (userId !== user?.uid) {
        setOtherUserTyping(isTyping)
      }
    })

    // Mark messages as read
    if (profile) {
      markMessagesAsRead(chatRoomId, profile.role)
    }

    return () => {
      unsubscribe()
      SocketService.getInstance().leaveChatRoom(chatRoomId)
    }
  }, [chatRoomId, user?.uid, profile])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !profile || sending) return

    setSending(true)
    try {
      await sendMessage(chatRoomId, problemId, user.uid, profile.name, profile.role, newMessage.trim())

      // Send via socket for real-time delivery
      SocketService.getInstance().sendMessage(chatRoomId, {
        senderId: user.uid,
        senderName: profile.name,
        senderRole: profile.role,
        message: newMessage.trim(),
        timestamp: new Date(),
      })

      setNewMessage("")

      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false)
        SocketService.getInstance().emitTyping(chatRoomId, false)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!isTyping && value.trim()) {
      setIsTyping(true)
      SocketService.getInstance().emitTyping(chatRoomId, true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      SocketService.getInstance().emitTyping(chatRoomId, false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 shadow-lg z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Chat with {otherUser.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col h-80">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.uid ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.senderId === user?.uid ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp?.toDate?.()?.toLocaleTimeString() || "Sending..."}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
