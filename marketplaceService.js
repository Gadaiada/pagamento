const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

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
    console.log(`[multvendor] 🔒 Gerando senha para ${v.email}: ${senha}`);

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

    console.log(`[multvendor] 📡 Payload enviado:\n${JSON.stringify(payload, null, 2)}`);

    try {
      const response = await api.post('/sellers.json', payload);
      console.log(`[multvendor] 🎉 Vendedor criado!`);
      return response.data;
    } catch (erro) {
      const statusErro = erro?.response?.status || 'desconhecido';
      const dadosErro = erro?.response?.data || erro;
      console.error(`[multvendor] ❌ Erro (status ${statusErro}):`, dadosErro);
      throw erro;
    }
  }
};
