import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.accessToken || response.data.token) {
    const token = response.data.accessToken || response.data.token;
    localStorage.setItem('token', token);
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.accessToken || response.data.token) {
    const token = response.data.accessToken || response.data.token;
    localStorage.setItem('token', token);
  }
  return response.data;
};

const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
};

export default authService;
