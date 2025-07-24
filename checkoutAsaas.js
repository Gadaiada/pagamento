import axios from 'axios';
import { salvarVendedorTemporario } from './armazenamentoVendedor.js';
import dotenv from 'dotenv';
dotenv.config();

async function criarAssinaturaMensal(v) {
  try {
    console.log('[checkout] 🔄 Criando cliente Asaas...');
    const cliente = await axios.post('https://sandbox.asaas.com/api/v3/customers', {
      name: v.nome,
      email: v.email,
      phone: v.telefone
    }, {
      headers: { access_token: process.env.ASAS_TOKEN }
    });

    console.log('[checkout] ✅ Cliente criado:', cliente.data.id);

    console.log('[checkout] 🔄 Criando assinatura...');
    const assinatura = await axios.post('https://sandbox.asaas.com/api/v3/subscriptions', {
      customer: cliente.data.id,
      billingType: 'CREDIT_CARD',
      value: 45,
      cycle: 'MONTHLY',
      description: 'Assinatura Webskull Marketplace'
    }, {
      headers: { access_token: process.env.ASAS_TOKEN }
    });

    console.log('[checkout] ✅ Assinatura criada:', assinatura.data.id);

    salvarVendedorTemporario(cliente.data.id, {
      nome: v.nome,
      email: v.email,
      telefone: v.telefone,
      assinatura: assinatura.data.id,
      paymentLink: assinatura.data.paymentLink
    });

    console.log('[checkout] 🎉 Vendedor salvo com sucesso!');
    return assinatura.data;
  } catch (err) {
    console.error('[checkout] ❌ Erro no processo:', err?.response?.data || err.message);
    throw err;
  }
}

export { criarAssinaturaMensal };
