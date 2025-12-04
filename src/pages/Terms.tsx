import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
          <h1 className="text-4xl font-serif font-bold mb-4">Termos de Uso</h1>
          <p className="text-muted-foreground">Última atualização: Dezembro de 2024</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o Atlas Acadêmico, você concorda em cumprir e estar vinculado a estes 
              Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p>
              O Atlas Acadêmico é uma plataforma digital que permite aos usuários criar perfis acadêmicos, 
              compartilhar conquistas educacionais, projetos, experiências e conectar-se com outros membros 
              da comunidade acadêmica.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta do Usuário</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Você deve fornecer informações precisas e atualizadas durante o cadastro</li>
              <li>É responsável por manter a confidencialidade de sua senha</li>
              <li>Deve notificar imediatamente sobre qualquer uso não autorizado de sua conta</li>
              <li>Deve ser maior de 16 anos ou ter autorização dos responsáveis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Uso Aceitável</h2>
            <p>Você concorda em NÃO usar o Atlas Acadêmico para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Publicar conteúdo falso, enganoso ou fraudulento</li>
              <li>Violar direitos de propriedade intelectual de terceiros</li>
              <li>Assediar, intimidar ou prejudicar outros usuários</li>
              <li>Distribuir spam, vírus ou códigos maliciosos</li>
              <li>Usar a plataforma para atividades ilegais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Conteúdo do Usuário</h2>
            <p>
              Você mantém os direitos sobre o conteúdo que publica, mas concede ao Atlas Acadêmico 
              uma licença para usar, exibir e distribuir esse conteúdo na plataforma. Você é 
              responsável por garantir que possui os direitos necessários sobre todo conteúdo publicado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Privacidade</h2>
            <p>
              Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para 
              entender como coletamos, usamos e protegemos suas informações pessoais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Modificações do Serviço</h2>
            <p>
              Reservamos o direito de modificar, suspender ou descontinuar qualquer parte do 
              Atlas Acadêmico a qualquer momento, com ou sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
            <p>
              O Atlas Acadêmico é fornecido "como está". Não garantimos que o serviço será 
              ininterrupto ou livre de erros. Nossa responsabilidade é limitada ao máximo 
              permitido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Encerramento</h2>
            <p>
              Podemos encerrar ou suspender sua conta a qualquer momento por violação destes 
              termos. Você pode encerrar sua conta a qualquer momento através das configurações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do 
              email: contato@atlasacademico.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}