import { createContext } from "react";
import { WorkoutContextType, WorkoutCategory, WorkoutLog, GrupoMuscular } from "./WorkoutTypes";
export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);