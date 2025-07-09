router.post('/vendedor', async (req, res) => {
  try {
    const vendedor = req.body;

    console.log('📦 Dados recebidos:', vendedor);

    const cliente = await criarCliente(vendedor);
    console.log('✅ Cliente criado:', cliente);

    const assinatura = await criarAssinatura(cliente.id);
    console.log('✅ Assinatura criada:', assinatura);

    salvarVendedor(cliente.id, {
      ...vendedor,
      asaasId: cliente.id,
      assinaturaId: assinatura.id,
      status: 'pendente'
    });

    res.json({
      mensagem: 'Vendedor registrado. Aguardando pagamento.',
      linkPagamento: assinatura.invoiceUrl
    });
  } catch (erro) {
    console.error('❌ Erro completo ao registrar vendedor:', erro?.response?.data || erro.message);
    res.status(500).json({
      erro: 'Erro ao registrar vendedor',
      detalhes: erro?.response?.data || erro.message
    });
  }
});
