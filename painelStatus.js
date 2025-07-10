const express = require('express');
const router = express.Router();
const { buscarVendedor } = require('./armazenamentoVendedor');

router.get('/api/status/:asaasId', (req, res) => {
  const vendedor = buscarVendedor(req.params.asaasId);
  if (!vendedor) return res.status(404).json({ erro: 'Vendedor não encontrado' });

  res.json({
    nome: vendedor.nome,
    email: vendedor.email,
    plano: vendedor.plano,
    status: vendedor.status
  });
});

module.exports = router;
