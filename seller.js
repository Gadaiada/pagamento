const express = require('express');
const router = express.Router();
const { salvarVendedor, buscarVendedor } = require('./armazenamentoVendedor');

// Cadastro de novo vendedor (já existe)
router.post('/vendedor', async (req, res) => {
  // ... sua lógica atual ...
});

// 🔍 Novo endpoint: buscar vendedor por ID
router.get('/vendedores/:id', (req, res) => {
  const id = req.params.id;
  const vendedor = buscarVendedor(id);

  if (vendedor) {
    res.json(vendedor);
  } else {
    res.status(404).json({ erro: 'Vendedor não encontrado' });
  }
});

module.exports = router;
