const express = require('express');
const router = express.Router();
const { criarCliente, criarAssinatura } = require('./asaasService');
const { salvarVendedor } = require('./armazenamentoVendedor');


router.post('/vendedor', async (req, res) => {
  try {
    const vendedor = req.body;

    const cliente = await criarCliente(vendedor);
    const assinatura = await criarAssinatura(cliente.id);

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
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar vendedor', detalhes: err.message });
  }
});

module.exports = router;
