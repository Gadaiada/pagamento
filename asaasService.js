criarCliente: async ({ nome, email, telefone, documento }) => {
  const res = await api.post('/customers', {
    name: nome,
    email,
    phone: telefone,
    cpfCnpj: documento // 👈 campo correto que usa o "documento"
  });
  return res.data;
}
