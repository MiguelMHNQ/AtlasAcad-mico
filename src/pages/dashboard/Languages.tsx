import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Globe, Trash2 } from "lucide-react";
import { AddLanguageModal } from "@/components/modals/AddLanguageModal";
import { getSupabaseData, deleteSupabaseItem } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Languages() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLanguages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getSupabaseData("languages");
      setLanguages(data);
    } catch (error) {
      console.error('Error loading languages:', error);
      toast.error('Erro ao carregar idiomas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLanguages();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSupabaseItem("languages", id);
      await loadLanguages();
      toast.success("Idioma removido com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar idioma:', error);
      toast.error("Erro ao remover idioma");
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case "Nativo": return "bg-purple-100 text-purple-800";
      case "Fluente": return "bg-green-100 text-green-800";
      case "Avançado": return "bg-blue-100 text-blue-800";
      case "Intermediário": return "bg-yellow-100 text-yellow-800";
      case "Básico": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Idiomas</h1>
          <p className="text-muted-foreground">
            Idiomas que você domina e seus níveis de proficiência
          </p>
        </div>
        <Button className="rounded-full" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Idioma
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : languages.length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">Nenhum idioma cadastrado ainda</p>
            <p className="text-sm">Adicione os idiomas que você domina</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang) => (
            <Card key={lang.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{lang.idioma}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(lang.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge className={getLevelColor(lang.nivel)}>
                {lang.nivel}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      <AddLanguageModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={loadLanguages}
      />
    </div>
  );
}