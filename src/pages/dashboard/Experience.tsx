import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building, Calendar, MapPin, Trash2 } from "lucide-react";
import { AddExperienceModal } from "@/components/modals/AddExperienceModal";
import { getSupabaseData, deleteSupabaseItem } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Experience() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExperiences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getSupabaseData("experiences");
      setExperiences(data || []);
    } catch (error) {
      console.error('Error loading experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      if (mounted) {
        await loadExperiences();
      }
    };
    
    load();
    
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSupabaseItem("experiences", id);
      await loadExperiences();
      toast.success("Experiência removida com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar experiência:', error);
      toast.error("Erro ao remover experiência");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Experiência Profissional</h1>
          <p className="text-muted-foreground">
            Seu histórico profissional e experiências relevantes
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Experiência
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : experiences.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhuma experiência cadastrada ainda</p>
            <p className="text-sm">Adicione suas experiências profissionais</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">{exp.cargo}</h3>
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">{exp.empresa}</p>
                  {exp.periodo && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{exp.periodo}</span>
                    </div>
                  )}
                  {exp.localizacao && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{exp.localizacao}</span>
                    </div>
                  )}
                  {exp.descricao && (
                    <p className="text-sm text-muted-foreground mt-3">{exp.descricao}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(exp.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddExperienceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={loadExperiences}
      />
    </div>
  );
}