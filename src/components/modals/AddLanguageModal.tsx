import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addSupabaseItem } from "@/lib/supabase";

interface AddLanguageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddLanguageModal({ open, onOpenChange, onAdd }: AddLanguageModalProps) {
  const [formData, setFormData] = useState({
    idioma: "",
    nivel: "Básico"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.idioma) {
      toast.error("Preencha o nome do idioma");
      return;
    }

    try {
      await addSupabaseItem("languages", formData);
      toast.success("Idioma adicionado com sucesso!");
      setFormData({ idioma: "", nivel: "Básico" });
      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar idioma:', error);
      toast.error("Erro ao adicionar idioma");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Idioma</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="idioma">Idioma *</Label>
            <Input
              id="idioma"
              value={formData.idioma}
              onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
              placeholder="Ex: Inglês, Espanhol, Francês"
            />
          </div>
          <div>
            <Label htmlFor="nivel">Nível</Label>
            <select
              id="nivel"
              value={formData.nivel}
              onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="Básico">Básico</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Fluente">Fluente</option>
              <option value="Nativo">Nativo</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}