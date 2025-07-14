const express = require('express');
const app = express();
require('dotenv').config();

const webhook = require('./webhook');

app.use(express.json()); // ✅ necessário para interpretar req.body corretamente
app.use('/webhook', webhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
