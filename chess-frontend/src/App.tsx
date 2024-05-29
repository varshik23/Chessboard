import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './screens/Dashboard.tsx';
import Board from './screens/Board.tsx';


function App() {

  return (
    <BrowserRouter basename='/app'>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/board' element={<Board />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
