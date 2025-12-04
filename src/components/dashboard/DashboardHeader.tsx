import { useState, useEffect, useRef } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function DashboardHeader() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        if (!supabase) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(50);

        if (!error && data) {
          // Filtrar por nome, tipo e badges
          const filtered = data.filter(profile => {
            const nameMatch = profile.nome?.toLowerCase().includes(query.toLowerCase());
            const typeMatch = profile.tipo_perfil?.toLowerCase().includes(query.toLowerCase());
            const badgeMatch = profile.badges?.some((badge: string) => 
              badge.toLowerCase().includes(query.toLowerCase())
            );
            return nameMatch || typeMatch || badgeMatch;
          }).slice(0, 5);
          
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        }


      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const renderProfile = (profile: any) => (
    <div className="p-4 hover:bg-muted rounded-lg transition-colors cursor-pointer border">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {getInitials(profile.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{profile.nome}</h3>
          <p className="text-sm text-muted-foreground">{profile.tipo_perfil}</p>
          {profile.badges && profile.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {profile.badges.map((badge: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-4 px-6 py-4">
          <SidebarTrigger />
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Buscar por nome, tipo ou competência..."
                className="pl-9 rounded-full"
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute top-full mt-2 w-full p-2 z-50 max-h-96 overflow-y-auto">
                <p className="text-sm text-muted-foreground px-2 mb-2">Sugestões</p>
                <div className="space-y-2">
                  {suggestions.map((profile) => (
                    <Link
                      key={profile.id}
                      to={`/profile/${profile.user_id}`}
                      onClick={() => {
                        setQuery("");
                        setShowSuggestions(false);
                      }}
                    >
                      {renderProfile(profile)}
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </header>

      
    </>
  );
}
