import { useEffect, useState } from 'react';

const URL = 'ws://localhost:8080';

const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(URL);

        socket.onopen = () => {
            setSocket(socket);
            console.log('WebSocket connected');
        };

        socket.onclose = () => {
            setSocket(null);
            console.log('WebSocket disconnected');
        };

        return () => {
            if (socket.readyState === 2) { // <-- This is important
                socket.close();
            }
        };
    }, []);

    return socket;
}

export default useSocket;