import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { addSupabaseItem } from "@/lib/supabase";

interface AddCertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: () => void;
}

export function AddCertificateModal({ open, onOpenChange, onAdd }: AddCertificateModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    emissor: "",
    data_emissao: "",
    descricao: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.emissor) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      const certificateData = {
        titulo: formData.nome,
        instituicao: formData.emissor,
        data_emissao: formData.data_emissao,
        descricao: formData.descricao
      };
      await addSupabaseItem("certificates", certificateData);
      toast.success("Certificado adicionado com sucesso!");
      setFormData({ nome: "", emissor: "", data_emissao: "", descricao: "" });
      onAdd();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar certificado:', error);
      toast.error("Erro ao adicionar certificado");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Certificado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Certificado *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome do certificado"
            />
          </div>
          <div>
            <Label htmlFor="emissor">Emissor *</Label>
            <Input
              id="emissor"
              value={formData.emissor}
              onChange={(e) => setFormData({ ...formData, emissor: e.target.value })}
              placeholder="Organização que emitiu"
            />
          </div>
          <div>
            <Label htmlFor="data_emissao">Data de Emissão</Label>
            <Input
              id="data_emissao"
              type="date"
              value={formData.data_emissao}
              onChange={(e) => setFormData({ ...formData, data_emissao: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descrição do certificado"
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