const express = require('express');
const { recuperarVendedor } = require('./armazenamentoVendedor');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('[webhook] 📥 Webhook recebido:', req.body);

  const evento = req.body.event;
  const status = req.body.payment?.status;
  const assinatura = req.body.payment?.subscription;
  const paymentLink = req.body.payment?.paymentLink;

  console.log('[webhook] 📦 Evento:', evento);
  console.log('[webhook] 🎯 Status:', status);

  if (evento === 'PAYMENT_CONFIRMED' && status === 'CONFIRMED') {
    let vendedor = recuperarVendedor(assinatura) || recuperarVendedor(paymentLink);
    if (!vendedor) {
      console.warn('[webhook] ⚠️ Vendedor não encontrado para assinatura/paymentLink');
      return res.sendStatus(404);
    }

    console.log('[webhook] 🎉 Vendedor encontrado:', vendedor);
    // Aqui você pode enviar os dados para outro sistema ou registrar a venda
    res.sendStatus(200);
  } else {
    res.sendStatus(204); // Ignorado
  }
});

app.listen(3000, () => console.log('[webhook] 🚀 Servidor rodando na porta 3000'));
