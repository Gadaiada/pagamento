const express = require('express');
const app = express();
require('dotenv').config();

const webhook = require('./webhook'); // ✅ webhook deve exportar diretamente um Router

app.use(express.json()); // Middleware para interpretar JSON
app.use('/webhook', webhook); // ✅ Encaixe correto da rota

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
