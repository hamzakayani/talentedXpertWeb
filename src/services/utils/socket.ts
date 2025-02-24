import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../requests/requests";

let socket: Socket | null = null;

export const getSocket = (token: string | null, id: number) => {
    if (!socket && token && id) {
        socket = io(`${SOCKET_URL}`,{
            transports: ['websocket'],
            query: {
                profileId: id
            }
        });

        socket.on("connect", () => {
            console.log("Connected to socket server");
            // socket?.emit('notification', { message: 'hello world!' })
            // console.log("Notification send");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
    }
    return socket;
};

export const closeSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Disconnected")
        socket = null;
    }
};
