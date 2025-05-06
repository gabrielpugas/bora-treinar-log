
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import WorkoutSelector from "@/components/WorkoutSelector";
import WorkoutDisplay from "@/components/WorkoutDisplay";

const HomeWorkouts = () => {
  return (
    <WorkoutProvider>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Treinos em Casa</h1>
        <WorkoutSelector categoryId="home" />
        <WorkoutDisplay />
      </div>
    </WorkoutProvider>
  );
};

export default HomeWorkouts;
