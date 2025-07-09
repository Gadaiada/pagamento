const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.MULTVENDOR_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.MULTVENDOR_API_TOKEN}`
  }
});

module.exports = {
  registrarVendedor: async (vendedor) => {
    try {
      const response = await api.post('/seller/register', {
        sp_store_name: vendedor.loja || vendedor.nome,
        seller_name: vendedor.nome,
        email: vendedor.email,
        password: 'senhaSegura123', // Pode ser gerada ou fixa
        state: vendedor.estado || 'RO',
        country: vendedor.pais || 'Brasil',
        country_code: 55,
        contact: vendedor.telefone,
        custom_fields: [{ "101": vendedor.plano }],
        send_welcome_email: "0",
        send_email_verification_link: "0"
      });

      console.log('✅ Vendedor criado na plataforma multivendor:', response.data);
      return response.data;
    } catch (erro) {
      console.error('❌ Erro ao registrar vendedor no multivendor:', erro?.response?.data || erro.message);
      throw erro;
    }
  }
};
