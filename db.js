module.exports.vendedores = [];

module.exports.salvarVendedor = function (vendedor) {
  const existente = module.exports.vendedores.find(v => v.id === vendedor.id);
  if (existente) {
    console.log('[db] 🔄 Vendedor já existe, atualização ignorada');
    return;
  }
  module.exports.vendedores.push(vendedor);
  console.log('[db] 💾 Vendedor salvo:', vendedor);
};
