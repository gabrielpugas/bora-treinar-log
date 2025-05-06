
import { useWorkout } from "@/contexts/useWorkout";
import ExerciseCard from "./ExerciseCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WorkoutDisplay = () => {
  const { getCurrentWorkout } = useWorkout();
  const currentWorkout = getCurrentWorkout();
  
  if (!currentWorkout) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Nenhum treino selecionado</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">
        {currentWorkout.name}
      </h2>
      
      <div className="space-y-6">
        {currentWorkout.exercises.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Nenhum exercício encontrado neste treino</p>
            </CardContent>
          </Card>
        ) : (
          currentWorkout.exercises.map((exercise, index) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              index={index} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutDisplay;
