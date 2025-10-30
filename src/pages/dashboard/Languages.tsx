import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Languages() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Idiomas e Competências</h1>
          <p className="text-muted-foreground">
            Idiomas que você domina e suas habilidades técnicas
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Competência
        </Button>
      </div>

      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Nenhuma competência cadastrada ainda</p>
          <p className="text-sm">Adicione idiomas e competências técnicas</p>
        </div>
      </Card>
    </div>
  );
}