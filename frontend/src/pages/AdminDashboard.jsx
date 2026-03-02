import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Polling for stats
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get(`/admin/stats/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
        setError('');
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/admin');
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [roomId, navigate]);

  const handleConfirmSend = async () => {
    setShowConfirm(false);
    setCalculating(true);
    const token = sessionStorage.getItem('admin_token');
    try {
      await api.post(`/admin/calculate/${roomId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSent(true);
    } catch (err) {
      if (err.response?.status === 409) {
        // Already sent, treat as success
        setSent(true);
      } else {
        console.error(err);
        const detail = err.response?.data?.detail || 'Failed to trigger calculation. Please try again.';
        setError(detail);
      }
    } finally {
      setCalculating(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Room {roomId} Admin</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Participants: {stats?.participant_count || 0}</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {stats?.participants.map((nick, i) => (
            <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              {nick}
            </span>
          ))}
        </div>
      </div>

      {sent ? (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          <h3 className="font-bold text-lg">Results Sent!</h3>
          <p>Emails are being processed in the background.</p>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={calculating || (stats?.participant_count || 0) < 5}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 flex justify-center items-center"
        >
          {calculating ? 'Sending...' : 'Send Results to All'}
        </button>
      )}

      {(stats?.participant_count || 0) < 5 && !sent && (
        <p className="text-red-400 text-sm mt-2">Need at least 5 participants to send results ({stats?.participant_count || 0}/5).</p>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-2">確認送出結果？</h3>
            <p className="text-gray-600 text-sm mb-6">
              這將會計算相似度並發送 Email 給所有 {stats?.participant_count} 位參與者，此動作無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                確定送出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
