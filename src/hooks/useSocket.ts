import { closeSocket, getSocket } from '@/services/utils/socket';
import { RootState } from '@/store/Store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';

const useSocket = () => {
    const token = useSelector((state: RootState) => state.auth.token); 
    const user = useSelector((state: RootState) => state.user);

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if(!token && !user){
            closeSocket();
        }
        if (token && user && user.profile?.length > 0) {
            const profileId = user?.profile[0]?.id;

            const newSocket = getSocket(token, profileId);
                
            if(newSocket){
                setSocket(newSocket)

                // return () => {
                //     closeSocket();
                // };
            }
        }
    }, [token, user]);

    return { socket };
};

export default useSocket;
