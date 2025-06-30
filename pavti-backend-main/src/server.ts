// import App from "./app";

// import { connectDb } from "./dbConnection";

// import dotenv from "dotenv";
// dotenv.config();

// process.env.TZ = "UTC";
// // const serverPort = parseInt(process.env.PORT) || 3010;
// const serverPort = parseInt(process.env.PORT ?? "3010");


// connectDb()
//   .then(async () => {
//     App.start(serverPort);
//     App.instance.listen(serverPort, function () {
//       console.info(
//         `App listening on environment "${process.env.NODE_ENV}" ${serverPort}`
//       );
//     });
//   })
//   .catch((error) => {
//     console.error("error while connect to database", error);
//   });


// new code

import App from "./app";
import { connectDb } from "./dbConnection";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http"; // Add this line
import { initSocket } from "./socketHandler"; // ✅ You will create this file

dotenv.config();
process.env.TZ = "UTC";
const serverPort = parseInt(process.env.PORT ?? "3010");

connectDb()
  .then(async () => {
    App.start(serverPort);

    const server = http.createServer(App.instance); // 👈 wrap your Express app in HTTP server
    const io = new Server(server, {
      cors: {
        origin: "*", // 👈 adjust as needed
        methods: ["GET", "POST"],
      },
    });

    initSocket(io); // 👈 Call your socket setup function

    server.listen(serverPort, function () {
      console.info(`App listening on environment "${process.env.NODE_ENV}" ${serverPort}`);
    });
  })
  .catch((error) => {
    console.error("Error while connecting to database:", error);
  });

