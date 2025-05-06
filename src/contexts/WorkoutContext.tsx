
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes?: string;
  image?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface WorkoutWeek {
  id: string;
  name: string;
  days: WorkoutDay[];
}

export interface WorkoutCategory {
  id: string;
  name: string;
  weeks: WorkoutWeek[];
}

export interface GrupoMuscular {
  id: string;
  nome: string;
}

export interface WorkoutLog {
  date: string;
  exerciseId: string;
  weight: string;
  notes?: string;
}

interface WorkoutContextType {
  categories: WorkoutCategory[];
  logs: WorkoutLog[];
  selectedCategory: string;
  selectedWeek: string;
  selectedDay: string;
  gruposMusculares: GrupoMuscular[];
  setSelectedCategory: (id: string) => void;
  setSelectedWeek: (id: string) => void;
  setSelectedDay: (id: string) => void;
  getCurrentWorkout: () => WorkoutDay | null;
  logExercise: (log: Omit<WorkoutLog, "date">) => void;
  getExerciseLogs: (exerciseId: string) => WorkoutLog[];
  getLastExerciseLog: (exerciseId: string) => WorkoutLog | null;
  fetchTreinosFromSupabase: () => Promise<void>;
  isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<WorkoutCategory[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [gruposMusculares, setGruposMusculares] = useState<GrupoMuscular[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem("workout-logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    
    // Carregar dados do Supabase
    fetchTreinosFromSupabase();
    fetchGruposMusculares();
  }, []);

  // Save logs to localStorage when they change
  useEffect(() => {
    localStorage.setItem("workout-logs", JSON.stringify(logs));
  }, [logs]);

  // Fetch treinos from Supabase
  const fetchTreinosFromSupabase = async () => {
    try {
      setIsLoading(true);
      
      // Buscar todos os treinos
      const { data: treinosData, error: treinosError } = await supabase
        .from("treinos")
        .select("*")
        .order("created_at", { ascending: false });

      if (treinosError) {
        console.error("Erro ao buscar treinos:", treinosError);
        return;
      }

      if (!treinosData || treinosData.length === 0) {
        setIsLoading(false);
        return;
      }

      // Organizar treinos por categoria
      const categoriesMap: Record<string, WorkoutCategory> = {};
      
      for (const treino of treinosData) {
        // Garantir que a categoria existe
        if (!categoriesMap[treino.categoria]) {
          categoriesMap[treino.categoria] = {
            id: treino.categoria,
            name: treino.categoria === "gym" ? "Academia" : "Em Casa",
            weeks: []
          };
        }
        
        // Encontrar ou criar semana
        let week = categoriesMap[treino.categoria].weeks.find(w => w.id === treino.semana);
        if (!week) {
          week = {
            id: treino.semana,
            name: treino.semana.startsWith("week") 
              ? `Semana ${treino.semana.replace("week", "")}` 
              : treino.semana,
            days: []
          };
          categoriesMap[treino.categoria].weeks.push(week);
        }
        
        // Adicionar dia com exercícios
        const day: WorkoutDay = {
          id: treino.dia,
          name: treino.nome,
          exercises: treino.exercicios as Exercise[]
        };
        
        week.days.push(day);
      }
      
      // Converter o map para um array
      const categoriesArray = Object.values(categoriesMap);
      setCategories(categoriesArray);
      
      // Definir valores padrão para seleção
      if (categoriesArray.length > 0) {
        setSelectedCategory(categoriesArray[0].id);
        
        if (categoriesArray[0].weeks.length > 0) {
          setSelectedWeek(categoriesArray[0].weeks[0].id);
          
          if (categoriesArray[0].weeks[0].days.length > 0) {
            setSelectedDay(categoriesArray[0].weeks[0].days[0].id);
          }
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao processar treinos:", error);
      setIsLoading(false);
    }
  };

  // Fetch grupos musculares from Supabase
  const fetchGruposMusculares = async () => {
    try {
      const { data, error } = await supabase
        .from("grupos_musculares")
        .select("*")
        .order("nome");
      
      if (error) {
        console.error("Erro ao buscar grupos musculares:", error);
        return;
      }
      
      setGruposMusculares(data.map(grupo => ({
        id: grupo.id,
        nome: grupo.nome
      })));
    } catch (error) {
      console.error("Erro ao processar grupos musculares:", error);
    }
  };

  const getCurrentWorkout = (): WorkoutDay | null => {
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;
    
    const week = category.weeks.find(w => w.id === selectedWeek);
    if (!week) return null;
    
    const day = week.days.find(d => d.id === selectedDay);
    return day || null;
  };

  const logExercise = (logData: Omit<WorkoutLog, "date">) => {
    const newLog = {
      ...logData,
      date: new Date().toISOString(),
    };
    
    setLogs(prev => [...prev, newLog]);
  };

  const getExerciseLogs = (exerciseId: string): WorkoutLog[] => {
    return logs.filter(log => log.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getLastExerciseLog = (exerciseId: string): WorkoutLog | null => {
    const exerciseLogs = getExerciseLogs(exerciseId);
    return exerciseLogs.length > 0 ? exerciseLogs[0] : null;
  };

  return (
    <WorkoutContext.Provider
      value={{
        categories,
        logs,
        selectedCategory,
        selectedWeek,
        selectedDay,
        gruposMusculares,
        setSelectedCategory,
        setSelectedWeek,
        setSelectedDay,
        getCurrentWorkout,
        logExercise,
        getExerciseLogs,
        getLastExerciseLog,
        fetchTreinosFromSupabase,
        isLoading,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  
  return context;
};
