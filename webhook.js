const { gerarSenhaAleatoria } = require('./utils');
const { salvarVendedor } = require('./db');

module.exports = (req, res) => {
  console.log('[webhook] 🔔 Evento recebido:', req.body);

  try {
    const event = req.body?.event;
    const payment = req.body?.payment;
    const subscriptionId = payment?.subscription;
    const status = payment?.status;

    if (!event || !payment || !subscriptionId || !status) {
      console.warn('[webhook] ⚠️ Dados incompletos no corpo');
      return res.status(400).json({ error: 'Dados incompletos no webhook' });
    }

    console.log(`[webhook] 🎯 Evento: ${event}, Status: ${status}, Sub ID: ${subscriptionId}`);

    if (event !== 'PAYMENT_CONFIRMED' || status !== 'CONFIRMED') {
      console.log('[webhook] ⏭️ Evento ignorado, não é pagamento confirmado');
      return res.status(200).json({ message: 'Evento ignorado' });
    }

    // Simulando busca de email no pagamento (substitua conforme sua estrutura)
    const emailDoCliente = payment.email || req.body?.customer?.email;
    if (!emailDoCliente) {
      console.error('[webhook] ❌ Email do cliente não encontrado');
      return res.status(400).json({ error: 'Email não encontrado' });
    }

    const senha = gerarSenhaAleatoria();
    const novoVendedor = {
      id: subscriptionId,
      email: emailDoCliente,
      senha,
      criadoEm: new Date().toISOString()
    };

    salvarVendedor(novoVendedor);
    console.log('[webhook] ✅ Vendedor criado com sucesso:', novoVendedor);

    res.status(200).json({ message: 'Vendedor registrado com sucesso' });
  } catch (err) {
    console.error('[webhook] 💥 Erro no processamento:', err.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
