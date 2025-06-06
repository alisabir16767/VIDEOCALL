import env from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { connectDB } from "./config/db.js";
import { initSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

env.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

connectDB();

const io = initSocket(server);
io.on("connection", (socket) => {
  console.log("SOMETHING CONNECTED");
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use("/api/v1/users", userRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
