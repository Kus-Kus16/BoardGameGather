import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Register from '../pages/Login/Register'
import BoardGames from '../pages/BoardGames/BoardGameList'
import GameSesions from '../pages/GameSessions/GameSessions'
import BoardGameInsight from '../pages/BoardGames/BoardGameInsight'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/boardgames" element={<BoardGames />} />
        <Route path="/game-sessions" element={<GameSesions />} />
        <Route path="/boardgames/:id" element={<BoardGameInsight />} />
      </Routes>
    </BrowserRouter>
  )
}