import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FolderKanban,
  GraduationCap,
  Briefcase,
  Languages,
  BookOpen,
  Award,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const menuItems = [
  { title: "Visão Geral", url: "/dashboard", icon: Home },
  { title: "Projetos", url: "/dashboard/projetos", icon: FolderKanban },
  { title: "Formação Acadêmica", url: "/dashboard/formacao", icon: GraduationCap },
  { title: "Experiência Profissional", url: "/dashboard/experiencia", icon: Briefcase },
  { title: "Idiomas e Competências", url: "/dashboard/idiomas", icon: Languages },
  { title: "Publicações", url: "/dashboard/publicacoes", icon: BookOpen },
  { title: "Certificados", url: "/dashboard/certificados", icon: Award },
  { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { open } = useSidebar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    signOut();
    setShowLogoutDialog(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-3">
            <img src="src\assets\logot.png" alt="" />
          </div>
          {open && (
            <span className="font-serif font-bold text-lg">Atlas Acadêmico</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/dashboard"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {open && <span>Sair</span>}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Sair
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}