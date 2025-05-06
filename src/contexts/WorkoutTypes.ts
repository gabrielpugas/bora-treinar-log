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
  
  export interface WorkoutContextType {
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

  export interface WorkoutDay {
    id: string;
    name: string;
    exercises: Exercise[];
  }