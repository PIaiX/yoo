import { io } from "socket.io-client";
import { IO_URL } from "./api";
const socket = io(IO_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
export default socket;
