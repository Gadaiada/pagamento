const express = require('express');
const app = express();

// Middleware para interpretar JSON no body
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('[webhook] 🧾 Evento recebido:', req.body);

  // Extraindo os dados com segurança
  const event = req.body?.event;
  const paymentStatus = req.body?.payment?.status;
  const subscriptionId = req.body?.payment?.subscription;

  console.log('[webhook] 🎯 Status:', paymentStatus);
  console.log('[webhook] 🔗 Assinatura:', subscriptionId);

  if (!subscriptionId) {
    console.error('[armazenamento] ❌ ID da assinatura está undefined');
    return res.status(400).json({ error: 'Subscription ID não encontrado' });
  }

  // Simulação da busca no armazenamento
  console.log('[armazenamento] 🔍 Buscando vendedor com ID:', subscriptionId);
  const vendedor = buscarVendedor(subscriptionId); // Substitua por seu método real

  if (!vendedor) {
    console.log('[armazenamento] ⚠️ Vendedor não encontrado');
    return res.status(404).json({ error: 'Vendedor não encontrado' });
  }

  console.log('[armazenamento] ✅ Vendedor encontrado:', vendedor);

  // Lógica adicional...
  res.status(200).json({ message: 'Webhook processado com sucesso' });
});

// Função fictícia para simular a busca
function buscarVendedor(id) {
  const bancoDeDadosSimulado = {
    'sub_dyygz8jf34todu2b': { nome: 'Marcio', plano: 'Premium' }
  };
  return bancoDeDadosSimulado[id] || null;
}

app.listen(3000, () => {
  console.log('🚀 Servidor rodando na porta 3000');
});
