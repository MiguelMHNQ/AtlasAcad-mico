import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center gap-4 px-6 py-4">
        <SidebarTrigger />
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar currículos..."
              className="pl-9 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}