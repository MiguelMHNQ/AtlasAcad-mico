import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, GraduationCap, Globe, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [data, setData] = useState<any>({
    experiences: [],
    education: [],
    projects: [],
    languages: [],
    certificates: [],
    publications: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('ID do usuário não fornecido');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!supabase) {
          setError('Sistema não configurado');
          return;
        }

        // Buscar perfil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profileError) {
          setError('Perfil não encontrado');
          return;
        }

        setProfile(profileData);

        // Buscar todos os dados em paralelo
        const [
          { data: experiences },
          { data: education },
          { data: projects },
          { data: languages },
          { data: certificates },
          { data: publications }
        ] = await Promise.all([
          supabase.from('experiences').select('*').eq('user_id', userId),
          supabase.from('education').select('*').eq('user_id', userId),
          supabase.from('projects').select('*').eq('user_id', userId),
          supabase.from('languages').select('*').eq('user_id', userId),
          supabase.from('certificates').select('*').eq('user_id', userId),
          supabase.from('publications').select('*').eq('user_id', userId)
        ]);

        setData({
          experiences: experiences || [],
          education: education || [],
          projects: projects || [],
          languages: languages || [],
          certificates: certificates || [],
          publications: publications || []
        });

      } catch (error: any) {
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">{error || 'Perfil não encontrado'}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Button>
        </div>

        {/* Cabeçalho do Perfil */}
        <Card className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {getInitials(profile.nome)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">{profile.nome}</h1>
              <p className="text-muted-foreground mb-4">{profile.tipo_perfil}</p>
              {profile.bio && <p className="text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>}
            </div>
            {profile.badges && profile.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {profile.badges.map((badge: string, index: number) => (
                  <Badge key={index} variant="secondary">{badge}</Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Experiências */}
        {data.experiences.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Experiência Profissional</h2>
            <div className="space-y-4">
              {data.experiences.map((exp: any) => (
                <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{exp.cargo}</h3>
                  </div>
                  <p className="text-muted-foreground font-medium mb-2">{exp.empresa}</p>
                  {exp.periodo && (
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{exp.periodo}</span>
                    </div>
                  )}
                  {exp.descricao && <p className="text-sm text-muted-foreground">{exp.descricao}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Educação */}
        {data.education.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Formação Acadêmica</h2>
            <div className="space-y-4">
              {data.education.map((edu: any) => (
                <div key={edu.id} className="border-l-2 border-primary/20 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{edu.curso}</h3>
                  </div>
                  <p className="text-muted-foreground font-medium">{edu.instituicao}</p>
                  {edu.periodo && <p className="text-sm text-muted-foreground">{edu.periodo}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Projetos */}
        {data.projects.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Projetos</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {data.projects.map((project: any) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{project.titulo}</h3>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.descricao}</p>
                  {project.tecnologias && (
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(project.tecnologias) ? project.tecnologias : []).map((tech: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Idiomas */}
        {data.languages.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Idiomas</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {data.languages.map((lang: any) => (
                <div key={lang.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="font-medium">{lang.idioma}</span>
                  </div>
                  <Badge variant="secondary">{lang.nivel}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Certificados */}
        {data.certificates.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Certificados</h2>
            <div className="space-y-4">
              {data.certificates.map((cert: any) => (
                <div key={cert.id} className="border-l-2 border-primary/20 pl-4">
                  <h3 className="font-semibold">{cert.titulo}</h3>
                  <p className="text-muted-foreground">{cert.instituicao}</p>
                  {cert.data_emissao && (
                    <p className="text-sm text-muted-foreground">
                      Emitido em: {new Date(cert.data_emissao).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {cert.descricao && <p className="text-sm text-muted-foreground mt-2">{cert.descricao}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Publicações */}
        {data.publications.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Publicações</h2>
            <div className="space-y-4">
              {data.publications.map((pub: any) => (
                <div key={pub.id} className="border-l-2 border-primary/20 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{pub.titulo}</h3>
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </a>
                    )}
                  </div>
                  {pub.autores && <p className="text-muted-foreground">{pub.autores}</p>}
                  {pub.revista && <p className="text-sm text-muted-foreground">{pub.revista}</p>}
                  {pub.data_publicacao && (
                    <p className="text-sm text-muted-foreground">
                      Publicado em: {new Date(pub.data_publicacao).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {pub.resumo && <p className="text-sm text-muted-foreground mt-2">{pub.resumo}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}