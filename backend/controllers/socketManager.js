import { Server } from "socket.io";

let io;
let connections = {};
let messages = {};
let timeOnline = {};

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const connectToSocket = (server) => {
  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("join-call", (path) => {});
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", message);
    });
    socket.on("chat-message", (data, sender) => {});
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
