import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/Dashboard.tsx';
import Board from './screens/Board.tsx';
import useSocket from './hooks/useSocket.ts';

const App = () => {
  const socket = useSocket();

  if (!socket) {
    return null; // or any other fallback UI
  }

  return (
    <BrowserRouter basename='/app'>
      <Routes>
        <Route path='/' element={<Dashboard socket={socket as WebSocket} />} />
        <Route path='/board' element={<Board socket={socket as WebSocket} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App
