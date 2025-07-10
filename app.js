const express = require('express');
const path = require('path');
require('dotenv').config();

// 🟢 inicializa o express primeiro
const app = express();

app.use(express.json());

// 🔗 serve arquivos estáticos como index.html
app.use(express.static(path.join(__dirname)));

// 🔀 rotas
app.use('/', require('./checkoutAsaas'));
app.use('/', require('./webhook'));
app.use('/', require('./painelStatus')); // se estiver usando

// 🚀 inicia o servidor
app.listen(3000, () => {
  console.log('🟢 Servidor rodando na porta 3000');
});
