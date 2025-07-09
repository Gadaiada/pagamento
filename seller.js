const express = require('express');
const router = express.Router();
const { criarCliente, criarAssinatura } = require('./asaasService');
const {
  salvarVendedor,
  buscarVendedor,
  listarVendedores
} = require('./armazenamentoVendedor');

router.post('/vendedor', async (req, res) => {
  try {
    const vendedor = req.body;
    console.log('📦 Dados recebidos para cadastro:', vendedor);

    const cliente = await criarCliente(vendedor);
    console.log('✅ Cliente criado no Asaas:', cliente);

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

router.get('/vendedores/:id', (req, res) => {
  const vendedor = buscarVendedor(req.params.id);
  if (vendedor) {
    res.json(vendedor);
  } else {
    res.status(404).json({ erro: 'Vendedor não encontrado' });
  }
});

router.get('/vendedores', (req, res) => {
  const todos = listarVendedores();
  res.json(todos);
});

module.exports = router;
