import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { useEffect } from 'react';


const Dashboard = ({ socket }: { socket: WebSocket }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        socket?.send(JSON.stringify({ type: 'start' }));
        navigate('/board');
    };

    useEffect(() => {
        if (socket) {
            socket.onmessage = (message) => {
                const data = JSON.parse(message.data.toString()); // Convert Buffer to string
                if (data.type === 'move') {
                    console.log('Received move:', data.move);
                }
            };
        }

    }, [socket]);

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
