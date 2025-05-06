
import React, { createContext, useContext, useState, useEffect } from "react";

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
  setSelectedCategory: (id: string) => void;
  setSelectedWeek: (id: string) => void;
  setSelectedDay: (id: string) => void;
  getCurrentWorkout: () => WorkoutDay | null;
  logExercise: (log: Omit<WorkoutLog, "date">) => void;
  getExerciseLogs: (exerciseId: string) => WorkoutLog[];
  getLastExerciseLog: (exerciseId: string) => WorkoutLog | null;
}

// Sample data for initial setup
const gymWorkouts: WorkoutCategory = {
  id: "gym",
  name: "Academia",
  weeks: [
    {
      id: "week1",
      name: "Semana 1",
      days: [
        {
          id: "day1",
          name: "Dia 1 - Peito e Tríceps",
          exercises: [
            {
              id: "ex1",
              name: "Supino Reto",
              sets: 4,
              reps: "12, 10, 8, 8",
              notes: "Controle a descida"
            },
            {
              id: "ex2",
              name: "Crucifixo com Halteres",
              sets: 3,
              reps: "12-15",
              notes: "Foco na contração"
            },
            {
              id: "ex3",
              name: "Tríceps Corda",
              sets: 4,
              reps: "15-20",
              notes: "Manter cotovelos junto ao corpo"
            }
          ]
        },
        {
          id: "day2",
          name: "Dia 2 - Costas e Bíceps",
          exercises: [
            {
              id: "ex4",
              name: "Barra Fixa",
              sets: 4,
              reps: "10-12",
              notes: "Pegada aberta"
            },
            {
              id: "ex5",
              name: "Remada Curvada",
              sets: 3,
              reps: "10-12",
              notes: "Costas reta"
            },
            {
              id: "ex6",
              name: "Rosca Direta",
              sets: 3,
              reps: "12, 10, 8",
              notes: "Controlar a descida"
            }
          ]
        }
      ]
    }
  ]
};

const homeWorkouts: WorkoutCategory = {
  id: "home",
  name: "Em Casa",
  weeks: [
    {
      id: "week1",
      name: "Semana 1",
      days: [
        {
          id: "day1",
          name: "Dia 1 - Corpo Todo",
          exercises: [
            {
              id: "exh1",
              name: "Flexões",
              sets: 3,
              reps: "Até falhar",
              notes: "Manter core contraído"
            },
            {
              id: "exh2",
              name: "Agachamento",
              sets: 4,
              reps: "20",
              notes: "Joelhos alinhados com os pés"
            },
            {
              id: "exh3",
              name: "Prancha",
              sets: 3,
              reps: "30-60 segundos",
              notes: "Manter quadril alinhado"
            }
          ]
        }
      ]
    }
  ]
};

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories] = useState<WorkoutCategory[]>([gymWorkouts, homeWorkouts]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("gym");
  const [selectedWeek, setSelectedWeek] = useState<string>("week1");
  const [selectedDay, setSelectedDay] = useState<string>("day1");

  // Load logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem("workout-logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save logs to localStorage when they change
  useEffect(() => {
    localStorage.setItem("workout-logs", JSON.stringify(logs));
  }, [logs]);

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
        setSelectedCategory,
        setSelectedWeek,
        setSelectedDay,
        getCurrentWorkout,
        logExercise,
        getExerciseLogs,
        getLastExerciseLog,
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
