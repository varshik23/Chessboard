import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useEffect, useState } from 'react';

const Dashboard = () => {

    const navigate = useNavigate();
    const [ws, setWs] = useState<WebSocket | null>(null);

    const handleClick = () => {
        ws?.send(JSON.stringify({ type: 'start' }));
        navigate('/board');
    }

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        setWs(socket);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        return () => {
            socket.close();
            console.log('WebSocket disconnected');
        };
    }, []);

    return (
        <>
            <div>
                <button className='button' onClick={handleClick}>
                    <p>Play Chess</p>
                </button>
            </div>
        </>
    )
};

export default Dashboard;