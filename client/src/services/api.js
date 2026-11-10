import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
};

// Profile
export const profileAPI = {
  get:    ()     => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

// Recommendations
export const recommendAPI = {
  generate:      ()        => api.post('/recommendations'),
  history:       (p, l)   => api.get(`/recommendations?page=${p}&limit=${l}`),
  getOne:        (id)      => api.get(`/recommendations/${id}`),
  delete:        (id)      => api.delete(`/recommendations/${id}`),
  updateRoadmap: (id, body) => api.patch(`/recommendations/${id}/roadmap`, body),
  simulate:      (body)    => api.post('/recommendations/simulate', body),
};

export default api;
