import { createContext } from "react";
import { WorkoutContextType } from "./WorkoutTypes"; // Certifique-se de que esse arquivo existe!

export const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);