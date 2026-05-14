import api from '@/lib/axios';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'customer' | 'admin';
    fullName: string;
  };
}

export const authApi = {
  requestOtp: async (email: string) => {
    const { data } = await api.post('/auth/request-otp', { email });
    return data;
  },
  verifyOtp: async (email: string, otp: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    return data;
  },
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
