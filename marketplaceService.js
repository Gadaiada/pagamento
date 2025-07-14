const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');

// 🔗 Cria cliente HTTP para a API Multvendor
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
    // 🔐 Gera senha aleatória de 8 caracteres hexadecimais
    const senha = crypto.randomBytes(4).toString('hex');

    const payload = {
      sp_store_name: v.nome,
      seller_name: v.nome,
      email: v.email,
      password: senha,
      state: 'RO',
      country: 'Brasil',
      country_code: 55,
      contact: v.telefone,
      send_welcome_email: "0",
      send_email_verification_link: "0"
    };

    console.log('📡 Enviando para Multvendor...');
    console.log('🔐 Dados do payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await api.post('/sellers.json', payload);
      console.log('🎉 Vendedor criado com sucesso!');
      return response.data;
    } catch (erro) {
      console.error('❌ Erro ao criar vendedor no Multvendor:', {
        mensagem: erro.message,
        resposta: erro?.response?.data,
        status: erro?.response?.status
      });
      throw erro;
    }
  }
};
