const vendedores = {};

function salvarVendedorTemporario(idCliente, dados) {
  vendedores[idCliente] = dados;
}

function buscarVendedor(idCliente) {
  return vendedores[idCliente];
}

function aprovarVendedor(idCliente) {
  if (vendedores[idCliente]) vendedores[idCliente].aprovado = true;
}

module.exports = {
  salvarVendedorTemporario,
  buscarVendedor,
  aprovarVendedor
};
