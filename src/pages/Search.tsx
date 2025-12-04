import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, ArrowLeft, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Executar busca automaticamente se houver query na URL
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

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
          .or(`nome.ilike.%${query}%,tipo_perfil.ilike.%${query}%`)
          .limit(5);

        if (!error && data) {
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
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

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setShowSuggestions(false);
    try {
      if (!supabase) {
        console.error('Supabase não configurado');
        return;
      }

      // Buscar todos os perfis
      const { data: allData, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(50);

      if (error) {
        console.error('Erro na busca:', error);
        setResults([]);
        return;
      }

      if (allData) {
        const filtered = allData.filter(profile => {
          const nameMatch = profile.nome?.toLowerCase().includes(searchQuery.toLowerCase());
          const typeMatch = profile.tipo_perfil?.toLowerCase().includes(searchQuery.toLowerCase());
          const badgeMatch = profile.badges?.some((badge: string) => 
            badge.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return nameMatch || typeMatch || badgeMatch;
        });
        setResults(filtered);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch(query);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Início
        </Button>

        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Buscar Perfis
          </h1>
          <p className="text-muted-foreground">
            Encontre outros usuários do Atlas Acadêmico
          </p>
        </div>

        <Card className="p-6">
          <div className="relative" ref={searchRef}>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Buscar por nome, tipo ou competência..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => {
                    if (query.trim() && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="flex-1"
                />
                
                {showSuggestions && suggestions.length > 0 && (
                  <Card className="absolute top-full mt-2 w-full p-2 z-50">
                    <div className="space-y-2">
                      {suggestions.map((profile) => (
                        <div
                          key={profile.id}
                          onClick={() => {
                            navigate(`/profile/${profile.user_id}`);
                            setQuery("");
                            setSuggestions([]);
                            setShowSuggestions(false);
                          }}
                          className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(profile.nome)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{profile.nome}</p>
                              <p className="text-xs text-muted-foreground">{profile.tipo_perfil}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                <SearchIcon className="mr-2 h-4 w-4" />
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Resultados ({results.length})
            </h2>
            
            {results.map((profile) => (
              <Card key={profile.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(profile.nome)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{profile.nome}</h3>
                      <p className="text-muted-foreground">{profile.tipo_perfil}</p>
                      {profile.bio && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {profile.bio}
                        </p>
                      )}
                      {profile.badges && profile.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.badges.slice(0, 3).map((badge: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {profile.badges.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.badges.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/profile/${profile.user_id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Preview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && query && !loading && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              Nenhum perfil encontrado para "{query}"
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}