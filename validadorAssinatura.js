const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.ASAAS_BASE_URL,
  headers: {
    access_token: process.env.ASAAS_API_KEY
  }
});

module.exports = {
  verificarAssinatura: async (clienteId) => {
    const res = await api.get(`/subscriptions?customer=${clienteId}`);
    const assinatura = res.data?.data?.[0];

    if (!assinatura || assinatura.status !== 'ACTIVE') {
      console.log(`⚠️ Assinatura inativa para cliente ${clienteId}`);
      return false;
    }

    return true;
  }
};
