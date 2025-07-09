require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const sellerRoutes = require('./seller');
const webhookRoutes = require('./webhook');

app.use('/api', sellerRoutes);
app.use('/api', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
