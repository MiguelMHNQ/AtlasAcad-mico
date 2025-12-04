import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addSupabaseItem } from "@/lib/supabase";

interface AddPublicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddPublicationModal({ open, onOpenChange, onAdd }: AddPublicationModalProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    autores: "",
    revista: "",
    data_publicacao: "",
    doi: "",
    link: "",
    resumo: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.autores) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      const publicationData = {
        titulo: formData.titulo,
        autores: formData.autores,
        revista: formData.revista,
        data_publicacao: formData.data_publicacao || null,
        doi: formData.doi || null,
        resumo: formData.resumo || null,
        link: formData.link || null
      };
      await addSupabaseItem("publications", publicationData);
      toast.success("Publicação adicionada com sucesso!");
      setFormData({ titulo: "", autores: "", revista: "", data_publicacao: "", doi: "", link: "", resumo: "" });
      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar publicação:', error);
      toast.error("Erro ao adicionar publicação");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Publicação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título da publicação"
            />
          </div>
          <div>
            <Label htmlFor="autores">Autores *</Label>
            <Input
              id="autores"
              value={formData.autores}
              onChange={(e) => setFormData({ ...formData, autores: e.target.value })}
              placeholder="Nome dos autores separados por vírgula"
            />
          </div>
          <div>
            <Label htmlFor="revista">Revista/Conferência</Label>
            <Input
              id="revista"
              value={formData.revista}
              onChange={(e) => setFormData({ ...formData, revista: e.target.value })}
              placeholder="Nome da revista ou conferência"
            />
          </div>
          <div>
            <Label htmlFor="data_publicacao">Data de Publicação</Label>
            <Input
              id="data_publicacao"
              type="date"
              value={formData.data_publicacao}
              onChange={(e) => setFormData({ ...formData, data_publicacao: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="doi">DOI</Label>
            <Input
              id="doi"
              value={formData.doi}
              onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
              placeholder="Digital Object Identifier"
            />
          </div>
          <div>
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="Link para a publicação"
            />
          </div>
          <div>
            <Label htmlFor="resumo">Resumo</Label>
            <Textarea
              id="resumo"
              value={formData.resumo}
              onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
              placeholder="Resumo da publicação"
              rows={4}
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