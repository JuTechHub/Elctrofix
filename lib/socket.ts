"use client"

import { io, type Socket } from "socket.io-client"

class SocketService {
  private socket: Socket | null = null
  private static instance: SocketService

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  connect(userId: string): void {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        auth: {
          userId,
        },
      })

      this.socket.on("connect", () => {
        console.log("Connected to socket server")
      })

      this.socket.on("disconnect", () => {
        console.log("Disconnected from socket server")
      })
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinChatRoom(chatRoomId: string): void {
    if (this.socket) {
      this.socket.emit("join-chat", chatRoomId)
    }
  }

  leaveChatRoom(chatRoomId: string): void {
    if (this.socket) {
      this.socket.emit("leave-chat", chatRoomId)
    }
  }

  sendMessage(chatRoomId: string, message: any): void {
    if (this.socket) {
      this.socket.emit("send-message", { chatRoomId, message })
    }
  }

  onNewMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on("new-message", callback)
    }
  }

  onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void {
    if (this.socket) {
      this.socket.on("user-typing", callback)
    }
  }

  emitTyping(chatRoomId: string, isTyping: boolean): void {
    if (this.socket) {
      this.socket.emit("typing", { chatRoomId, isTyping })
    }
  }

  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

export default SocketService
