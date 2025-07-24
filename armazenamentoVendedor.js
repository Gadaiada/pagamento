const vendedoresTemporarios = {};

function salvarVendedorTemporario(clienteId, dados) {
  console.log('[armazenamento] 🧠 Salvando com ID do cliente:', clienteId);
  vendedoresTemporarios[clienteId] = dados;

  if (dados.assinatura) {
    vendedoresTemporarios[dados.assinatura] = dados;
    console.log('[armazenamento] 🧩 Indexado por assinatura:', dados.assinatura);
  }

  if (dados.paymentLink) {
    vendedoresTemporarios[dados.paymentLink] = dados;
    console.log('[armazenamento] 🔗 Indexado por paymentLink:', dados.paymentLink);
  }
}

function recuperarVendedor(id) {
  console.log('[armazenamento] 🔍 Buscando vendedor por ID:', id);
  return vendedoresTemporarios[id] || null;
}

module.exports = { salvarVendedorTemporario, recuperarVendedor };
