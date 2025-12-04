import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

export default function Settings() {
  const { profile, updateProfile, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();
  const [nome, setNome] = useState(profile?.nome || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [tipoPerfil, setTipoPerfil] = useState<"Estudante" | "Professor">(profile?.tipo_perfil || "Estudante");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile({
      nome,
      bio: bio || null,
      tipo_perfil: tipoPerfil,
    });

    if (error) {
      toast.error("Erro ao atualizar perfil");
    } else {
      toast.success("Perfil atualizado com sucesso!");
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string;
        const { error } = await updateProfile({
          avatar_url: imageUrl,
        });
        
        if (!error) {
          toast.success("Foto de perfil atualizada com sucesso!");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.nome?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Enviando..." : "Alterar Foto"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Imagens JPG, PNG ou GIF. Máximo 2MB.
                </p>
              </div>
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-full"
            />
          </div>

          {/* CPF (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={profile?.cpf || "Não informado"}
              disabled
              className="rounded-full bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              O CPF não pode ser alterado após o cadastro.
            </p>
          </div>

          {/* Biografia */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              className="resize-none min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/500 caracteres
            </p>
          </div>

          {/* Tipo de Perfil */}
          <div className="space-y-2">
            <Label htmlFor="tipo-perfil">Tipo de Perfil</Label>
            <Select
              value={tipoPerfil}
              onValueChange={(value: "Estudante" | "Professor") => setTipoPerfil(value)}
            >
              <SelectTrigger className="rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Estudante">Estudante</SelectItem>
                <SelectItem value="Professor">Professor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label className="text-base">Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Alterne entre tema claro e escuro
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="rounded-full"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </Card>

      {/* Zona de Perigo */}
      <Card className="p-6 border-red-200 dark:border-red-800">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Zona de Perigo</h3>
            <p className="text-sm text-muted-foreground">
              Ações irreversíveis que afetam permanentemente sua conta
            </p>
          </div>
          
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Apagar Conta
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                ⚠️ Esta ação é irreversível! Todos os seus dados serão permanentemente removidos.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const { error } = await deleteAccount();
                    if (error) {
                      toast.error("Erro ao apagar conta");
                    }
                  }}
                  className="rounded-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Confirmar Exclusão
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
