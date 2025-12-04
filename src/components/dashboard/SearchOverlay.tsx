import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export function SearchOverlay() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const publicProfiles = JSON.parse(localStorage.getItem('atlas_public_profiles') || '{}');
    const filtered = Object.entries(publicProfiles)
      .map(([id, profile]: [string, any]) => ({ id, ...profile }))
      .filter((profile: any) => {
        const queryLower = query.toLowerCase();
        const nameMatch = profile.nome?.toLowerCase().includes(queryLower);
        const badgeMatch = profile.badges?.some((badge: string) => 
          badge.toLowerCase().includes(queryLower)
        );
        return nameMatch || badgeMatch;
      })
      .slice(0, 5);

    setSuggestions(filtered);
  }, [query]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      const publicProfiles = JSON.parse(localStorage.getItem('atlas_public_profiles') || '{}');
      const filtered = Object.entries(publicProfiles)
        .map(([id, profile]: [string, any]) => ({ id, ...profile }))
        .filter((profile: any) => {
          const queryLower = query.toLowerCase();
          const nameMatch = profile.nome?.toLowerCase().includes(queryLower);
          const badgeMatch = profile.badges?.some((badge: string) => 
            badge.toLowerCase().includes(queryLower)
          );
          return nameMatch || badgeMatch;
        });

      setResults(filtered);
      setHasSearched(true);
      setSuggestions([]);
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
    <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-20 overflow-y-auto">
      <div className="w-full max-w-2xl mx-4">
        <Card className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Buscar por nome ou competência... (pressione Enter)"
              className="pl-10 rounded-full"
              autoFocus
            />
          </div>

          {hasSearched ? (
            <>
              {results.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-lg">Nenhum resultado encontrado</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.map((profile) => (
                    <Link
                      key={profile.id}
                      to={`/profile/${profile.id}`}
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                        setHasSearched(false);
                      }}
                    >
                      {renderProfile(profile)}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <p className="text-sm text-muted-foreground px-2">Sugestões</p>
              {suggestions.map((profile) => (
                <Link
                  key={profile.id}
                  to={`/profile/${profile.id}`}
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                  }}
                >
                  {renderProfile(profile)}
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">Nenhuma sugestão encontrada</p>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}