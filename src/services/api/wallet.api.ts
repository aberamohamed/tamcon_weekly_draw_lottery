import api from '@/lib/axios';

export const walletApi = {
  getBalance: async () => {
    const { data } = await api.get('/auth/me');
    const user = data.data !== undefined ? data.data : data;
    // /auth/me may return { user: {...} } or the user directly
    const userData = user?.user || user;
    return { balance: userData?.walletBalance ?? userData?.balance ?? 0 };
  },
};
