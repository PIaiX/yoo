import { io } from 'socket.io-client'
import { ADMIN_URL } from './api'
const socket = io.connect(ADMIN_URL)
export default socket