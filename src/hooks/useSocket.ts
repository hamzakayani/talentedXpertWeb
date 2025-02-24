import { closeSocket, getSocket } from '@/services/utils/socket';
import { RootState } from '@/store/Store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'; 
import { toast } from 'react-toastify';
import { Socket } from 'socket.io-client';

const useSocket = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token); 
    const user = useSelector((state: RootState) => state.user);

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (token && user) {
            // const socket = getSocket(token, user?.profile?.length > 0 && user?.profile[0]?.id);
            const profileId = user?.profile?.length > 0 && user?.profile[0]?.id;

            if(!socket){
                const newSocket = getSocket(token, profileId);
                
                if(newSocket){
                    setSocket(newSocket)
                    const notificationHandler = (notification: any) => {
                        console.log(">>>>", notification);
        
                        // toast(notification.message, {
                        //     type: notification.type || 'info',  
                        //     position: toast.POSITION.TOP_RIGHT,
                        //     autoClose: 5000, // Auto close after 5 seconds
                        // });
                    };
                    
                    console.log(socket)
        
                    newSocket.on("notification", notificationHandler);
    
                    return () => {
                        newSocket.off("notification", notificationHandler);
                        closeSocket();
                    };
                }
            }

            return () => {
                closeSocket();
            };
        }
        return () => {
            closeSocket();
        };
    }, [token, user, dispatch]);

    return { socket };
};

export default useSocket;
