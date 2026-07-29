import axios from 'axios';
import { useAuthStore } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token dynamically to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Authentication APIs
export const loginUser = async (data: { email_or_phone: string; password: string; remember_me?: boolean }) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const registerUser = async (data: {
  full_name: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
}) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const checkUsernameAvailability = async (username: string) => {
  try {
    const res = await api.get(`/auth/check-username?username=${encodeURIComponent(username)}`);
    return res.data;
  } catch (error) {
    return { available: false, message: 'Could not verify username availability.' };
  }
};

export const checkEmailAvailability = async (email: string) => {
  try {
    const res = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
    return res.data;
  } catch (error) {
    return { available: false, message: 'Could not verify email availability.' };
  }
};

export const requestOTP = async (data: { target: string; otp_type?: string; channel?: string }) => {
  const res = await api.post('/auth/send-otp', { target: data.target, channel: data.channel || 'email' });
  return res.data;
};

export const sendOTP = async (data: { target: string; channel?: string }) => {
  const res = await api.post('/auth/send-otp', data);
  return res.data;
};

export const verifyOTP = async (data: { target: string; otp_code: string }) => {
  const res = await api.post('/auth/verify-otp', data);
  return res.data;
};

export const resendOTP = async (data: { target: string; channel?: string }) => {
  const res = await api.post('/auth/resend-otp', data);
  return res.data;
};

export const verifyEmailOTP = async (data: { email: string; code_or_token: string }) => {
  const res = await api.post('/auth/verify-email', data);
  return res.data;
};

export const verifyPhoneOTP = async (data: { phone: string; otp_code: string }) => {
  const res = await api.post('/auth/verify-phone', data);
  return res.data;
};

export const forgotPasswordRequest = async (email: string) => {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
};

export const resetPasswordConfirm = async (data: { token_or_otp: string; new_password: string }) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};

export const uploadVerificationDocument = async (data: {
  document_type: string;
  document_number?: string;
  file_url: string;
}, userId: number = 1) => {
  const res = await api.post(`/auth/verify-document?user_id=${userId}`, data);
  return res.data;
};

// Pet & Services APIs
export const getPets = async (params?: { category?: string; listing_type?: string; search?: string; location?: string }) => {
  try {
    const res = await api.get('/pets', { params });
    return res.data;
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
};

export const getPetById = async (id: string | number) => {
  try {
    const res = await api.get(`/pets/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching pet:', error);
    return null;
  }
};

export const sendAIChatPrompt = async (prompt: string, category: string = 'general') => {
  try {
    const res = await api.post('/ai/chat', { prompt, category });
    return res.data;
  } catch (error) {
    return {
      reply: "I am having trouble connecting to the AI server. Please verify backend status at http://localhost:8000/docs",
      recommendations: ["Ensure backend server is running on port 8000"],
      urgency_level: "Normal"
    };
  }
};

export const createOrder = async (orderPayload: any) => {
  const res = await api.post('/payments/create-order', orderPayload);
  return res.data;
};
