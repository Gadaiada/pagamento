const axios = require('axios');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

async function criarAssinaturaMensal(v) {
  try {
    const cliente = await axios.post('https://sandbox.asaas.com/api/v3/customers', {
      name: v.nome,
      email: v.email,
      phone: v.telefone
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });

    console.log(`[checkout] 🧾 Cliente criado: ${cliente.data.id}`);
    salvarVendedorTemporario(cliente.data.id, v);

    const assinatura = await axios.post('https://sandbox.asaas.com/api/v3/subscriptions', {
      customer: cliente.data.id,
      billingType: 'CARTAO_DE_CREDITO', // ou 'BOLETO'
      value: 45,
      cycle: 'MONTHLY',
      description: 'Assinatura mensal Webskull Marketplace'
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });

    console.log(`[checkout] 🔁 Assinatura criada: ${assinatura.data.id}`);
    return assinatura.data;
  } catch (err) {
    console.error('[checkout] ❌ Erro na criação:', err?.response?.data || err.message);
    throw err;
  }
}

module.exports = { criarAssinaturaMensal };
