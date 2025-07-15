const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

console.log('[multvendor] 🚀 Inicializando serviço de criação de vendedor...');

// 🔐 Configuração da API
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
    console.log(`[multvendor] 🟢 Iniciando registro para: ${v.nome} (${v.email})`);

    // 🔒 Gerando senha segura
    const senha = crypto.randomBytes(4).toString('hex');
    console.log(`[multvendor] 🔑 Senha gerada: ${senha}`);

    // 📦 Montagem do payload
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

    console.log(`[multvendor] 📤 Enviando payload para Webkul:\n${JSON.stringify(payload, null, 2)}`);

    // 🚀 Enviando requisição
    try {
      const response = await api.post('/sellers.json', payload);

      console.log(`[multvendor] 🎯 Status da resposta: ${response.status}`);
      console.log(`[multvendor] 🎉 Vendedor criado com sucesso!`);
      console.log(`[multvendor] 📄 Resposta completa:\n${JSON.stringify(response.data, null, 2)}`);

      return response.data;
    } catch (erro) {
      const statusErro = erro?.response?.status || 'desconhecido';
      const dadosErro = erro?.response?.data || erro?.message || 'Erro desconhecido';

      console.error(`[multvendor] ❌ Erro ao criar vendedor (status ${statusErro})`);
      console.error(`[multvendor] 🔍 Detalhes do erro:\n${JSON.stringify(dadosErro, null, 2)}`);

      throw erro;
    }
  }
};
