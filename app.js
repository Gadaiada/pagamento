const express = require('express');
const app = express();
require('dotenv').config();

const webhook = require('./webhook');
const debugVendedor = require('./debugVendedor');

app.use(express.json());
app.use('/webhook', webhook);
app.use(debugVendedor);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
