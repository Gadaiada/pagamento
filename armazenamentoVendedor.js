const vendedores = {};

function salvarVendedorTemporario(idCliente, dados) {
  console.log(`[armazenamento] 💾 Salvando: ${idCliente}`);
  vendedores[idCliente] = dados;
  if (dados.assinatura) vendedores[`assinatura:${dados.assinatura}`] = idCliente;
  if (dados.paymentLink) vendedores[`link:${dados.paymentLink}`] = idCliente;
}

function buscarVendedor(idCliente) {
  return vendedores[idCliente];
}

function aprovarVendedor(idCliente) {
  if (vendedores[idCliente]) vendedores[idCliente].aprovado = true;
}

function recuperarIdPorAssinaturaOuLink(assinatura, paymentLink) {
  return vendedores[`assinatura:${assinatura}`] || vendedores[`link:${paymentLink}`] || null;
}

module.exports = {
  salvarVendedorTemporario,
  buscarVendedor,
  aprovarVendedor,
  recuperarIdPorAssinaturaOuLink
};
