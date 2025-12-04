import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Calendar, ExternalLink, Hash, Trash2 } from "lucide-react";
import { AddPublicationModal } from "@/components/modals/AddPublicationModal";
import { getSupabaseData, deleteSupabaseItem } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Publications() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPublications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getSupabaseData("publications");
      setPublications(data);
    } catch (error) {
      console.error('Error loading publications:', error);
      toast.error('Erro ao carregar publicações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSupabaseItem("publications", id);
      await loadPublications();
      toast.success("Publicação removida com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar publicação:', error);
      toast.error("Erro ao remover publicação");
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
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Publicações</h1>
          <p className="text-muted-foreground">
            Artigos, papers e publicações científicas
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Publicação
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : publications.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhuma publicação cadastrada ainda</p>
            <p className="text-sm">Adicione suas publicações acadêmicas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {publications.map((pub) => (
            <Card key={pub.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{pub.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{pub.autores}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {pub.revista && (
                      <p className="text-sm font-medium text-muted-foreground">
                        {pub.revista}
                      </p>
                    )}
                    
                    {pub.data_publicacao && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(pub.data_publicacao)}
                        </span>
                      </div>
                    )}
                    
                    {pub.doi && (
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-mono">
                          DOI: {pub.doi}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {pub.resumo && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {pub.resumo}
                    </p>
                  )}
                  
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver publicação
                    </a>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(pub.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddPublicationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={loadPublications}
      />
    </div>
  );
}