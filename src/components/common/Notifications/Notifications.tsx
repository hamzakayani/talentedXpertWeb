import useSocket from '@/hooks/useSocket'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

const Notifications = () => {
    const { socket } = useSocket()

    useEffect(() => {
        if (socket) {
            const notificationHandler = (notification: any) => {
                console.log(">>>>", notification);

                toast(notification.message, {
                    type: notification.type || 'info',
                    // position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000, // Auto close after 5 seconds
                });
            };

            console.log(socket)

            socket.on("notification", notificationHandler);

            return () => {
                socket.off("notification", notificationHandler);
            };
        }
    }, [socket])
    
    return (
        <div>Notifications</div>
    )
}

export default Notifications