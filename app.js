import express from 'express';
import webhook from './webhook.js';
import debug from './debug.js';
const app = express();

app.use('/', webhook);
app.use('/debug', debug);

app.listen(3000, () => {
  console.log('[app] 🚀 Servidor rodando na porta 3000');
});
