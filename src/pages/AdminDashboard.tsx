import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Navigate } from "react-router-dom";

// Definição das interfaces para evitar "any"
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  image?: string;
}

interface Treino {
  id: string;
  nome: string;
  categoria: string;
  semana: string;
  dia: string;
  exercicios: Exercise[];
}

interface GrupoMuscular {
  id: string;
  nome: string;
}

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Verificando sessão do usuário...");
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        const session = sessionData?.session;
        
        if (sessionError || !session) {
          console.error("Erro ao obter sessão:", sessionError?.message || "Nenhuma sessão ativa.");
          setIsAdmin(false);
          setLoading(false);
          return;
        }
    
        const userId = session.user?.id;
        
        if (!userId) {
          console.error("Erro: ID do usuário não encontrado.");
          setIsAdmin(false);
          setLoading(false);
          return;
        }
    
        console.log(`Usuário autenticado: ${userId}`);
    
        // Verificar se o usuário é admin no Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("id, is_admin")
          .eq("id", userId)
          .single();
    
        if (error) {
          console.error("Erro ao buscar usuário na tabela profiles:", error.message);
          setIsAdmin(false);
        } else {
          console.log("Dados do usuário no banco:", data);
          setIsAdmin(data?.is_admin ?? false);
        }
      } catch (error) {
        console.error("Erro inesperado ao verificar status de admin:", error);
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
    return <Navigate to="/" />;
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
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("treinos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Convertendo "exercicios" corretamente para um array de Exercise[]
        const treinosFormatados: Treino[] = data.map((treino) => ({
          id: treino.id,
          nome: treino.nome,
          categoria: treino.categoria,
          semana: treino.semana,
          dia: treino.dia,
          exercicios: Array.isArray(treino.exercicios)
            ? (treino.exercicios as unknown as { nome: string; repeticoes: string; observacoes?: string; imagem?: string }[]).map((exercicio) => ({
                id: exercicio.nome, // Usando nome como ID caso não tenha um explícito
                name: exercicio.nome,
                sets: exercicio.repeticoes ? parseInt(exercicio.repeticoes.split("x")[0]) || 1 : 1,
                reps: exercicio.repeticoes ? exercicio.repeticoes.split("x")[1] || "Máximo" : "Máximo",
                notes: exercicio.observacoes ?? "",
                image: exercicio.imagem ?? "",
              }))
            : [], // Caso "exercicios" não seja um array, retorna um array vazio
        }));

        setTreinos(treinosFormatados);
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
  const [grupos, setGrupos] = useState<GrupoMuscular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("grupos_musculares")
          .select("*")
          .order("nome");

        if (error) throw error;

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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Gerenciar Grupos Musculares</h2>

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