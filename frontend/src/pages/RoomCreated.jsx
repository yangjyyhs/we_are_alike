import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RoomCreated() {
  const { roomId } = useParams();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
      <p className="text-gray-600 mb-4">Your friends can join using this Room ID:</p>

      <div className="bg-gray-100 p-4 rounded-lg mb-3 flex items-center justify-center gap-3">
        <span className="text-4xl font-mono font-bold tracking-wider text-blue-600 select-all">
          {roomId}
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

      {copied && (
        <p className="text-sm text-green-600 font-medium mb-3">✓ Copied to clipboard!</p>
      )}

      <p className="text-sm text-gray-500 mb-6">
        Share this ID with everyone you want to invite!
      </p>

      <div className="space-y-3">
        <Link
          to="/"
          className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Home
        </Link>
        <Link
          to="/admin"
          className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Go to Admin Login
        </Link>
      </div>
    </div>
  );
}
