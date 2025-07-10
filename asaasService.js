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
    const res = await api.post('/customers', {
      name: nome,
      email,
      phone: telefone
    });
    return res.data;
  },

  criarAssinatura: async (clienteId, plano) => {
    // 💳 Definindo valor e ciclo com base no plano escolhido
    const valor = plano === 'anual' ? 199.90 : 29.90;
    const ciclo = plano === 'anual' ? 'YEARLY' : 'MONTHLY';

    // 🔁 Criando assinatura recorrente manualmente
    const assinatura = {
      customer: clienteId,
      billingType: 'BOLETO', // ou 'PIX', 'CREDIT_CARD'
      value: valor,
      cycle: ciclo,
      description: `Assinatura ${plano} Webskull Marketplace`
    };

    const res = await api.post('/subscriptions', assinatura);
    return res.data;
  }
};
