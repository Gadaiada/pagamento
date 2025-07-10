const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.ASAAS_BASE_URL,
  headers: {
    access_token: process.env.ASAAS_API_KEY
  }
});

module.exports = {
  criarCliente: async ({ nome, email, telefone }) => {
    const res = await api.post('/customers', { name: nome, email, phone: telefone });
    return res.data;
  },

  criarAssinatura: async (clienteId, plano) => {
    const planoId = plano === 'anual' ? 'XXXX' : '5734'; // Substitua XXXX pelo ID do plano anual
    const res = await api.post('/subscriptions', { customer: clienteId, plan: planoId });
    return res.data;
  }
};
