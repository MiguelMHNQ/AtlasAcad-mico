import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { suggestProfiles } from "@/lib/search";

export function SearchBar() {
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
        const results = await suggestProfiles(query, 4);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
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

  return (
    <>
      <div className="relative w-full max-w-md" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => {
              if (query.trim() && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}

            placeholder="Buscar por nome ou competência..."
            className="pl-10 rounded-full"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full mt-2 w-full p-2 z-50">
            <div className="space-y-2">
              {suggestions.map((profile) => (
                <Link
                  key={profile.id}
                  to={`/profile/${profile.id}`}
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                >
                  <div className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors">
                    <p className="font-medium text-sm">{profile.nome}</p>
                    {profile.badges && profile.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile.badges.slice(0, 2).map((badge: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>

      
    </>
  );
}
