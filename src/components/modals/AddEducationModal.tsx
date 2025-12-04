import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addSupabaseItem } from "@/lib/supabase";

interface AddEducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddEducationModal({ open, onOpenChange, onAdd }: AddEducationModalProps) {
  const [formData, setFormData] = useState({
    instituicao: "",
    curso: "",
    grau: "",
    periodo: "",
    descricao: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.instituicao || !formData.curso) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      await addSupabaseItem("education", formData);
      toast.success("Formação adicionada com sucesso!");
      setFormData({ instituicao: "", curso: "", grau: "", periodo: "", descricao: "" });
      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar educação:', error);
      toast.error("Erro ao adicionar formação");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Formação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="instituicao">Instituição *</Label>
            <Input
              id="instituicao"
              value={formData.instituicao}
              onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
              placeholder="Nome da instituição"
            />
          </div>
          <div>
            <Label htmlFor="curso">Curso *</Label>
            <Input
              id="curso"
              value={formData.curso}
              onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
              placeholder="Nome do curso"
            />
          </div>
          <div>
            <Label htmlFor="grau">Grau</Label>
            <select
              id="grau"
              value={formData.grau}
              onChange={(e) => setFormData({ ...formData, grau: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Selecione o grau</option>
              <option value="Ensino Médio">Ensino Médio</option>
              <option value="Técnico">Técnico</option>
              <option value="Graduação">Graduação</option>
              <option value="Pós-graduação">Pós-graduação</option>
              <option value="Mestrado">Mestrado</option>
              <option value="Doutorado">Doutorado</option>
            </select>
          </div>
          <div>
            <Label htmlFor="periodo">Período</Label>
            <Input
              id="periodo"
              value={formData.periodo}
              onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
              placeholder="Ex: 2020 - 2024"
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição adicional sobre o curso"
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