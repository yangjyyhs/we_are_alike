import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RoomSetup from './pages/RoomSetup'
import RoomCreated from './pages/RoomCreated'
import Rating from './pages/Rating'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-blue-50 text-gray-800 font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<RoomSetup />} />
          <Route path="/room/:roomId/created" element={<RoomCreated />} />
          <Route path="/room/:roomId" element={<Rating />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/:roomId" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
