import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [step, setStep] = useState(1); // 1: Enter ID, 2: Enter Details
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Check if room exists
      await api.get(`/rooms/${roomId}`);
      setStep(2);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Room not found. Please check ID.');
      } else {
        setError('Error checking room.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/rooms/${roomId}/join`, {
        nickname,
        email
      });
      // Store participant_id in session for this room
      sessionStorage.setItem(`p_${roomId}`, res.data.participant_id);
      navigate(`/room/${roomId}`);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Nickname already taken in this room.');
      } else {
        setError('Failed to join room. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">We Are Alike</h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        {step === 1 ? (
          <form onSubmit={handleCheckRoom} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Join a Room</h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              required
              className="w-full border rounded p-3 text-lg text-center tracking-widest"
              placeholder="Enter 10-digit Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.replace(/\D/g, ''))}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Checking...' : 'Next'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Join Room {roomId}</h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <input
              type="text"
              required
              className="w-full border rounded p-2"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input
              type="email"
              required
              className="w-full border rounded p-2"
              placeholder="Email (for results)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-md font-bold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Joining...' : 'Start Rating!'}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-gray-500 text-sm underline"
            >
              Back
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <Link to="/create" className="block text-blue-600 underline">Create New Room</Link>
        <Link to="/admin" className="block text-gray-500 text-sm">Creator Login</Link>
      </div>
    </div>
  );
}
