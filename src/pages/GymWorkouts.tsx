
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import WorkoutSelector from "@/components/WorkoutSelector";
import WorkoutDisplay from "@/components/WorkoutDisplay";
import { Loader2 } from "lucide-react";
import { useWorkout } from "@/contexts/WorkoutContext";

// Componente interno que usa o hook useWorkout
const GymWorkoutsContent = () => {
  const { isLoading } = useWorkout();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Carregando treinos...</span>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Treinos de Academia</h1>
      <WorkoutSelector categoryId="gym" />
      <WorkoutDisplay />
    </div>
  );
};

// Componente principal que fornece o contexto
const GymWorkouts = () => {
  return (
    <WorkoutProvider>
      <GymWorkoutsContent />
    </WorkoutProvider>
  );
};

export default GymWorkouts;
