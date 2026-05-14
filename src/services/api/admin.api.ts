import api from '@/lib/axios';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AdminStats {
  revenue: { date: string; amount: number }[];
  ticketDistribution: { name: string; value: number }[];
  winnerStats: { month: string; winners: number }[];
  kpis: {
    totalRevenue: number;
    totalTicketsSold: number;
    activeUsers: number;
    conversionRate: number;
  };
}

export const adminApi = {
  getStats: async () => {
    const { data } = await api.get<AdminStats>('/admin/stats');
    return data;
  },
  getUsers: async () => {
    const { data } = await api.get<User[]>('/admin/users');
    return data;
  },
  getTransactions: async () => {
    const { data } = await api.get('/admin/transactions');
    return data;
  },
};
