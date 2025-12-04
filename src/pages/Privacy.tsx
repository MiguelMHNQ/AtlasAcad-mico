import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/register">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Cadastro
            </Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold mb-4">Política de Privacidade</h1>
          <p className="text-muted-foreground">Última atualização: Dezembro de 2024</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Informações que Coletamos</h2>
            <h3 className="text-xl font-medium mb-2">Informações Fornecidas por Você:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome completo e CPF</li>
              <li>Endereço de email</li>
              <li>Informações do perfil acadêmico (formação, experiências, projetos)</li>
              <li>Foto de perfil e biografia</li>
              <li>Certificados e publicações</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">Informações Coletadas Automaticamente:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Endereço IP e informações do dispositivo</li>
              <li>Dados de uso da plataforma</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Como Usamos suas Informações</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer e manter o serviço do Atlas Acadêmico</li>
              <li>Criar e gerenciar seu perfil acadêmico</li>
              <li>Facilitar conexões com outros usuários</li>
              <li>Enviar notificações importantes sobre sua conta</li>
              <li>Melhorar nossos serviços e desenvolver novos recursos</li>
              <li>Garantir a segurança da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Informações</h2>
            <p>Suas informações podem ser compartilhadas nas seguintes situações:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Perfil Público:</strong> Informações do seu perfil são visíveis para outros usuários</li>
              <li><strong>Consentimento:</strong> Quando você autoriza expressamente</li>
              <li><strong>Obrigação Legal:</strong> Quando exigido por lei ou autoridades</li>
              <li><strong>Proteção:</strong> Para proteger direitos, propriedade ou segurança</li>
            </ul>
            <p className="mt-4">
              <strong>Não vendemos</strong> suas informações pessoais para terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança para proteger suas informações:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Autenticação segura e controle de acesso</li>
              <li>Monitoramento regular de segurança</li>
              <li>Backup e recuperação de dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos</h2>
            <p>Você tem os seguintes direitos sobre suas informações pessoais:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acesso:</strong> Visualizar suas informações pessoais</li>
              <li><strong>Correção:</strong> Atualizar informações incorretas</li>
              <li><strong>Exclusão:</strong> Solicitar remoção de seus dados</li>
              <li><strong>Portabilidade:</strong> Exportar seus dados</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento de dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies e Tecnologias Similares</h2>
            <p>
              Usamos cookies para melhorar sua experiência, incluindo cookies essenciais 
              para funcionamento, cookies de preferências e cookies analíticos. Você pode 
              gerenciar suas preferências de cookies nas configurações do navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pelo tempo necessário para fornecer nossos serviços 
              ou conforme exigido por lei. Quando você exclui sua conta, removemos suas 
              informações pessoais, exceto quando a retenção for legalmente necessária.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Menores de Idade</h2>
            <p>
              Nosso serviço é destinado a usuários com 16 anos ou mais. Menores entre 16 e 18 
              anos devem ter autorização dos responsáveis. Não coletamos intencionalmente 
              informações de menores de 16 anos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
              sobre mudanças significativas através da plataforma ou por email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
            <p>
              Para dúvidas sobre esta Política de Privacidade ou para exercer seus direitos, 
              entre em contato:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: privacidade@atlasacademico.com</li>
              <li>Através das configurações da sua conta</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}