import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Certificates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Certificados</h1>
          <p className="text-muted-foreground">
            Certificados de cursos, workshops e eventos
          </p>
        </div>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Certificado
        </Button>
      </div>

      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Nenhum certificado cadastrado ainda</p>
          <p className="text-sm">Adicione seus certificados e conquistas</p>
        </div>
      </Card>
    </div>
  );
}