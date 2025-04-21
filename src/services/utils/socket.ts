import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../requests/requests";

let socket: Socket | null = null;

export const getSocket = (token: string | null, id: number) => {
    if (!token || !id) {
        closeSocket();
        return null;
    }

    // if (!socket && token && id) 
    if (!socket || socket.disconnected) {
        socket = io(`${SOCKET_URL}`,{
            transports: ['websocket'],
            query: {
                profileId: id
            },
            // reconnection: true,
        });

        socket.on("connect", () => {
            console.log("Connected to socket server");
            
        });
        
        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            closeSocket();
        });

        socket.on("disconnect", (reason) => {
            console.log("Disconnected from socket server", reason);
        });
        
        socket.on("reconnect", (attempt) => {
            console.log("Socket reconnected on attempt:", attempt);
        });

        socket.on("reconnect_error", (err) => {
            console.error("Socket reconnection failed:", err.message);
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
