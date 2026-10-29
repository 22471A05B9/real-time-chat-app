// Real-Time Chat Application: server
// Express serves the React client, Socket.io carries messages in real time,
// and MongoDB (via Mongoose) stores the chat history.

require("dotenv").config();
const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { cleanName, cleanMessage } = require("./validate");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "client")));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ----- Database -----
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

let dbReady = false;
const memoryMessages = []; // used when MongoDB is not configured

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI is not set, so messages are kept in memory only.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    dbReady = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed, using memory instead:", error.message);
  }
}

async function loadHistory() {
  if (dbReady) {
    const docs = await Message.find().sort({ createdAt: -1 }).limit(50).lean();
    return docs.reverse().map((d) => ({ user: d.user, text: d.text, time: d.createdAt }));
  }
  return memoryMessages.slice(-50);
}

async function saveMessage(message) {
  if (dbReady) {
    await Message.create({ user: message.user, text: message.text, createdAt: message.time });
  } else {
    memoryMessages.push(message);
  }
}

// ----- Real-time events -----
io.on("connection", (socket) => {
  let username = null;

  socket.on("join", async (name) => {
    username = cleanName(name);
    if (!username) {
      socket.emit("error-message", "Please enter a name.");
      return;
    }
    socket.emit("history", await loadHistory());
    socket.broadcast.emit("system", username + " joined the chat");
  });

  socket.on("chat-message", async (text) => {
    if (!username) return;
    const clean = cleanMessage(text);
    if (!clean) return;
    const message = { user: username, text: clean, time: new Date().toISOString() };
    await saveMessage(message);
    io.emit("chat-message", message); // send to everyone, including the sender
  });

  socket.on("disconnect", () => {
    if (username) socket.broadcast.emit("system", username + " left the chat");
  });
});

const PORT = process.env.PORT || 3000;
connectDatabase().then(() => {
  server.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
});
