import { io } from "socket.io-client";
const socket = io("https://api.yooapp.ru:4000", { autoConnect: false });
export default socket;
