const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.ASAAS_BASE_URL,
  headers: {
    access_token: process.env.ASAAS_API_KEY
  }
});

module.exports = {
  criarCliente: async ({ nome, email, telefone, documento }) => {
    const res = await api.post('/customers', {
      name: nome,
      email,
      phone: telefone,
      cpfCnpj: documento
    });
    return res.data;
  },

  criarAssinatura: async (clienteId, plano) => {
    const valor = plano === 'anual' ? 199.90 : 29.90;
    const ciclo = plano === 'anual' ? 'YEARLY' : 'MONTHLY';

    const assinatura = {
      customer: clienteId,
      billingType: 'BOLETO',
      value: valor,
      cycle: ciclo,
      description: `Assinatura ${plano} Webskull`
    };

    const res = await api.post('/subscriptions', assinatura);
    return res.data;
  }
};
