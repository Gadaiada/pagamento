const express = require('express');
const router = express.Router();
const { criarCliente, criarAssinatura } = require('./asaasService');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

router.get('/checkout/asaas', async (req, res) => {
  try {
    const { name, email, phone, document, plano = 'mensal' } = req.query;

    // 🛡️ Validação dos campos obrigatórios
    if (!name || !email || !phone || !document) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios: name, email, phone, document'
      });
    }

    // 🧾 Criação do cliente no Asaas
    const cliente = await criarCliente({
      nome: name,
      email: email,
      telefone: phone,
      documento: document // ✅ usando 'document' corretamente
    });

    // 💳 Criação da assinatura recorrente
    const assinatura = await criarAssinatura(cliente.id, plano);

    // 💾 Armazenamento temporário para ativação futura
    salvarVendedorTemporario(cliente.id, {
      nome: name,
      email: email,
      telefone: phone,
      plano,
      documento: document,
      asaasId: cliente.id
    });

    // 🔗 Retorna o link de pagamento para redirecionamento
    res.json({ invoiceUrl: assinatura.invoiceUrl });

  } catch (erro) {
    console.error('❌ Erro no checkoutAsaas:', erro?.response?.data || erro.message);

    const mensagem = erro?.response?.data?.errors?.map(e => e.description).join('; ') || erro.message;
    res.status(500).json({
      error: 'Falha ao gerar link de pagamento',
      detalhes: mensagem
    });
  }
});

module.exports = router;
