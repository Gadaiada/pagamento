const express = require('express');
const webhook = require('./webhook');

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Rota do webhook
app.post('/webhook', webhook);

// Rota opcional para ver os vendedores cadastrados
const { vendedores } = require('./db');
app.get('/vendedores', (req, res) => res.json(vendedores));

// Inicializa o servidor
app.listen(3000, () => {
  console.log('🚀 Servidor iniciado na porta 3000');
});
