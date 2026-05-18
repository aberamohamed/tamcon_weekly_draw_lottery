import api from '@/lib/axios';

export interface Ticket {
  _id: string;
  id?: string;
  number?: string;
  drawId?: string;
  status?: 'pending' | 'won' | 'lost' | string;
  purchaseDate?: string;
  createdAt?: string;
  price?: number;
}

export const ticketApi = {
  buyTicket: async (quantity: number = 1) => {
    const { data } = await api.post('/payments/checkout', { quantity });
    return data.data !== undefined ? data.data : data;
  },
  getTicketHistory: async (page = 1, limit = 20) => {
    const { data } = await api.get(`/lottery/tickets/mine?page=${page}&limit=${limit}`);
    const result = data.data !== undefined ? data.data : data;
    return Array.isArray(result) ? result : (result.items || result.tickets || []);
  },
  getActiveTickets: async (page = 1, limit = 20) => {
    const { data } = await api.get(`/lottery/tickets/mine?page=${page}&limit=${limit}`);
    const result = data.data !== undefined ? data.data : data;
    return Array.isArray(result) ? result : (result.items || result.tickets || []);
  },
};
