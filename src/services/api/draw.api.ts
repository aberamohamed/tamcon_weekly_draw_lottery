import api from '@/lib/axios';

export interface Draw {
  id: string;
  drawDate: string;
  winningNumber: string;
  totalPool: number;
  winnersCount: number;
  status: 'upcoming' | 'completed';
}

export const drawApi = {
  getLatestDraw: async () => {
    const { data } = await api.get<Draw>('/draws/latest');
    return data;
  },
  getDrawHistory: async () => {
    const { data } = await api.get<Draw[]>('/draws/history');
    return data;
  },
  triggerDraw: async () => {
    const { data } = await api.post('/draws/trigger');
    return data;
  },
};
