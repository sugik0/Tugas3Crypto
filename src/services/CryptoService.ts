import axios from 'axios';

export const CryptoService = {
  async getCoins(limit = 100) {
    const response = await axios.get(`https://api.coinlore.net/api/tickers/`);
    return response.data.data.slice(0, limit);
  },

  async getCoinDetail(id: string | string[]) {
    const response = await axios.get(`https://api.coinlore.net/api/ticker/?id=${id}`);
    return response.data[0];
  }
};