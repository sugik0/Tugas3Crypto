import axios from 'axios';

const BASE_URL = 'https://api.coinlore.net/api';

export const CryptoService = {
  // Mengambil 50 data koin teratas
  async getCoins(limit = 50) {
    const response = await axios.get(`${BASE_URL}/tickers/`);
    return response.data.data.slice(0, limit);
  },

  // Mengambil detail 1 koin berdasarkan ID
  async getCoinDetail(id: string | string[]) {
    const response = await axios.get(`${BASE_URL}/ticker/?id=${id}`);
    return response.data[0];
  }
};