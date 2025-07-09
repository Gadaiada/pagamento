const fs = require('fs');
const path = require('path');

// Caminho para o arquivo que armazena os vendedores
const filePath = path.join(__dirname, 'vendedores.json');

// Função auxiliar para ler os dados do arquivo
function lerVendedores() {
  try {
    if (!fs.existsSync(filePath)) return {};
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler arquivo de vendedores:', err.message);
    return {};
  }
}

// Função auxiliar para salvar os dados no arquivo
function salvarNoArquivo(vendedores) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(vendedores, null, 2));
  } catch (err) {
    console.error('Erro ao salvar arquivo de vendedores:', err.message);
  }
}

module.exports = {
  salvarVendedor: (id, dados) => {
    const vendedores = lerVendedores();
    vendedores[id] = dados;
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
  }
};
