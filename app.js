const express = require('express');
const path = require('path');
app.use(express.static(path.join(__dirname)));

const app = express();
require('dotenv').config();
app.use(express.json());

const checkout = require('./checkoutAsaas');
const webhook = require('./webhook');

app.use('/', checkout);
app.use('/', webhook);

app.listen(3000, () => {
  console.log('🟢 Servidor rodando na porta 3000');
});
