const fs = require('fs');
const path = require('path');
const caminhoArquivo = path.join(process.cwd(), 'vendedores.json');

function lerVendedores() {
  try {
    if (!fs.existsSync(caminhoArquivo)) return {};
    const dadosBrutos = fs.readFileSync(caminhoArquivo, 'utf-8');
    return JSON.parse(dadosBrutos);
  } catch (erro) {
    console.error('❌ Erro ao ler vendedores.json:', erro.message);
    return {};
  }
}

function salvarNoArquivo(vendedores) {
  try {
    fs.writeFileSync(caminhoArquivo, JSON.stringify(vendedores, null, 2));
  } catch (erro) {
    console.error('❌ Erro ao salvar vendedores.json:', erro.message);
  }
}

module.exports = {
  salvarVendedor: (id, dados) => {
    const vendedores = lerVendedores();
    vendedores[id] = dados;
    console.log('✅ Vendedor salvo com ID:', id, dados);
    salvarNoArquivo(vendedores);
  },

  aprovarVendedor: (id) => {
    const vendedores = lerVendedores();
    if (vendedores[id]) {
      vendedores[id].status = 'aprovado';
      salvarNoArquivo(vendedores);
    }
  },

  buscarVendedor: (id) => {
    const vendedores = lerVendedores();
    return vendedores[id];
  },

  listarVendedores: () => {
    return lerVendedores();
  }
};
