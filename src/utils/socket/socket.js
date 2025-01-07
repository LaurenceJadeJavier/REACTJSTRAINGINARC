import { io } from "socket.io-client";
import server from "../../services/server_url";

const socket = io(server, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
});

export default socket;
