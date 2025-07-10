const express = require('express');
const router = express.Router();
const { criarCliente, criarAssinatura } = require('./asaasService');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

router.get('/checkout/asaas', async (req, res) => {
  try {
    const { name, email, phone, plano = 'mensal' } = req.query;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, email, phone' });
    }

    // 🔹 Criação do cliente no Asaas
    const cliente = await criarCliente({
      nome: name,
      email,
      telefone: phone
    });

    // 🔹 Criação da assinatura no Asaas (recorrente)
    const assinatura = await criarAssinatura(cliente.id, plano);

    // 🔹 Armazena localmente para ativar após pagamento confirmado
    salvarVendedorTemporario(cliente.id, {
      nome: name,
      email,
      telefone: phone,
      plano,
      asaasId: cliente.id
    });

    // 🔹 Retorna o link de pagamento
    res.json({ invoiceUrl: assinatura.invoiceUrl });
  } catch (erro) {
    console.error('❌ Erro no checkoutAsaas:', erro?.response?.data || erro.message);
    res.status(500).json({ error: 'Falha ao gerar link de pagamento' });
  }
});

module.exports = router;
