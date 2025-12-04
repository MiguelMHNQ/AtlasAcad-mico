import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, GraduationCap, Calendar, Trash2 } from "lucide-react";
import { AddEducationModal } from "@/components/modals/AddEducationModal";
import { getSupabaseData, deleteSupabaseItem } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Education() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEducation = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getSupabaseData("education");
      setEducation(data);
    } catch (error) {
      console.error('Error loading education:', error);
      toast.error('Erro ao carregar formações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSupabaseItem("education", id);
      await loadEducation();
      toast.success("Formação removida com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar educação:', error);
      toast.error("Erro ao remover formação");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Formação Acadêmica</h1>
          <p className="text-muted-foreground">
            Seus cursos, diplomas e certificações acadêmicas
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Formação
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : education.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhuma formação cadastrada ainda</p>
            <p className="text-sm">Adicione suas formações acadêmicas</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">{edu.curso}</h3>
                    {edu.grau && (
                      <Badge variant="secondary">{edu.grau}</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">{edu.instituicao}</p>
                  {edu.periodo && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{edu.periodo}</span>
                    </div>
                  )}
                  {edu.descricao && (
                    <p className="text-sm text-muted-foreground mt-3">{edu.descricao}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(edu.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddEducationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={loadEducation}
      />
    </div>
  );
}