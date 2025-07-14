const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');

const api = axios.create({
  baseURL: process.env.MULTVENDOR_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.MULTVENDOR_API_TOKEN}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

module.exports = {
  registrarVendedor: async (v) => {
    const senha = crypto.randomBytes(4).toString('hex');

    const payload = {
      sp_store_name: v.nome,
      seller_name: v.nome,
      email: v.email,
      password: senha,
      state: 'RO',
      country: 'BR',
      country_code: "55",
      contact: v.telefone,
      send_welcome_email: "0",
      send_email_verification_link: "0",
      store_address: "Assinatura mensal Webskull Marketplace"
    };

    console.log('📡 Payload enviado ao Multvendor:', JSON.stringify(payload, null, 2));

    try {
      const response = await api.post('/sellers.json', payload);
      console.log('🎉 Vendedor criado!');
      return response.data;
    } catch (erro) {
      console.error('❌ Erro ao criar vendedor:', {
        mensagem: erro.message,
        resposta: erro?.response?.data,
        status: erro?.response?.status
      });
      throw erro;
    }
  }
};
