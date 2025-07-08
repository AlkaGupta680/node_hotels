import { useState, useEffect } from 'react';
import { authAPI, personAPI, menuAPI, bookingAPI } from '../../services/api';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [persons, setPersons] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchUserProfile();
    fetchMenuItems();
    fetchBookings();
  }, []);

  useEffect(() => {
    // Only fetch persons if user is staff/manager
    if (user && (user.work === 'manager' || user.work === 'chef' || user.work === 'waiter')) {
      fetchPersons();
    }
  }, [user]);

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
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      if (user && (user.work === 'manager' || user.work === 'chef' || user.work === 'waiter')) {
        // Staff can see all bookings
        const response = await bookingAPI.getAllBookings();
        setBookings(response.data);
      } else {
        // Regular users see only their bookings
        const response = await bookingAPI.getMyBookings();
        setBookings(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
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

  const isStaff = user && (user.work === 'manager' || user.work === 'chef' || user.work === 'waiter');

  const featuredDishes = [
    {
      name: "Grilled Salmon",
      image: "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: "$28",
      description: "Fresh Atlantic salmon with herbs"
    },
    {
      name: "Pasta Carbonara",
      image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: "$22",
      description: "Classic Italian pasta with cream sauce"
    },
    {
      name: "Beef Steak",
      image: "https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: "$35",
      description: "Premium cut with seasonal vegetables"
    },
    {
      name: "Caesar Salad",
      image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: "$16",
      description: "Fresh romaine with parmesan and croutons"
    }
  ];

  const stats = [
    { label: "Total Staff", value: persons.length, icon: "👥", color: "from-blue-500 to-blue-600" },
    { label: "Menu Items", value: menuItems.length, icon: "🍽️", color: "from-green-500 to-green-600" },
    { label: "Chefs", value: persons.filter(p => p.work === 'chef').length, icon: "👨‍🍳", color: "from-orange-500 to-orange-600" },
    { label: "Waiters", value: persons.filter(p => p.work === 'waiter').length, icon: "🍽️", color: "from-purple-500 to-purple-600" }
  ];

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
                { id: 'home', name: 'Home', icon: '🏠' },
                { id: 'profile', name: 'Profile', icon: '👤' },
                { id: 'bookings', name: 'My Bookings', icon: '📅' },
                { id: 'book-table', name: 'Book Table', icon: '🍽️' },
                ...(isStaff ? [
                  { id: 'staff', name: 'Staff', icon: '👥' },
                  { id: 'menu', name: 'Menu', icon: '🍽️' },
                  { id: 'all-bookings', name: 'All Bookings', icon: '📋' }
                ] : [])
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
            {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Welcome Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="relative px-8 py-12">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-center text-white">
                      <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                          <span className="text-4xl">👨‍🍳</span>
                        </div>
                      </div>
                      <h1 className="text-4xl font-bold mb-4">Welcome to Grand Hotel</h1>
                      <p className="text-xl text-indigo-100 mb-8">Experience culinary excellence and exceptional service</p>
                      <div className="flex justify-center space-x-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{persons.length}</div>
                          <div className="text-indigo-200">Staff Members</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">{menuItems.length}</div>
                          <div className="text-indigo-200">Menu Items</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">5★</div>
                          <div className="text-indigo-200">Rating</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`h-12 w-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Featured Dishes */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Featured Dishes</h2>
                      <p className="text-gray-600">Our chef's special recommendations</p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                      🍽️
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredDishes.map((dish, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={dish.image} 
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="text-sm font-bold text-gray-900">{dish.price}</span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{dish.name}</h3>
                            <p className="text-gray-600 text-sm">{dish.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chef Spotlight */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="h-16 w-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                        👨‍🍳
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Our Master Chefs</h3>
                        <p className="text-gray-600">Culinary artists creating magic</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {persons.filter(p => p.work === 'chef').slice(0, 3).map((chef, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {chef.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{chef.name}</div>
                            <div className="text-sm text-gray-600">Executive Chef</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="h-16 w-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                        📊
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Today's Highlights</h3>
                        <p className="text-gray-600">Restaurant performance</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                        <span className="text-green-800 font-medium">Orders Completed</span>
                        <span className="text-2xl font-bold text-green-600">127</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                        <span className="text-blue-800 font-medium">Customer Satisfaction</span>
                        <span className="text-2xl font-bold text-blue-600">98%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                        <span className="text-purple-800 font-medium">Revenue Today</span>
                        <span className="text-2xl font-bold text-purple-600">$3,240</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <span className="text-3xl">📅</span>
                    <span>My Bookings</span>
                  </h2>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🍽️</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                      <p className="text-gray-600 mb-6">Start by booking your first table!</p>
                      <button
                        onClick={() => setActiveTab('book-table')}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        Book a Table
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">🍽️</span>
                              <span className="font-semibold text-gray-900">Table {booking.tableNumber}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <span>📅</span>
                              <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>⏰</span>
                              <span>{booking.bookingTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>👥</span>
                              <span>{booking.numberOfGuests} guests</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>💰</span>
                              <span>${booking.totalAmount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span>💳</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'book-table' && (
              <BookTableForm onBookingSuccess={() => {
                fetchBookings();
                setActiveTab('bookings');
              }} />
            )}

            {activeTab === 'all-bookings' && isStaff && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                  <span className="text-3xl">📋</span>
                  <span>All Bookings</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                              <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Table {booking.tableNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{booking.bookingTime}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.numberOfGuests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${booking.totalAmount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

// Book Table Form Component
const BookTableForm = ({ onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    tableNumber: '',
    numberOfGuests: 2,
    bookingDate: '',
    bookingTime: '',
    specialRequests: '',
    totalAmount: 50 // Base booking fee
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate total amount based on number of guests
    if (name === 'numberOfGuests') {
      setFormData(prev => ({
        ...prev,
        totalAmount: Math.max(50, parseInt(value) * 25) // $25 per person, minimum $50
      }));
    }
  };

  const checkAvailability = async () => {
    if (formData.bookingDate && formData.bookingTime) {
      try {
        const response = await bookingAPI.getAvailableTables(formData.bookingDate, formData.bookingTime);
        setAvailableTables(response.data.availableTables);
      } catch (error) {
        console.error('Error checking availability:', error);
      }
    }
  };

  useEffect(() => {
    checkAvailability();
  }, [formData.bookingDate, formData.bookingTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await bookingAPI.createBooking(formData);
      setSuccess('Table booked successfully! You will receive a confirmation email shortly.');
      setTimeout(() => {
        onBookingSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reserve Your Table</h2>
        <p className="text-gray-600">Book a table for an unforgettable dining experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="customerName"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="John Doe"
              value={formData.customerName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="customerEmail"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="john@example.com"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="customerPhone"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
              value={formData.customerPhone}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
            <select
              name="numberOfGuests"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.numberOfGuests}
              onChange={handleChange}
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="bookingDate"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.bookingDate}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <select
              name="bookingTime"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.bookingTime}
              onChange={handleChange}
            >
              <option value="">Select time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {availableTables.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Tables</label>
            <div className="grid grid-cols-5 gap-3">
              {availableTables.map(tableNum => (
                <button
                  key={tableNum}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tableNumber: tableNum }))}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    formData.tableNumber === tableNum
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  Table {tableNum}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
          <textarea
            name="specialRequests"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Any special dietary requirements, celebration details, etc."
            value={formData.specialRequests}
            onChange={handleChange}
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-indigo-600">${formData.totalAmount}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Includes booking fee and service charge
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700">{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.tableNumber}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>🍽️</span>
              <span>Reserve Table - ${formData.totalAmount}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;