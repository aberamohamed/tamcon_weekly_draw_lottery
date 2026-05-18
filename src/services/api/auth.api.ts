import api from '@/lib/axios';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: 'customer' | 'admin';
    fullName: string;
  };
}

export const authApi = {
  requestOtp: async (email: string) => {
    const { data } = await api.post('/auth/otp/request', { email });
    return data.data !== undefined ? data.data : data;
  },
  verifyOtp: async (email: string, otp: string): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/otp/verify', { 
      email, 
      otp,
      useHttpOnlyCookies: false 
    });
    return data.data !== undefined ? data.data : data;
  },
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data.data !== undefined ? data.data : data;
  },
  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data.data !== undefined ? data.data : data;
  },
  register: async (userData: { 
    fullName: string, 
    email: string
  }) => {
    const { data } = await api.post('/auth/register', userData);
    return data.data !== undefined ? data.data : data;
  },
};
