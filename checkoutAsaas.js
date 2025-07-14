const axios = require('axios');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

async function criarAssinaturaMensal(v) {
  const cliente = await axios.post('https://sandbox.asaas.com/api/v3/customers', {
    name: v.nome,
    email: v.email,
    phone: v.telefone
  }, {
    headers: { access_token: process.env.ASAAS_TOKEN }
  });

  salvarVendedorTemporario(cliente.data.id, v);

  const assinatura = await axios.post('https://sandbox.asaas.com/api/v3/subscriptions', {
    customer: cliente.data.id,
    billingType: 'BOLETO',
    value: 29.90,
    cycle: 'MONTHLY',
    description: 'Assinatura mensal Webskull Marketplace'
  }, {
    headers: { access_token: process.env.ASAAS_TOKEN }
  });

  return assinatura.data;
}

module.exports = { criarAssinaturaMensal };
