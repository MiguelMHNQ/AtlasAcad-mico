import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addSupabaseItem } from "@/lib/supabase";

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddProjectModal({ open, onOpenChange, onAdd }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tecnologias: "",
    link: "",
    status: "Em andamento"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      const projectData = {
        titulo: formData.nome,
        descricao: formData.descricao,
        tecnologias: formData.tecnologias.split(',').map(t => t.trim()),
        link: formData.link
      };
      await addSupabaseItem("projects", projectData);
      toast.success("Projeto adicionado com sucesso!");
      setFormData({ nome: "", descricao: "", tecnologias: "", link: "", status: "Em andamento" });
      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      toast.error("Erro ao adicionar projeto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Projeto *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome do seu projeto"
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva seu projeto"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="tecnologias">Tecnologias</Label>
            <Input
              id="tecnologias"
              value={formData.tecnologias}
              onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
              placeholder="Ex: React, Node.js, MongoDB"
            />
          </div>
          <div>
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://github.com/usuario/projeto"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Pausado">Pausado</option>
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