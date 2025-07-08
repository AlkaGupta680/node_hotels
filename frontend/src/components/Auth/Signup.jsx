import { useState } from 'react';
import { authAPI } from '../../services/api';

const Signup = ({ onSignup, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    work: 'chef',
    mobile: '',
    email: '',
    address: '',
    salary: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signup(formData);
      localStorage.setItem('token', response.data.token);
      onSignup(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative max-w-md w-full mx-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Our Team</h2>
            <p className="text-gray-600">Create your hotel management account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  name="age"
                  type="number"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                name="work"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                value={formData.work}
                onChange={handleChange}
              >
                <option value="chef">👨‍🍳 Chef</option>
                <option value="waiter">🍽️ Waiter</option>
                <option value="manager">👔 Manager</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  name="mobile"
                  type="tel"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="+1234567890"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  name="salary"
                  type="number"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="50000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                name="address"
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 animate-shake">
                <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={switchToLogin}
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200 hover:underline text-sm"
              >
                Already have an account? <span className="font-semibold">Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;