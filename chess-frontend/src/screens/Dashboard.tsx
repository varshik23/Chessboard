import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {

    const navigate = useNavigate();

    return (
        <>
            <div>
                <button className='button' onClick={() => navigate("/board")}>
                    <p>Play Chess</p>
                </button>
            </div>
        </>
    )
};

export default Dashboard;