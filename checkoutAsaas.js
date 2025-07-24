const axios = require('axios');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

async function criarAssinaturaMensal(v) {
  try {
    // 🧾 Criação do cliente no Asaas
    const cliente = await axios.post('https://sandbox.asaas.com/api/v3/customers', {
      name: v.nome,
      email: v.email,
      phone: v.telefone
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });

    console.log(`[checkout] 🧾 Cliente criado: ${cliente.data.id}`);

    // 🔁 Criação da assinatura mensal
    const assinatura = await axios.post('https://sandbox.asaas.com/api/v3/subscriptions', {
      customer: cliente.data.id,
      billingType: 'CARTAO_DE_CREDITO',
      value: 45,
      cycle: 'MONTHLY',
      description: 'Assinatura mensal Webskull Marketplace'
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });

    console.log(`[checkout] 🔁 Assinatura criada: ${assinatura.data.id}`);
    console.log(`[checkout] 🔗 PaymentLink: ${assinatura.data.paymentLink}`);

    // 💾 Salvando vendedor temporário com assinatura e link
    salvarVendedorTemporario(cliente.data.id, {
      nome: v.nome,
      email: v.email,
      telefone: v.telefone,
      assinatura: assinatura.data.id,
      paymentLink: assinatura.data.paymentLink
    });

    return assinatura.data;
  } catch (err) {
    const erroDetalhado = err?.response?.data || err.message || err;
    console.error('[checkout] ❌ Erro ao criar cliente ou assinatura:', erroDetalhado);
    throw err;
  }
}

module.exports = { criarAssinaturaMensal };
