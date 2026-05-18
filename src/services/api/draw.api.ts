import api from '@/lib/axios';

export interface Draw {
  _id: string;
  id?: string;
  drawDate?: string;
  winningNumber?: string;
  totalPool?: number;
  prizePool?: number;
  winnersCount?: number;
  winnerCount?: number;
  status: 'upcoming' | 'completed' | string;
}

export const drawApi = {
  getLatestDraw: async () => {
    const { data } = await api.get('/lottery/current');
    return data.data !== undefined ? data.data : data;
  },
  getDrawHistory: async (page = 1, limit = 20) => {
    const { data } = await api.get(`/admin/draws/history?page=${page}&limit=${limit}`);
    return data.data !== undefined ? data.data : data;
  },
  getDraws: async (page = 1, limit = 50) => {
    const { data } = await api.get(`/admin/draws?page=${page}&limit=${limit}`);
    return data.data !== undefined ? data.data : data;
  },
  triggerDraw: async (drawId: string) => {
    const { data } = await api.post('/admin/draws/trigger', { drawId });
    return data.data !== undefined ? data.data : data;
  },
};
