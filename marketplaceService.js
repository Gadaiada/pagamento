const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.MULTVENDOR_API_URL, // Ex: https://mvmapi.webkul.com
  headers: {
    Authorization: `Bearer ${process.env.MULTVENDOR_API_TOKEN}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

module.exports = {
  registrarVendedor: async (vendedor) => {
    try {
      const payload = {
        sp_store_name: vendedor.loja || vendedor.nome,
        seller_name: vendedor.nome,
        email: vendedor.email,
        password: 'SenhaSegura123', // Pode personalizar ou gerar aleatória
        state: vendedor.estado || 'RO',
        country: vendedor.pais || 'Brasil',
        country_code: 55,
        contact: vendedor.telefone,
        custom_fields: [{ "101": vendedor.plano || 'mensal' }],
        send_welcome_email: "0",
        send_email_verification_link: "0"
      };

      const response = await api.post('/api/v2/sellers.json', payload);

      console.log('✅ Vendedor registrado na Multvendor:', response.data);
      return response.data;
    } catch (erro) {
      console.error('❌ Erro ao enviar vendedor para a Multvendor:', erro?.response?.data || erro.message);
      throw erro;
    }
  }
};
