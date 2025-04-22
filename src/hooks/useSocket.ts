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
        if (!token || !user?.profile?.length) {
            // closeSocket();
            setSocket(null);
            return;
        }

        
        const profileId = user?.profile[0]?.id;

        if (!profileId) {
            setSocket(null);
            return;
        }
        
        const newSocket = getSocket(token, profileId);
                
        if(newSocket){
            setSocket(newSocket)
        }

        return () => {
            // Socket is managed globally, so no need to close here
        };
    }, [token, user]);

    return { socket };
};

export default useSocket;
