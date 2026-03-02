import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logo from '../assets/logo.png';

export default function AdminLogin() {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/admin/login', {
        room_id: parseInt(roomId),
        password
      });
      // Store token
      sessionStorage.setItem('admin_token', res.data.token);
      navigate(`/admin/${roomId}`);
    } catch (err) {
      setError('Invalid Room ID or Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <img src={logo} alt="We Are Alike" className="w-32 mb-2" />
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Admin Login</h1>
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Room ID</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              required
              className="w-full border rounded p-2"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full border rounded p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
