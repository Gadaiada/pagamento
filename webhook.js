import express from 'express';
import { recuperarVendedor } from './armazenamentoVendedor.js';
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('[webhook] 📥 Recebido:', JSON.stringify(req.body, null, 2));

  const evento = req.body.event;
  const status = req.body.payment?.status;
  const assinatura = req.body.payment?.subscription;
  const paymentLink = req.body.payment?.paymentLink;

  console.log('[webhook] 🧾 Evento:', evento);
  console.log('[webhook] 🎯 Status:', status);
  console.log('[webhook] 🔗 Assinatura:', assinatura);

  if (evento === 'PAYMENT_CONFIRMED' && status === 'CONFIRMED') {
    const vendedor = recuperarVendedor(assinatura) || recuperarVendedor(paymentLink);
    if (!vendedor) {
      console.warn('[webhook] ⚠️ Vendedor não encontrado!');
      return res.sendStatus(404);
    }

    console.log('[webhook] ✅ Vendedor encontrado:', vendedor);
    // Aqui você pode integrar com outro sistema, ex: envio para Webkul
    res.sendStatus(200);
  } else {
    console.log('[webhook] 🤷 Evento ignorado.');
    res.sendStatus(204);
  }
});

export default app;
