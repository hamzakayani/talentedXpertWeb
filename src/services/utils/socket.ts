import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../requests/requests";

let socket: Socket | null = null;

export const getSocket = (token: string | null, id: number) => {
    if (!socket && token && id) {
        socket = io(`${SOCKET_URL}`,{
            transports: ['websocket'],
            query: {
                profileId: id
            },
            // auth: { token },
        });

        socket.on("connect", () => {
            console.log("Connected to socket server");
            
        });
        
        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            closeSocket();
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
    } 
    // else if (socket && (!token || !id)) {
    //     console.log('Closing socket due to missing token or profileId');
    //     closeSocket();
    // }
    return socket;
};

export const closeSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Disconnected")
        socket = null;
    }
};
