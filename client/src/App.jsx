import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000, // generous enough to survive a Render free-tier cold start, but bounded
});

function getErrorMessage(err) {
  console.log('[App] axios error - full details:', {
    message: err.message,
    code: err.code,
    responseStatus: err.response?.status,
    responseData: err.response?.data,
    requestMade: !!err.request,
  });
  if (err.code === 'ECONNABORTED') {
    return 'The server took too long to respond (it may be waking up after inactivity). Please try again.';
  }
  if (err.response) {
    return err.response.data?.error || err.response.data?.message || `Server error (${err.response.status}). Please try again.`;
  }
  if (err.request) {
    return 'Could not reach the server. Check your connection and try again.';
  }
  return `Something went wrong: ${err.message}`;
}

function App() {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState('Formal');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [compareResults, setCompareResults] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);

  const tones = ['Formal', 'Friendly', 'Assertive', 'Apologetic', 'Persuasive'];

  const handleRewrite = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult('');
    setCompareResults(null);
    console.log('[App] handleRewrite - request URL:', `${api.defaults.baseURL}/api/rewrite`);
    console.log('[App] handleRewrite - request body:', { message, tone });
    try {
      const res = await api.post('/api/rewrite', { message, tone });
      console.log('[App] handleRewrite - response data:', res.data);
      setResult(res.data.rewrittenMessage);
      setSessionHistory((prev) => [
        { original: message, tone, rewritten: res.data.rewrittenMessage },
        ...prev,
      ]);
    } catch (err) {
      setResult(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareAll = async () => {
    if (!message.trim()) return;
    setCompareLoading(true);
    setResult('');
    setCompareResults(null);
    setCompareError('');
    try {
      const requests = tones.map((t) => api.post('/api/rewrite', { message, tone: t }));
      const responses = await Promise.all(requests);
      const results = tones.map((t, i) => ({
        tone: t,
        text: responses[i].data.rewrittenMessage,
      }));
      setCompareResults(results);
      setSessionHistory((prev) => [
        { original: message, tone: 'All Tones', rewritten: `${results.length} versions generated` },
        ...prev,
      ]);
    } catch (err) {
      setCompareError(getErrorMessage(err));
      console.error(err);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row justify-center items-start p-4 gap-4 pt-10 lg:pt-20">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 lg:p-8 w-full max-w-xl h-fit mx-auto lg:mx-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">ToneShift</h1>
        <p className="text-slate-400 text-sm mb-6">Rewrite your message in any tone, instantly.</p>

        <textarea
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="4"
          placeholder="Paste your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {tones.map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                tone === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRewrite}
            disabled={loading || compareLoading}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Rewriting...' : 'Rewrite'}
          </button>
          <button
            onClick={handleCompareAll}
            disabled={loading || compareLoading}
            className="flex-1 bg-slate-700 text-white py-2.5 rounded-lg font-medium hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {compareLoading ? 'Comparing...' : 'Compare All Tones'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">Result</p>
            <p className="text-slate-100 leading-relaxed break-words">{result}</p>
          </div>
        )}

        {compareError && (
          <div className="mt-6 p-4 bg-red-950 border border-red-800 rounded-lg">
            <p className="text-red-200 text-sm">{compareError}</p>
          </div>
        )}

        {compareResults && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {compareResults.map((r) => (
              <div key={r.tone} className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                <p className="text-xs text-blue-400 mb-2 uppercase tracking-wide font-semibold">{r.tone}</p>
                <p className="text-slate-100 leading-relaxed text-sm break-words">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-xl lg:max-w-xs h-fit mx-auto lg:mx-0">
        <p className="text-xs text-slate-400 mb-4 uppercase tracking-wide font-semibold">Session History</p>
        {sessionHistory.length === 0 ? (
          <p className="text-slate-500 text-sm">No rewrites yet this session.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
            {sessionHistory.map((h, i) => (
              <div key={i} className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                <p className="text-xs text-blue-400 mb-1">{h.tone}</p>
                <p className="text-slate-400 text-xs truncate">{h.original}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;