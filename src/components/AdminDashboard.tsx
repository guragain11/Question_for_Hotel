import { useState, useEffect } from 'react';
import { LogOut, Download, Trash2, RefreshCw } from 'lucide-react';

interface Survey {
  id: number;
  hotel_name: string;
  email: string;
  contact_number: string;
  location: string;
  created_at: string;
  biggest_problem: string;
  budget: string;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [stats, setStats] = useState({ total_responses: 0, unique_hotels: 0, unique_emails: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchSurveys();
    fetchStats();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/surveys`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch surveys');
      const data = await response.json();
      setSurveys(data);
      setError('');
    } catch (err) {
      setError('Failed to load surveys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/surveys/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`${API_URL}/api/surveys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete survey');
      setSurveys(surveys.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete survey');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_URL}/api/surveys/export/csv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surveys-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export surveys');
      console.error(err);
    }
  };

  const filteredSurveys = surveys.filter(survey =>
    survey.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Survey Admin Panel</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Total Responses</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.total_responses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Unique Hotels</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.unique_hotels}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Unique Emails</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.unique_emails}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by hotel name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchSurveys}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Surveys Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading surveys...</p>
            </div>
          ) : filteredSurveys.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No surveys found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Hotel Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Budget</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Submitted</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurveys.map((survey) => (
                    <tr key={survey.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-medium">#{survey.id}</td>
                      <td className="px-6 py-4 text-gray-900">{survey.hotel_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{survey.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{survey.contact_number || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{survey.location || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{survey.budget || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(survey.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(survey.id)}
                          disabled={deletingId === survey.id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
