import express from 'express';
import axios from 'axios';
import { recuperarVendedor } from './armazenamentoVendedor.js';

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
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

    const email = vendedor.email;
    const nome = vendedor.nome || 'Novo Vendedor';
    const senha = Math.random().toString(36).slice(-10);

    try {
      const resposta = await axios.post(
        'https://SUA-LOJA.myshopify.com/apps/multi_vendor/api/sellers', // ⬅️ Troque "SUA-LOJA" pela sua loja Shopify
        {
          seller: {
            email: email,
            first_name: nome,
            password: senha
          }
        },
        {
          headers: {
            'Authorization': 'Bearer SEU_TOKEN_AQUI', // ⬅️ Troque pelo seu token da Webkul
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('[webhook] 🚀 Vendedor criado com sucesso:', resposta.data);
      res.sendStatus(200);
    } catch (erro) {
      console.error('[webhook] ❌ Erro ao criar vendedor:', erro.response?.data || erro.message);
      res.sendStatus(500);
    }
  } else {
    console.log('[webhook] 🤷 Evento ignorado.');
    res.sendStatus(204);
  }
});

export default app;
