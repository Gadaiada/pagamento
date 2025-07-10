const axios = require('axios');
require('dotenv').config();

// 🔗 Conexão com API do Asaas
const api = axios.create({
  baseURL: process.env.ASAAS_BASE_URL,
  headers: {
    access_token: process.env.ASAAS_API_KEY
  }
});

// 🔹 Criação de cliente com CPF ou CNPJ
async function criarCliente({ nome, email, telefone, documento }) {
  const payload = {
    name: nome,
    email: email,
    phone: telefone,
    cpfCnpj: documento
  };

  const res = await api.post('/customers', payload);
  return res.data;
}

// 🔁 Criação de assinatura recorrente
async function criarAssinatura(clienteId, plano) {
  const valor = plano === 'anual' ? 199.90 : 29.90;
  const ciclo = plano === 'anual' ? 'YEARLY' : 'MONTHLY';

  const assinatura = {
    customer: clienteId,
    billingType: 'BOLETO', // pode mudar para 'PIX' ou 'CREDIT_CARD'
    value: valor,
    cycle: ciclo,
    description: `Assinatura ${plano} Webskull Marketplace`
  };

  const res = await api.post('/subscriptions', assinatura);
  return res.data;
}

// 🧩 Exportação correta
module.exports = {
  criarCliente,
  criarAssinatura
};
