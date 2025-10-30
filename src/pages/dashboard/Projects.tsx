import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos acadêmicos e profissionais
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Nenhum projeto cadastrado ainda</p>
          <p className="text-sm">Adicione seus projetos para compartilhar com a comunidade</p>
        </div>
      </Card>
    </div>
  );
}