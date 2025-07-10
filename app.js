const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname))); // ✅ aqui fecha tudo certinho

app.use('/', require('./checkoutAsaas'));
app.use('/', require('./webhook'));

app.listen(3000, () => {
  console.log('🟢 Servidor rodando na porta 3000');
});
