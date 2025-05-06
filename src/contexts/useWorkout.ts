import { useContext } from "react";
import { WorkoutContext } from "./WorkoutContext"; // Agora está separado, evitando o ciclo!

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  
  return context;
};