const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.ASAAS_BASE_URL,
  headers: {
    access_token: process.env.ASAAS_API_KEY
  }
});

module.exports = {
  criarCliente: async (vendedor) => {
    const response = await api.post('/customers', {
      name: vendedor.nome,
      email: vendedor.email,
      cpfCnpj: vendedor.documento,
      phone: vendedor.telefone
    });
    return response.data;
  },

  criarAssinatura: async (clienteId) => {
    const response = await api.post('/subscriptions', {
      customer: clienteId,
      billingType: 'BOLETO',
      value: 29.90,
      cycle: 'MONTHLY',
      description: 'Plano do Marketplace'
    });
    return response.data;
  }
};
