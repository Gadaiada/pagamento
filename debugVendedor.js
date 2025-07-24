const express = require('express');
const router = express.Router();
const {
  buscarVendedor,
  recuperarIdPorAssinaturaOuLink
} = require('./armazenamentoVendedor');

router.get('/debug/:idCliente', (req, res) => {
  const { idCliente } = req.params;
  const vendedor = buscarVendedor(idCliente);

  if (vendedor) {
    res.status(200).json({ idCliente, encontrado: true, dados: vendedor });
  } else {
    res.status(404).json({ idCliente, encontrado: false, mensagem: 'Vendedor não encontrado' });
  }
});

router.get('/debug-fallback', (req, res) => {
  const { assinatura, paymentLink } = req.query;

  const recuperado = recuperarIdPorAssinaturaOuLink(assinatura, paymentLink);
  if (recuperado) {
    const vendedor = buscarVendedor(recuperado);
    res.status(200).json({ recuperadoVia: assinatura ? 'assinatura' : 'paymentLink', idCliente: recuperado, dados: vendedor });
  } else {
    res.status(404).json({ mensagem: 'Nenhum cliente encontrado via fallback' });
  }
});

module.exports = router;
