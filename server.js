const { createServer } = require("http")
const { Server } = require("socket.io")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3001

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  })

  // Store active users and their rooms
  const activeUsers = new Map()
  const userRooms = new Map()

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    // Handle user authentication
    socket.on("authenticate", (userId) => {
      activeUsers.set(socket.id, userId)
      socket.userId = userId
      console.log(`User ${userId} authenticated`)
    })

    // Join chat room
    socket.on("join-chat", (chatRoomId) => {
      socket.join(chatRoomId)
      userRooms.set(socket.id, chatRoomId)
      console.log(`User ${socket.userId} joined chat room: ${chatRoomId}`)
    })

    // Leave chat room
    socket.on("leave-chat", (chatRoomId) => {
      socket.leave(chatRoomId)
      userRooms.delete(socket.id)
      console.log(`User ${socket.userId} left chat room: ${chatRoomId}`)
    })

    // Handle new messages
    socket.on("send-message", (data) => {
      const { chatRoomId, message } = data

      // Broadcast message to all users in the chat room except sender
      socket.to(chatRoomId).emit("new-message", {
        ...message,
        timestamp: new Date(),
      })

      console.log(`Message sent in room ${chatRoomId}:`, message.message)
    })

    // Handle typing indicators
    socket.on("typing", (data) => {
      const { chatRoomId, isTyping } = data

      socket.to(chatRoomId).emit("user-typing", {
        userId: socket.userId,
        isTyping,
      })
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      const userId = activeUsers.get(socket.id)
      const chatRoomId = userRooms.get(socket.id)

      if (chatRoomId) {
        socket.to(chatRoomId).emit("user-typing", {
          userId: socket.userId,
          isTyping: false,
        })
      }

      activeUsers.delete(socket.id)
      userRooms.delete(socket.id)

      console.log(`User ${userId} disconnected`)
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Socket.io server ready on http://${hostname}:${port}`)
    })
})
