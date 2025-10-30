import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Link to="/register">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-6">Termos de Uso e Política de Privacidade</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">1. Termos de Uso</h2>
            <p className="text-muted-foreground">
              Ao utilizar o Atlas Acadêmico, você concorda com os seguintes termos de uso:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Você é responsável pela veracidade das informações fornecidas.</li>
              <li>O uso da plataforma deve ser feito de forma ética e profissional.</li>
              <li>É proibido compartilhar conteúdo ofensivo ou ilegal.</li>
              <li>Reservamo-nos o direito de suspender contas que violem estes termos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">2. Política de Privacidade</h2>
            <p className="text-muted-foreground">
              Sua privacidade é importante para nós. Esta política descreve como coletamos e usamos suas informações:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Coletamos informações necessárias para fornecer nossos serviços.</li>
              <li>Seus dados pessoais são armazenados de forma segura.</li>
              <li>Não compartilhamos suas informações com terceiros sem sua permissão.</li>
              <li>Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">3. Cookies</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies para melhorar sua experiência na plataforma e manter sua sessão ativa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-3">4. Contato</h2>
            <p className="text-muted-foreground">
              Para dúvidas ou solicitações relacionadas à privacidade, entre em contato através do e-mail:
              <span className="font-medium"> contato@atlasacademico.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}