const vendedores = {};

function salvarVendedorTemporario(idCliente, dados) {
  console.log(`[armazenamento] 💾 Salvando vendedor temporário: ${idCliente}`);
  vendedores[idCliente] = dados;
}

function buscarVendedor(idCliente) {
  const existe = !!vendedores[idCliente];
  console.log(`[armazenamento] 🔍 Buscar vendedor: ${idCliente} → ${existe ? 'Encontrado' : 'Não encontrado'}`);
  return vendedores[idCliente];
}

function aprovarVendedor(idCliente) {
  if (vendedores[idCliente]) {
    vendedores[idCliente].aprovado = true;
    console.log(`[armazenamento] ✅ Vendedor aprovado: ${idCliente}`);
  }
}

module.exports = {
  salvarVendedorTemporario,
  buscarVendedor,
  aprovarVendedor
};
