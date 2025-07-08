import { useState, useEffect } from 'react';
import { authAPI, personAPI, menuAPI } from '../../services/api';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [persons, setPersons] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchUserProfile();
    fetchPersons();
    fetchMenuItems();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPersons = async () => {
    try {
      const response = await personAPI.getAllPersons();
      setPersons(response.data);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await menuAPI.getAllMenuItems();
      setMenuItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  const getWorkIcon = (work) => {
    switch (work) {
      case 'chef': return '👨‍🍳';
      case 'waiter': return '🍽️';
      case 'manager': return '👔';
      default: return '👤';
    }
  };

  const getTasteIcon = (taste) => {
    switch (taste) {
      case 'sweet': return '🍯';
      case 'sour': return '🍋';
      case 'spicy': return '🌶️';
      default: return '🍽️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Hotel Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Welcome back!</div>
                <div className="text-sm text-gray-600">{user?.name}</div>
              </div>
              <div className="h-10 w-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 mb-6">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', name: 'Profile', icon: '👤' },
                { id: 'staff', name: 'Staff', icon: '👥' },
                { id: 'menu', name: 'Menu', icon: '🍽️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && user && (
              <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                      <p className="text-indigo-100 flex items-center space-x-2">
                        <span>{getWorkIcon(user.work)}</span>
                        <span className="capitalize">{user.work}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Email', value: user.email, icon: '📧' },
                      { label: 'Mobile', value: user.mobile, icon: '📱' },
                      { label: 'Age', value: user.age, icon: '🎂' },
                      { label: 'Salary', value: user.salary ? `$${user.salary}` : 'Not specified', icon: '💰' }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                            <dd className="text-lg font-semibold text-gray-900">{item.value}</dd>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {persons.map((person) => (
                  <div key={person._id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {person.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                        <p className="text-gray-600 flex items-center space-x-1">
                          <span>{getWorkIcon(person.work)}</span>
                          <span className="capitalize">{person.work}</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>📧</span>
                        <span>{person.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>📱</span>
                        <span>{person.mobile}</span>
                      </div>
                      {person.salary && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>💰</span>
                          <span>${person.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div key={item._id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <span className="text-2xl">{getTasteIcon(item.taste)}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                        {item.is_drink && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            🥤 Drink
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">Taste:</span>
                          <span className="text-sm text-gray-900 capitalize flex items-center space-x-1">
                            <span>{getTasteIcon(item.taste)}</span>
                            <span>{item.taste}</span>
                          </span>
                        </div>
                        {item.num_sales > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">Sales:</span>
                            <span className="text-sm text-gray-900">{item.num_sales}</span>
                          </div>
                        )}
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium text-gray-500">Ingredients:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.ingredients.map((ingredient, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;