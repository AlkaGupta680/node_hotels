import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/person/signup', userData),
  login: (credentials) => api.post('/person/login', credentials),
  getProfile: () => api.get('/person/profile'),
};

// Person API calls
export const personAPI = {
  getAllPersons: () => api.get('/person'),
  getPersonsByWork: (workType) => api.get(`/person/${workType}`),
  updatePerson: (id, data) => api.put(`/person/${id}`, data),
  deletePerson: (id) => api.delete(`/person/${id}`),
};

// Menu API calls
export const menuAPI = {
  getAllMenuItems: () => api.get('/MenuItem'),
  createMenuItem: (data) => api.post('/MenuItem', data),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (data) => api.post('/booking', data),
  getAllBookings: () => api.get('/booking'),
  getMyBookings: () => api.get('/booking/my-bookings'),
  getGuestBookings: (email) => api.get(`/booking/guest/${email}`),
  updateBookingStatus: (id, status) => api.put(`/booking/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus, paymentMethod) => api.put(`/booking/${id}/payment`, { paymentStatus, paymentMethod }),
  cancelBooking: (id) => api.delete(`/booking/${id}`),
  getAvailableTables: (date, time) => api.get(`/booking/available-tables?date=${date}&time=${time}`)
};

export default api;