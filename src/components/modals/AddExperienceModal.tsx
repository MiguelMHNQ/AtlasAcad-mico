import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addSupabaseItem } from "@/lib/supabase";

interface AddExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddExperienceModal({ open, onOpenChange, onAdd }: AddExperienceModalProps) {
  const [formData, setFormData] = useState({
    empresa: "",
    cargo: "",
    periodo: "",
    descricao: "",
    localizacao: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresa || !formData.cargo) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      await addSupabaseItem("experiences", formData);
      toast.success("Experiência adicionada com sucesso!");
      setFormData({ empresa: "", cargo: "", periodo: "", descricao: "", localizacao: "" });
      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar experiência:', error);
      toast.error("Erro ao adicionar experiência");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Experiência</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="empresa">Empresa *</Label>
            <Input
              id="empresa"
              value={formData.empresa}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              placeholder="Nome da empresa"
            />
          </div>
          <div>
            <Label htmlFor="cargo">Cargo *</Label>
            <Input
              id="cargo"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              placeholder="Seu cargo na empresa"
            />
          </div>
          <div>
            <Label htmlFor="periodo">Período</Label>
            <Input
              id="periodo"
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
              placeholder="Ex: Jan 2020 - Dez 2022"
            />
          </div>
          <div>
            <Label htmlFor="localizacao">Localização</Label>
            <Input
              id="localizacao"
              value={formData.localizacao}
              onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
              placeholder="Cidade, Estado"
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva suas responsabilidades e conquistas"
              rows={3}
            />
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