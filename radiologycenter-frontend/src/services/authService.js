import axios from 'axios';
import { config, getApiUrl, log } from '../utils/config';

const API_URL = getApiUrl('/auth/login');

const login = async ({ username, password, keepLogin }) => {
  try {
    log('Attempting login for user:', username);
    const response = await axios.post(API_URL, { username, password });
    const data = response.data;
    
    // Store token
    if (keepLogin) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } else {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    log('Login successful for user:', username);
    return data;
  } catch (error) {
    log('Login failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Invalid credentials');
  }
};

const logout = () => {
  log('User logging out');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const getUser = () => {
  try {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    log('Error parsing user data:', error);
    // Clear invalid user data
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    return null;
  }
};

const register = async (userData) => {
  try {
    log('Attempting user registration');
    const response = await axios.post(getApiUrl('/auth/register'), userData);
    log('Registration successful');
    return response.data;
  } catch (error) {
    log('Registration failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

const forgotPassword = async (email) => {
  try {
    log('Attempting password reset for email:', email);
    const response = await axios.post(getApiUrl('/auth/forgot-password'), { email });
    log('Password reset email sent');
    return response.data;
  } catch (error) {
    log('Password reset failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to send reset email');
  }
};

const resetPassword = async (token, password) => {
  try {
    log('Attempting password reset with token');
    const response = await axios.post(getApiUrl('/auth/reset-password'), { token, password });
    log('Password reset successful');
    return response.data;
  } catch (error) {
    log('Password reset failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

const updateProfile = async (profileData) => {
  try {
    const token = getToken();
    log('Attempting profile update');
    const response = await axios.put(getApiUrl('/auth/profile'), profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    log('Profile update successful');
    return response.data;
  } catch (error) {
    log('Profile update failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};

const changePassword = async (passwordData) => {
  try {
    const token = getToken();
    log('Attempting password change');
    const response = await axios.put(getApiUrl('/auth/change-password'), passwordData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    log('Password change successful');
    return response.data;
  } catch (error) {
    log('Password change failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
};

export default { 
  login, 
  logout, 
  getToken, 
  getUser, 
  register, 
  forgotPassword, 
  resetPassword, 
  updateProfile, 
  changePassword 
}; 