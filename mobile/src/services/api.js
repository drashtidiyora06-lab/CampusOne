import axios from 'axios';
import { Platform } from 'react-native';

// Standard local IP or localhost for React Native Expo
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let userToken = '';

export const setAuthToken = (token) => {
  userToken = token;
};

api.interceptors.request.use((config) => {
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
