import api from '@/lib/axios';

export interface CheckoutResponse {
  checkoutUrl: string;
  txRef: string;
}

export interface ChapaConfig {
  publicKey: string;
  mode: 'test' | 'live';
}

export const paymentApi = {
  getChapaConfig: async () => {
    const { data } = await api.get('/payments/chapa/config');
    return data.data !== undefined ? data.data : data;
  },
  createCheckout: async (quantity: number): Promise<CheckoutResponse> => {
    const { data } = await api.post('/payments/checkout', { quantity });
    return data.data !== undefined ? data.data : data;
  },
  createDeposit: async (amount: number): Promise<CheckoutResponse> => {
    const { data } = await api.post('/payments/deposit', { amount });
    return data.data !== undefined ? data.data : data;
  },
  verifyPayment: async (txRef: string) => {
    const { data } = await api.get(`/payments/verify/${txRef}`);
    return data.data !== undefined ? data.data : data;
  }
};
