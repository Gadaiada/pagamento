const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  aprovarVendedor,
  buscarVendedor,
  recuperarIdPorAssinaturaOuLink
} = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;

  console.log(`${logPrefix} 📥 Webhook recebido`);
  const bodyLog = JSON.stringify(req.body, null, 2);
  console.log(`${logPrefix} 📦 Corpo recebido:\n${bodyLog}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📦 Corpo recebido:\n${bodyLog}\n`);

  res.status(200).send('OK');

  const chavesRaiz = Object.keys(req.body);
  console.log(`${logPrefix} 🔎 Chaves no corpo do webhook:`, chavesRaiz);
  fs.appendFileSync('webhook.log', `${logPrefix} 🔎 Chaves no corpo: ${chavesRaiz.join(', ')}\n`);

  const evento = req.body?.evento ?? req.body?.event ?? null;
  const pagamento = req.body?.pagamento ?? req.body?.payment ?? null;
  let idCliente = pagamento?.cliente ?? null;
  const assinatura = pagamento?.assinatura;
  const paymentLink = pagamento?.paymentLink;
  const status = typeof pagamento?.status === 'string' ? pagamento.status.toUpperCase() : null;

  console.log(`${logPrefix} 🧪 Dados extraídos: Evento = ${evento}, Status = ${status}, Cliente = ${idCliente}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 🧪 Dados extraídos: Evento = ${evento}, Status = ${status}, Cliente = ${idCliente}\n`);

  if (!evento || evento !== 'PAGAMENTO_CONFIRMADO') {
    console.log(`${logPrefix} ⏸️ Evento ignorado: ${evento}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⏸️ Evento ignorado: ${evento}\n`);
    return;
  }

  if (!status || status !== 'CONFIRMADO') {
    console.log(`${logPrefix} ❌ Status inválido ou não CONFIRMADO: ${status}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Status inválido ou não CONFIRMADO: ${status}\n`);
    return;
  }

  // 🔁 Recuperar cliente dinamicamente se estiver ausente
  if (!idCliente && (assinatura || paymentLink)) {
    idCliente = recuperarIdPorAssinaturaOuLink(assinatura, paymentLink);
    if (idCliente) {
      console.log(`${logPrefix} 🔁 ID do cliente recuperado via fallback: ${idCliente}`);
      fs.appendFileSync('webhook.log', `${logPrefix} 🔁 ID recuperado via fallback: ${idCliente}\n`);
    } else {
      console.log(`${logPrefix} ❌ Cliente não encontrado por assinatura/paymentLink`);
      fs.appendFileSync('webhook.log', `${logPrefix} ❌ Cliente não encontrado por fallback\n`);
      return;
    }
  }

  const vendedor = buscarVendedor(idCliente);
  if (!vendedor) {
    console.log(`${logPrefix} ❌ Vendedor não localizado para cliente: ${idCliente}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Vendedor não localizado para cliente: ${idCliente}\n`);
    return;
  }

  console.log(`${logPrefix} ✅ Vendedor encontrado: ${vendedor.nome} (${vendedor.email})`);
  fs.appendFileSync('webhook.log', `${logPrefix} ✅ Vendedor encontrado: ${vendedor.nome} (${vendedor.email})\n`);

  aprovarVendedor(idCliente);
  console.log(`${logPrefix} ✅ Vendedor aprovado`);
  fs.appendFileSync('webhook.log', `${logPrefix} ✅ Vendedor aprovado\n`);

  try {
    const resultado = await registrarVendedor(vendedor);
    console.log(`${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}\n`);
  } catch (erro) {
    const statusErro = erro?.response?.status || 'desconhecido';
    const dadosErro = erro?.response?.data || erro;
    console.error(`${logPrefix} ❌ Erro ao criar vendedor (status ${statusErro}):`, dadosErro);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Erro ao criar vendedor: status ${statusErro}\n`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🔎 Detalhes do erro:\n${JSON.stringify(dadosErro, null, 2)}\n`);
  }
});

module.exports = router;
