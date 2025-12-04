import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validarCPF } from "@/lib/ValidarCPF";


export default function Register() {
  const { user, signUp, loading: authLoading } = useAuth();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState<"Estudante" | "Professor">("Estudante");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !password || !cpf) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!acceptTerms) {
      toast.error("Você precisa aceitar os Termos de Uso");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!validarCPF(cpf)) {
      toast.error("CPF inválido");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Formato de e-mail inválido");
      return;
    }


    setLoading(true);
    const { error } = await signUp(email, password, nome, cpf, tipoPerfil);
    
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("Este e-mail já está cadastrado");
      } else {
        toast.error(error.message || "Erro ao fazer cadastro");
      }
    }
    setLoading(false);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return cpf;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding - FIXED */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[hsl(var(--auth-gradient-start))] to-[hsl(var(--auth-gradient-end))] items-center justify-center p-12 fixed left-0 top-0 h-screen">
        <div className="text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                <img src="/src/assets/logo.png" alt="Atlas Acadêmico" className="h-40 w-40" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Atlas Acadêmico</h1>
          <p className="text-xl text-white/90 max-w-md">
            Construa seu perfil acadêmico profissional e conecte-se com a comunidade.
          </p>
        </div>
      </div>

      {/* Right Side - Form - SCROLLABLE */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen overflow-y-auto p-8 bg-background flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden mb-8">
            <img src="/src/assets/logo.png" alt="Atlas Acadêmico" className="h-20 w-20 mx-auto mb-3" />
            <h2 className="text-2xl font-serif font-bold">Atlas Acadêmico</h2>
          </div>
          
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Cadastrar</h2>
            <p className="mt-2 text-muted-foreground">
              Crie sua conta e comece sua jornada
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                maxLength={14}
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-full"
                autoComplete="new-password"
                data-lpignore="true"
                data-form-type="other"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-full"
              />
              <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-perfil" className="text-primary">Tipo de perfil</Label>
              <Select
                value={tipoPerfil}
                onValueChange={(value: "Estudante" | "Professor") => setTipoPerfil(value)}
              >
                <SelectTrigger className="rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estudante">Estudante</SelectItem>
                  <SelectItem value="Professor">Professor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-tight cursor-pointer"
              >
                Aceito os Termos de Uso e Política de Privacidade
              </label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tenho uma conta! </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}