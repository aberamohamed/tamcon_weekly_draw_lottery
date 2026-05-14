import api from '@/lib/axios';

export interface Ticket {
  id: string;
  number: string;
  drawId: string;
  status: 'pending' | 'won' | 'lost';
  purchaseDate: string;
  price: number;
}

export const ticketApi = {
  buyTicket: async (count: number = 1) => {
    const { data } = await api.post('/tickets/buy', { count });
    return data;
  },
  getTicketHistory: async () => {
    const { data } = await api.get<Ticket[]>('/tickets/history');
    return data;
  },
  getActiveTickets: async () => {
    const { data } = await api.get<Ticket[]>('/tickets/active');
    return data;
  },
};
