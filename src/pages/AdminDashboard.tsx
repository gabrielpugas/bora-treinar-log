
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // Verificar se o usuário é admin
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();
        
        if (error || !data) {
          console.error("Erro ao verificar status de admin:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data.is_admin);
        }
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold mb-6">Acesso Restrito</h1>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Painel do Administrador</h1>
      
      <Tabs defaultValue="treinos">
        <TabsList className="mb-6">
          <TabsTrigger value="treinos">Treinos</TabsTrigger>
          <TabsTrigger value="grupos">Grupos Musculares</TabsTrigger>
        </TabsList>
        
        <TabsContent value="treinos">
          <TreinosTab />
        </TabsContent>
        
        <TabsContent value="grupos">
          <GruposTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TreinosTab = () => {
  const [treinos, setTreinos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("treinos")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setTreinos(data || []);
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
        toast.error("Erro ao carregar treinos");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTreinos();
  }, []);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Treinos</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Novo Treino
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {treinos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum treino cadastrado.
            </p>
          ) : (
            treinos.map((treino) => (
              <Card key={treino.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{treino.nome}</CardTitle>
                  <CardDescription>
                    {treino.categoria === "gym" ? "Academia" : "Em Casa"} • {" "}
                    Semana {treino.semana.replace("week", "")} • Dia {treino.dia}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {treino.exercicios.length} exercícios cadastrados
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const GruposTab = () => {
  const [grupos, setGrupos] = useState<any[]>([]);
  const [novoGrupo, setNovoGrupo] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("grupos_musculares")
          .select("*")
          .order("nome");
        
        if (error) {
          throw error;
        }
        
        setGrupos(data || []);
      } catch (error) {
        console.error("Erro ao buscar grupos musculares:", error);
        toast.error("Erro ao carregar grupos musculares");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrupos();
  }, []);
  
  const adicionarGrupo = async () => {
    if (!novoGrupo.trim()) {
      toast.error("Digite o nome do grupo muscular");
      return;
    }
    
    try {
      setSalvando(true);
      const { data, error } = await supabase
        .from("grupos_musculares")
        .insert([{ nome: novoGrupo.trim() }])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setGrupos([...grupos, data]);
      setNovoGrupo("");
      toast.success("Grupo muscular adicionado");
    } catch (error: any) {
      console.error("Erro ao adicionar grupo muscular:", error);
      
      if (error.code === "23505") { // Código para violação de unique constraint
        toast.error("Este grupo muscular já existe");
      } else {
        toast.error("Erro ao adicionar grupo muscular");
      }
    } finally {
      setSalvando(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Gerenciar Grupos Musculares</h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={novoGrupo}
          onChange={(e) => setNovoGrupo(e.target.value)}
          placeholder="Nome do grupo muscular"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          disabled={salvando}
        />
        <Button onClick={adicionarGrupo} disabled={salvando}>
          {salvando ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Adicionar
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-2">
          {grupos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum grupo muscular cadastrado.
            </p>
          ) : (
            grupos.map((grupo) => (
              <Card key={grupo.id} className="p-4">
                {grupo.nome}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
