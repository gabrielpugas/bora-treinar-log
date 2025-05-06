import React, { useState, useEffect } from "react";
import { WorkoutContext } from "./WorkoutContext";
import { WorkoutCategory, WorkoutLog, GrupoMuscular, WorkoutDay } from "./WorkoutTypes"; // Defina esses tipos corretamente
import { supabase } from "@/utils/supabase";

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<WorkoutCategory[]>([]);
    const [logs, setLogs] = useState<WorkoutLog[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedWeek, setSelectedWeek] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [gruposMusculares, setGruposMusculares] = useState<GrupoMuscular[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      fetchTreinosFromSupabase();
      fetchGruposMusculares();
    }, []);
  
    useEffect(() => {
      localStorage.setItem("workout-logs", JSON.stringify(logs));
    }, [logs]);
  
    const fetchTreinosFromSupabase = async () => {
      // Sua lógica de busca de treinos no Supabase
    };
  
    const fetchGruposMusculares = async () => {
      // Sua lógica de busca de grupos musculares no Supabase
    };
  
    const getCurrentWorkout = (): WorkoutDay | null => {
      const category = categories.find((c) => c.id === selectedCategory);
      if (!category) return null;
  
      const week = category.weeks.find((w) => w.id === selectedWeek);
      if (!week) return null;
  
      return week.days.find((d) => d.id === selectedDay) || null;
    };
  
    const logExercise = (logData: Omit<WorkoutLog, "date">) => {
      const newLog = {
        ...logData,
        date: new Date().toISOString(),
      };
  
      setLogs((prev) => [...prev, newLog]);
    };
  
    const getExerciseLogs = (exerciseId: string): WorkoutLog[] => {
      return logs
        .filter((log) => log.exerciseId === exerciseId)
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