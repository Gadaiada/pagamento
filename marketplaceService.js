const axios = require('axios');
require('dotenv').config();

// 🚀 Cria cliente HTTP com a base URL já incluindo /api/v2
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
    const payload = {
      sp_store_name: v.nome,
      seller_name: v.nome,
      email: v.email,
      password: 'SenhaSegura123',
      state: 'RO',
      country: 'Brasil',
      country_code: 55,
      contact: v.telefone,
      custom_fields: [{ "101": v.plano }],
      send_welcome_email: "0",
      send_email_verification_link: "0"
    };

    // ✅ AQUI: não repetir /api/v2 — só usar o endpoint relativo
    const response = await api.post('/sellers.json', payload);

    return response.data;
  }
};
