const express = require('express');
const router = express.Router();
const { criarCliente, criarAssinatura } = require('./asaasService');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

router.get('/checkout/asaas', async (req, res) => {
  try {
    const { name, email, phone, document, plano = 'mensal' } = req.query;

    if (!name || !email || !phone || !document) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, email, phone, document' });
    }

    const cliente = await criarCliente({ nome: name, email, telefone: phone, documento: document });
    const assinatura = await criarAssinatura(cliente.id, plano);

    salvarVendedorTemporario(cliente.id, {
      nome: name,
      email,
      telefone: phone,
      plano,
      documento,
      asaasId: cliente.id
    });

    res.json({ invoiceUrl: assinatura.invoiceUrl });
  } catch (erro) {
    console.error('❌ Erro no checkoutAsaas:', erro?.response?.data || erro.message);
    res.status(500).json({ error: 'Falha ao gerar link de pagamento' });
  }
});

module.exports = router;
