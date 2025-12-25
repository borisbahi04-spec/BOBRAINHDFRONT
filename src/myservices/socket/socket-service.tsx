import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST
const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT
const socketUrl=`${backendHost}:${backendPort}/ws`
export const initSocket = (token:string) => {
  if (!socket) {
    socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket'], // force WebSocket pur
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

  }

return socket;
};


export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
