import { useState, useEffect } from 'react';
import { LogOut, Download, Trash2, RefreshCw, Eye } from 'lucide-react';

interface Survey {
  id: number;
  hotel_name: string;
  email: string;
  contact_number: string;
  location: string;
  biggest_problem: string;
  advanced_features: string;
  payment_structure: string;
  current_payment: string;
  payment_model: string;
  ota_percentage: string;
  has_hotel_management_system: string;
  hotel_management_system_name: string;
  hms_max_budget: string;
  form_data: any;
  custom_questions: any;
  created_at: string;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

const labelMap: Record<string, string> = {
  hotel_name: 'Hotel Name',
  email: 'Email',
  contact_number: 'Contact Number',
  location: 'Location',
  location_other: 'Location (Other)',
  current_software: 'Current Software',
  current_software_other: 'Current Software (Other)',
  biggest_problem: 'Biggest Problem',
  advanced_features: 'Advanced Features Needed',
  payment_structure: 'Payment Structure',
  payment_structure_other: 'Payment Structure (Other)',
  current_payment: 'Current Payment',
  payment_model: 'Payment Model',
  payment_model_other: 'Payment Model (Other)',
  migration_willingness: 'Migration Willingness',
  migration_willingness_other: 'Migration Willingness (Other)',
  ota_percentage: 'OTA Percentage',
  has_website: 'Has Website',
  has_website_other: 'Has Website (Other)',
  mobile_app_importance: 'Mobile App Importance',
  mobile_app_importance_other: 'Mobile App Importance (Other)',
  seasonal_pricing_difficulty: 'Seasonal Pricing Difficulty',
  seasonal_pricing_difficulty_other: 'Seasonal Pricing Difficulty (Other)',
  multiple_properties: 'Multiple Properties',
  multiple_properties_other: 'Multiple Properties (Other)',
  overbooking_frequency: 'Overbooking Frequency',
  overbooking_frequency_other: 'Overbooking Frequency (Other)',
  automated_messages: 'Automated Messages',
  automated_messages_other: 'Automated Messages (Other)',
  extra_services_upsell: 'Extra Services Upsell',
  extra_services_upsell_other: 'Extra Services Upsell (Other)',
  has_hotel_management_system: 'Has HMS',
  hotel_management_system_name: 'HMS Name',
  why_not_using_hms: 'Why Not Using HMS',
  would_use_custom_hms: 'Would Use Custom HMS',
  would_use_custom_hms_other: 'Would Use Custom HMS (Other)',
  hms_requirements: 'HMS Requirements',
  hms_max_budget: 'HMS Max Budget',
};

export function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [stats, setStats] = useState({ total_responses: 0, unique_hotels: 0, unique_emails: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

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

  const renderSurveyDetail = (survey: Survey) => {
    const fields: { key: string; value: any }[] = [];
    const fd = typeof survey.form_data === 'string' ? JSON.parse(survey.form_data) : survey.form_data || {};

    const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

    for (const [col, label] of Object.entries(labelMap)) {
      let val = (survey as any)[col];
      if (val === null || val === undefined) {
        const camelKey = snakeToCamel(col);
        val = fd[camelKey];
      }
      if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) continue;
      fields.push({ key: label, value: val });
    }

    // Add custom questions
    const customQuestions = survey.custom_questions
      ? (typeof survey.custom_questions === 'string' ? JSON.parse(survey.custom_questions) : survey.custom_questions)
      : fd.customQuestions || [];
    if (Array.isArray(customQuestions)) {
      customQuestions.forEach((q: any) => {
        const answer = fd.customAnswers?.[q.id] || '';
        fields.push({ key: `[Custom] ${q.title}`, value: answer || '(no answer)' });
      });
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-lg font-bold text-gray-900">
              Survey #{survey.id} — {survey.hotel_name || 'N/A'}
            </h2>
            <button
              onClick={() => setSelectedSurvey(null)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            >
              ✕
            </button>
          </div>
          <div className="p-6 space-y-3">
            {fields.map((f) => (
              <div key={f.key} className="border-b border-gray-100 pb-3 last:border-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{f.key}</p>
                <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">
                  {typeof f.value === 'object' ? JSON.stringify(f.value, null, 2) : String(f.value)}
                </p>
              </div>
            ))}
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted</p>
              <p className="text-sm text-gray-900 mt-0.5">
                {new Date(survey.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedSurvey && renderSurveyDetail(selectedSurvey)}

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

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
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">HMS</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Submitted</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurveys.map((survey) => {
                    const fd = typeof survey.form_data === 'string' ? JSON.parse(survey.form_data) : survey.form_data || {};
                    return (
                    <tr key={survey.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-medium">#{survey.id}</td>
                      <td className="px-6 py-4 text-gray-900">{survey.hotel_name || fd.hotelName || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{survey.email || fd.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{survey.contact_number || fd.contactNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">{survey.location || fd.location || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {survey.hotel_management_system_name || fd.hotelManagementSystemName || survey.has_hotel_management_system || fd.hasHotelManagementSystem || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(survey.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSurvey(survey)}
                            className="text-blue-600 hover:text-blue-800 transition p-1"
                            title="View details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(survey.id)}
                            disabled={deletingId === survey.id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 transition p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
