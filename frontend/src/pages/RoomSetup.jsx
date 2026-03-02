import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RoomSetup() {
  const [topic, setTopic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [items, setItems] = useState(['', '']);
  const [includeNonSee, setIncludeNonSee] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const validItems = items.filter(i => i.trim() !== '');
    if (validItems.length < 5) {
      setError('At least 5 items are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/rooms', {
        topic,
        password,
        include_non_see: includeNonSee,
        items: validItems
      });
      setCreatedRoomId(response.data.room_id);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Unknown error';
      setError(`Failed to create room: ${detail}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(String(createdRoomId)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (createdRoomId) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Room Created!</h1>
        <p className="text-gray-600 mb-4">Your Room ID:</p>
        <div className="bg-gray-100 p-4 rounded-lg mb-3 flex items-center justify-center gap-3">
          <span className="text-4xl font-mono font-bold tracking-wider text-blue-600 select-all">
            {createdRoomId}
          </span>
          <button
            onClick={handleCopy}
            title="Copy Room ID"
            className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
          >
            {copied ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        {copied && <p className="text-sm text-green-600 font-medium mb-3">✓ Copied!</p>}
        <p className="text-sm text-gray-500 mb-6">Share this ID with everyone you want to invite!</p>
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/room/${createdRoomId}/created`)}
            className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">Create New Room</h1>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Topic</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Food"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-red-500 mt-1 font-bold">Please remember this password! You need it to send results.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeNonSee}
              onChange={(e) => setIncludeNonSee(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-5 h-5"
            />
            <span className="text-sm text-gray-700">Allow "I haven't seen it" option</span>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Items to Rate</label>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${items.filter(i => i.trim() !== '').length >= 5
              ? 'text-green-700 bg-green-100'
              : 'text-red-600 bg-red-100'
              }`}>
              {items.filter(i => i.trim() !== '').length} / 5 minimum
            </span>
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5 mb-2">
            ⚠️ Each room must have <strong>at least 5 items</strong> for participants to rate.
          </p>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Item
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || items.filter(i => i.trim() !== '').length < 5}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
}
