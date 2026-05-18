import api from '@/lib/axios';

export interface User {
  id: string;
  _id?: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AdminStats {
  totalUsers?: number;
  currentWeekTicketsSold?: number;
  currentWeekRevenue?: number;
  currentPrizePool?: number;
  lastDrawWinners?: number;
  lastDrawPayout?: number;
  packageDistribution?: Array<{ package: number; count: number }>;
  [key: string]: any;
}

export const adminApi = {
  getStats: async () => {
    const { data } = await api.get('/admin/kpis');
    return data.data !== undefined ? data.data : data;
  },
  getUsers: async (page = 1, limit = 50) => {
    const { data } = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return data.data !== undefined ? data.data : data;
  },
  getTransactions: async (page = 1, limit = 50) => {
    const { data } = await api.get(`/admin/transactions?page=${page}&limit=${limit}`);
    return data.data !== undefined ? data.data : data;
  },
  getRevenueWeeks: async () => {
    const { data } = await api.get('/admin/charts/revenue-weeks');
    return data.data !== undefined ? data.data : data;
  }
};
