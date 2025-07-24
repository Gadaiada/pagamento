const express = require('express');
const app = express();
require('dotenv').config();

const webhook = require('./webhook');
const debugVendedor = require('./debugVendedor');

app.use(express.json()); // ✅ necessário para interpretar req.body corretamente

// 🔔 Rota do webhook
app.use('/webhook', webhook);

// 🧪 Rotas de inspeção e debug
app.use(debugVendedor);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
