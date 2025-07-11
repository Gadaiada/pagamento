module.exports = {
  registrarVendedor: async (v) => {
    const payload = {
      sp_store_name: v.nome,
      seller_name: v.nome,
      email: v.email,
      password: 'SenhaSegura123', // você pode tornar isso aleatória depois
      state: 'RO',
      country: 'Brasil',
      country_code: 55,
      contact: v.telefone,
      send_welcome_email: "0",
      send_email_verification_link: "0"
    };

    console.log('📡 Enviando para Multvendor:', payload);

    const response = await api.post('/sellers.json', payload);
    return response.data;
  }
};
