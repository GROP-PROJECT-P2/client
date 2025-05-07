import { io } from "socket.io-client";

// Use the same ngrok URL as in your https.js file
const socket = io("https://ad91-120-188-81-240.ngrok-free.app/", {
  auth: {
    token: localStorage.getItem("access_token"),
  },
  transports: ["polling", "websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  // Add this to prevent CORS issues with ngrok
  extraHeaders: {
    "ngrok-skip-browser-warning": "skip-browser-warning",
  },
});

// Add socket debugging
socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
  // Automatically join previous group if exists
  const currentGroupId = localStorage.getItem("currentGroupId");
  if (currentGroupId) {
    socket.emit("join_group", currentGroupId);
    console.log(`Automatically joined group ${currentGroupId}`);
  }
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

// Listen for all events (debug)
socket.onAny((event, ...args) => {
  console.log(`[Socket Debug] Event: ${event}`, args);
});

export default socket;
