import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Rating() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [room, setRoom] = useState(null);
  const [ratings, setRatings] = useState({}); // { item_id: score }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const pid = sessionStorage.getItem(`p_${roomId}`);
    if (!pid) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [roomRes, itemsRes] = await Promise.all([
          api.get(`/rooms/${roomId}`),
          api.get(`/rooms/${roomId}/items`)
        ]);
        setRoom(roomRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        setError('Failed to load room data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [roomId, navigate]);

  const handleRate = (itemId, score) => {
    setRatings(prev => ({ ...prev, [itemId]: score }));
  };

  const handleSubmit = async () => {
    if (items.length === 0) return;
    
    // Check completion
    // Every item must have a rating (number) OR be explicitly null (if allowed)
    // If not in ratings object, it's missing.
    const missing = items.some(item => ratings[item.item_id] === undefined);

    if (missing) {
      alert('Please rate all items!');
      return;
    }

    setSubmitting(true);
    const pid = sessionStorage.getItem(`p_${roomId}`);
    
    try {
      const answersPayload = items.map(item => ({
        item_id: item.item_id,
        score: ratings[item.item_id]
      }));
      
      await api.post(`/participants/${pid}/answers`, {
        answers: answersPayload
      });
      setSubmitted(true);
      sessionStorage.removeItem(`p_${roomId}`);
    } catch (err) {
      alert('Failed to submit. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  if (submitted) {
    return (
      <div className="text-center mt-20 p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">Your answers have been submitted.</p>
        <p className="text-gray-500 text-sm">Please wait for the creator to close the room and send results.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4 pb-20">
      <div className="bg-blue-100 p-4 rounded-lg mb-6 text-center">
        <h2 className="text-lg font-bold text-blue-800">{room?.topic}</h2>
        <p className="text-sm text-blue-600">Rest assured, the creator cannot see your individual answers.</p>
      </div>

      <div className="space-y-6">
        {items.map(item => (
          <div key={item.item_id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2 text-center">{item.item_name}</h3>
            
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => handleRate(item.item_id, star)}
                  className={`text-4xl focus:outline-none transition-transform active:scale-95 ${
                    ratings[item.item_id] >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  type="button"
                >
                  ★
                </button>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 px-4">
                <span>Dislike</span>
                <span>Like a lot</span>
            </div>

            {room?.include_non_see && (
              <div className="mt-4 text-center border-t pt-2">
                <label className="inline-flex items-center space-x-2 text-sm text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ratings[item.item_id] === null}
                    onChange={(e) => {
                        if (e.target.checked) handleRate(item.item_id, null);
                        else {
                            const newR = {...ratings};
                            delete newR[item.item_id];
                            setRatings(newR);
                        }
                    }}
                    className="rounded text-gray-500 focus:ring-gray-400 w-5 h-5"
                  />
                  <span>I haven't seen/tried this</span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-10">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full max-w-md mx-auto block bg-green-600 text-white py-3 rounded-md font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 shadow-md"
        >
          {submitting ? 'Sending...' : 'Confirm Submit'}
        </button>
      </div>
    </div>
  );
}
