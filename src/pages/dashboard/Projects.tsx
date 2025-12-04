import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { AddProjectModal } from "@/components/modals/AddProjectModal";
import { getSupabaseData, deleteSupabaseItem } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Projects() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getSupabaseData("projects");
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSupabaseItem("projects", id);
      await loadProjects();
      toast.success("Projeto removido com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      toast.error("Erro ao remover projeto");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído": return "bg-green-100 text-green-800";
      case "Em andamento": return "bg-blue-100 text-blue-800";
      case "Pausado": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos acadêmicos e profissionais
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhum projeto cadastrado ainda</p>
            <p className="text-sm">Adicione seus projetos para compartilhar com a comunidade</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{project.titulo || project.nome}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{project.descricao}</p>
              {project.tecnologias && (
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(project.tecnologias) ? project.tecnologias : project.tecnologias?.split(',')).map((tech: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <AddProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={loadProjects}
      />
    </div>
  );
}