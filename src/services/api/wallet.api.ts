import api from '@/lib/axios';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export const walletApi = {
  getBalance: async () => {
    const { data } = await api.get<{ balance: number }>('/wallet/balance');
    return data;
  },
  getTransactions: async () => {
    const { data } = await api.get<Transaction[]>('/wallet/transactions');
    return data;
  },
  deposit: async (amount: number) => {
    const { data } = await api.post('/wallet/deposit', { amount });
    return data;
  },
};
