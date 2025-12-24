import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeItem } from "@/components/dashboard/BadgeItem";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/SearchBar";
import { FileDown, Share2, Pencil, Plus, Check } from "lucide-react";
import { toast } from "sonner";

export default function Overview() {
  const { profile, updateProfile, user, loading } = useAuth();
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [newBadge, setNewBadge] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
          <p className="text-muted-foreground">Houve um problema ao carregar seu perfil.</p>
        </div>
      </div>
    );
  }

  const handleAddBadge = async () => {
    if (!newBadge.trim()) {
      toast.error("Digite o nome da competência");
      return;
    }

    try {
      const updatedBadges = [...(profile.badges || []), newBadge.trim()];
      const result = await updateProfile({ badges: updatedBadges });
      
      if (!result?.error) {
        setNewBadge("");
        setIsAddingBadge(false);
        toast.success("Competência adicionada!");
      } else {
        toast.error("Erro ao adicionar competência");
      }
    } catch (error) {
      console.error('Erro ao adicionar competência:', error);
      toast.error("Erro ao adicionar competência");
    }
  };

  const handleRemoveBadge = async (badgeToRemove: string) => {
    try {
      const updatedBadges = profile.badges.filter(b => b !== badgeToRemove);
      const result = await updateProfile({ badges: updatedBadges });
      
      if (!result?.error) {
        toast.success("Competência removida!");
      } else {
        toast.error("Erro ao remover competência");
      }
    } catch (error) {
      console.error('Erro ao remover competência:', error);
      toast.error("Erro ao remover competência");
    }
  };

  const handleExport = async () => {
    if (!profile) {
      toast.error("Perfil não encontrado");
      return;
    }

    setIsExporting(true);
    try {
      const { generateCurriculumPDF } = await import('@/utils/pdfGenerator');
      await generateCurriculumPDF(profile);
      toast.success("Currículo exportado com sucesso!");
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error("Erro ao exportar currículo. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!user?.id) {
      toast.error("Usuário não encontrado");
      return;
    }

    const profileUrl = `${window.location.origin}/profile/${user.id}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Link copiado para a área de transferência!");
      } else {
        // Fallback mais seguro
        const textArea = document.createElement('textarea');
        textArea.value = profileUrl;
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast.success("Link copiado!");
          } else {
            throw new Error('Copy failed');
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Erro ao copiar:', error);
      // Mostrar o link para o usuário copiar manualmente
      toast.info(`Link do perfil: ${profileUrl}`, {
        duration: 10000,
        action: {
          label: "Copiar",
          onClick: () => {
            try {
              navigator.clipboard.writeText(profileUrl);
              toast.success("Link copiado!");
            } catch {
              // Se ainda falhar, não fazer nada
            }
          }
        }
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Visão Geral</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) ao seu perfil acadêmico
        </p>
      </div>



      <Card className="p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {getInitials(profile.nome)}
            </AvatarFallback>
          </Avatar>

          <div className="max-w-2xl">
            <h2 className="text-2xl font-serif font-bold mb-1">{profile.nome}</h2>
            <p className="text-muted-foreground mb-2">{profile.tipo_perfil}</p>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-3">{profile.bio}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center items-center">
            {profile.badges?.map((badge, index) => (
              <BadgeItem
                key={index}
                badge={badge}
                editable
                onRemove={() => handleRemoveBadge(badge)}
              />
            ))}
            
            {isAddingBadge ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="Nome da badge"
                  className="h-9 rounded-full"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddBadge();
                    if (e.key === "Escape") {
                      setIsAddingBadge(false);
                      setNewBadge("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddBadge}
                  className="h-9 w-9 p-0 rounded-full"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setIsAddingBadge(true)}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Adicionar Competência
              </Button>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              className="rounded-full" 
              onClick={handleExport}
              disabled={isExporting}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? "Exportando..." : "Exportar Currículo"}
            </Button>
            <Button className="rounded-full" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar Perfil
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}