import express from 'express';
import cors from 'cors';
import { sendPasswordResetEmail, sendWelcomeEmail } from './emailService.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());



// Welcome email route (for testing)
app.post('/api/auth/welcome', async (req, res) => {
  const { email, nome, tipo_perfil } = req.body;
  
  try {
    const result = await sendWelcomeEmail(email, nome, tipo_perfil);
    
    if (result.success) {
      console.log(`📧 Email de boas-vindas enviado para: ${email}`);
      return res.json({ message: 'Email de boas-vindas enviado!' });
    } else {
      return res.status(500).json({ error: 'Erro ao enviar email' });
    }
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Atlas Acadêmico Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Atlas Acadêmico Backend rodando na porta ${PORT}`);
  console.log(`📧 Sistema de email configurado`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});