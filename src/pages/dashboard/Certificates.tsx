import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Award, Calendar, Hash, Trash2 } from "lucide-react";
import { AddCertificateModal } from "@/components/modals/AddCertificateModal";
import { getSupabaseData, deleteSupabaseItem } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Certificates() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCertificates = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getSupabaseData("certificates");
      setCertificates(data);
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast.error('Erro ao carregar certificados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSupabaseItem("certificates", id);
      await loadCertificates();
      toast.success("Certificado removido com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar certificado:', error);
      toast.error("Erro ao remover certificado");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Certificados</h1>
          <p className="text-muted-foreground">
            Certificados de cursos, workshops e eventos
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Certificado
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : certificates.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhum certificado cadastrado ainda</p>
            <p className="text-sm">Adicione seus certificados e conquistas</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certificates.map((cert) => (
            <Card key={cert.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">{cert.titulo || cert.nome}</h3>
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">{cert.instituicao || cert.emissor}</p>
                  
                  <div className="space-y-2">
                    {cert.data_emissao && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Emitido em {formatDate(cert.data_emissao)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(cert.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {cert.descricao && (
                <p className="text-sm text-muted-foreground">{cert.descricao}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <AddCertificateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={loadCertificates}
      />
    </div>
  );
}