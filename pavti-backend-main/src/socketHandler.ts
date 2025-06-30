import { Server, Socket } from "socket.io";

let ioInstance: Server | null = null;

export const initSocket = (io: Server): void => {
  ioInstance = io;

  io.on("connection", (socket: Socket) => {
    // console.log("✅ Client connected:", socket.id);

    // Optional: Handle disconnect
    socket.on("disconnect", () => {
      // console.log("❌ Client disconnected:", socket.id);
    });
  });
};

export const getSocketIO = (): Server | null => ioInstance;
