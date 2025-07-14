const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.MULTVENDOR_API_URL, // Exemplo: https://mvmapi.webkul.com/api/v2
  headers: {
    Authorization: `Bearer ${process.env.MULTVENDOR_API_TOKEN}`, // Token puro no .env, aqui vem com "Bearer"
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
      country: 'BR',              // ISO 3166
      country_code: "55",         // Código de telefone internacional
      contact: v.telefone,
      send_welcome_email: "0",
      send_email_verification_link: "0",
      store_address: "Assinatura mensal Webskull Marketplace"
    };

    console.log('📡 Enviando payload para o Multvendor:', JSON.stringify(payload, null, 2));

    try {
      const response = await api.post('/sellers.json', payload);
      console.log('🎉 Vendedor criado com sucesso!');
      return response.data;
    } catch (erro) {
      console.error('❌ Erro ao criar vendedor:', {
        mensagem: erro.message,
        status: erro?.response?.status,
        resposta: erro?.response?.data
      });

      throw erro;
    }
  }
};
