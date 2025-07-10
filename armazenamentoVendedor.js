const fs = require('fs');
const CAMINHO = './vendedores.json';

function carregar() {
  try {
    return JSON.parse(fs.readFileSync(CAMINHO));
  } catch {
    return {};
  }
}

function salvar(dados) {
  fs.writeFileSync(CAMINHO, JSON.stringify(dados, null, 2));
}

module.exports = {
  salvarVendedorTemporario: (id, dados) => {
    const json = carregar();
    json[id] = { ...dados, status: 'aguardando' };
    salvar(json);
  },
  aprovarVendedor: (id) => {
    const json = carregar();
    if (json[id]) json[id].status = 'aprovado';
    salvar(json);
  },
  buscarVendedor: (id) => carregar()[id]
};
