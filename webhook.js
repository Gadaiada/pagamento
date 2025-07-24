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

  if (evento !== 'PAYMENT_CONFIRMED' || status !== 'CONFIRMED') {
    console.log('[webhook] 🤷 Evento ignorado.');
    return res.sendStatus(204);
  }

  const vendedor = recuperarVendedor(assinatura) || recuperarVendedor(paymentLink);
  if (!vendedor) {
    console.warn('[webhook] ⚠️ Vendedor não encontrado!');
    return res.sendStatus(404);
  }

  const email = vendedor.email;
  const nome = vendedor.nome || 'Novo Vendedor';
  const senha = Math.random().toString(36).slice(-10); // senha aleatória

  try {
    const resposta = await axios.post(
      'https://gadaiada.com.br/apps/multi_vendor/api/sellers', // URL da sua loja
      {
        seller: {
          email: email,
          first_name: nome,
          password: senha
        }
      },
      {
        headers: {
          Authorization: 'Bearer SEU_TOKEN_AQUI', // 🔐 Substitua pelo token da API Webkul
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
});

export default app;
