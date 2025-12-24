import nodemailer from 'nodemailer';

const createUserTransporter = (userEmail, userPassword) => {
  try {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: userEmail,
        pass: userPassword
      }
    });
  } catch (error) {
    return null;
  }
};

// Fallback para email do sistema (se configurado)
let systemTransporter;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    systemTransporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
} catch (error) {
  systemTransporter = null;
}

// Template base para emails do Atlas Acadêmico
const getEmailTemplate = (content, title = 'Atlas Acadêmico') => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 20px; border-radius: 15px; display: inline-block;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">📚 Atlas Acadêmico</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Sua jornada acadêmica em um só lugar</p>
          </div>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          ${content}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">🚀 O que você pode fazer no Atlas Acadêmico:</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px; margin: 20px 0;">
              <div style="text-align: center; min-width: 120px;">
                <div style="font-size: 24px; margin-bottom: 5px;">👤</div>
                <p style="margin: 0; font-size: 12px; color: #64748b;">Criar Perfil<br>Acadêmico</p>
              </div>
              <div style="text-align: center; min-width: 120px;">
                <div style="font-size: 24px; margin-bottom: 5px;">📄</div>
                <p style="margin: 0; font-size: 12px; color: #64748b;">Gerar Currículo<br>Profissional</p>
              </div>
              <div style="text-align: center; min-width: 120px;">
                <div style="font-size: 24px; margin-bottom: 5px;">🔍</div>
                <p style="margin: 0; font-size: 12px; color: #64748b;">Buscar Outros<br>Usuários</p>
              </div>
              <div style="text-align: center; min-width: 120px;">
                <div style="font-size: 24px; margin-bottom: 5px;">🏆</div>
                <p style="margin: 0; font-size: 12px; color: #64748b;">Compartilhar<br>Conquistas</p>
              </div>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2024 Atlas Acadêmico. Todos os direitos reservados.</p>
            <p style="color: #94a3b8; font-size: 11px; margin: 5px 0 0 0;">Uma plataforma para estudantes e professores construírem seu futuro acadêmico</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email de confirmação de cadastro
export const sendWelcomeEmail = async (email, userName, userType) => {
  if (!transporter) {
    console.log(`📧 [SIMULADO] Email de boas-vindas para: ${email}`);
    return { success: true, simulated: true };
  }

  const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
  const profileType = userType === 'Professor' ? '👨🏫 Professor' : '🎓 Estudante';
  
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 15px; display: inline-block;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
        <h2 style="margin: 0; font-size: 24px;">Bem-vindo(a) ao Atlas Acadêmico!</h2>
      </div>
    </div>
    
    <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; border-left: 4px solid #10b981; margin-bottom: 25px;">
      <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 20px;">Olá, ${userName}! 👋</h3>
      <p style="color: #047857; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
        Sua conta como <strong>${profileType}</strong> foi criada com sucesso! Agora você faz parte da nossa comunidade acadêmica.
      </p>
      <p style="color: #047857; line-height: 1.6; margin: 0; font-size: 16px;">
        Sua jornada de crescimento acadêmico e profissional começa agora! 🚀
      </p>
    </div>
    
    <div style="background: #fefce8; padding: 25px; border-radius: 12px; border-left: 4px solid #eab308; margin-bottom: 25px;">
      <h3 style="color: #a16207; margin: 0 0 15px 0; font-size: 18px;">🎯 Próximos Passos:</h3>
      <ul style="color: #a16207; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li><strong>Complete seu perfil</strong> - Adicione foto, biografia e competências</li>
        <li><strong>Adicione sua formação</strong> - Cursos, diplomas e certificados</li>
        <li><strong>Cadastre projetos</strong> - Mostre seu portfólio acadêmico</li>
        <li><strong>Gere seu currículo</strong> - PDF profissional automático</li>
        <li><strong>Conecte-se</strong> - Busque outros estudantes e professores</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginLink}" 
         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
        🚀 Acessar Minha Conta
      </a>
    </div>
    
    <div style="background: #f1f5f9; padding: 20px; border-radius: 10px; text-align: center;">
      <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
        <strong>💡 Dica:</strong> Mantenha seu perfil sempre atualizado para maximizar suas oportunidades!
      </p>
      <p style="color: #64748b; font-size: 13px; margin: 0;">
        Precisa de ajuda? Responda este email ou acesse nossa documentação.
      </p>
    </div>
  `;

  const mailOptions = {
    from: `Atlas Acadêmico <${process.env.EMAIL_USER || 'seu.email@gmail.com'}>`,
    to: email,
    subject: `🎓 Bem-vindo(a) ao Atlas Acadêmico, ${userName}!`,
    html: getEmailTemplate(content, `Bem-vindo(a), ${userName}!`)
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    return { success: false, error: error.message };
  }
};

