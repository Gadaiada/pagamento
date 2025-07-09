const sellers = {};

module.exports = {
  salvarVendedor: (id, dados) => sellers[id] = dados,

  aprovarVendedor: (id) => {
    if (sellers[id]) sellers[id].status = 'aprovado';
  },

  buscarVendedor: (id) => sellers[id]
};
