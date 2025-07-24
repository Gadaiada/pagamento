import express from 'express';
import { recuperarVendedor } from './armazenamentoVendedor.js';
const app = express();

app.get('/debug-vendedor', (req, res) => {
  const id = req.query.id;
  console.log('[debug] 🕵️ Buscando vendedor:', id);
  const vendedor = recuperarVendedor(id);
  if (vendedor) {
    res.json(vendedor);
  } else {
    console.warn('[debug] ❌ Não encontrado!');
    res.sendStatus(404);
  }
});

export default app;
