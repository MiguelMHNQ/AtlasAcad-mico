import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeItem } from "@/components/dashboard/BadgeItem";
import { Input } from "@/components/ui/input";
import { FileDown, Share2, Pencil, Plus, Check } from "lucide-react";
import { toast } from "sonner";

export default function Overview() {
  const { profile, updateProfile } = useAuth();
  const [isAddingBadge, setIsAddingBadge] = useState(false);
  const [newBadge, setNewBadge] = useState("");

  if (!profile) {
    return <div>Carregando...</div>;
  }

  const handleAddBadge = async () => {
    if (!newBadge.trim()) {
      toast.error("Digite o nome da badge");
      return;
    }

    const updatedBadges = [...(profile.badges || []), newBadge.trim()];
    const { error } = await updateProfile({ badges: updatedBadges });

    if (!error) {
      setNewBadge("");
      setIsAddingBadge(false);
    }
  };

  const handleRemoveBadge = async (badgeToRemove: string) => {
    const updatedBadges = profile.badges.filter(b => b !== badgeToRemove);
    await updateProfile({ badges: updatedBadges });
  };

  const handleExport = () => {
    toast.info("Exportação de currículo em breve!");
  };

  const handleShare = () => {
    toast.info("Compartilhamento de perfil em breve!");
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
          Bem-vindo ao seu perfil acadêmico
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
                Adicionar Badge
              </Button>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="rounded-full" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Currículo
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