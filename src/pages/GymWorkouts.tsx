
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import WorkoutSelector from "@/components/WorkoutSelector";
import WorkoutDisplay from "@/components/WorkoutDisplay";

const GymWorkouts = () => {
  return (
    <WorkoutProvider>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Treinos de Academia</h1>
        <WorkoutSelector categoryId="gym" />
        <WorkoutDisplay />
      </div>
    </WorkoutProvider>
  );
};

export default GymWorkouts;
