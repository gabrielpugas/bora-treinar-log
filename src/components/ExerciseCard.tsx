
import { useState } from "react";
import { Exercise,  } from "@/contexts/WorkoutTypes";
import { useWorkout } from "@/contexts/useWorkout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => {
  const { logExercise, getExerciseLogs, getLastExerciseLog } = useWorkout();
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  
  const lastLog = getLastExerciseLog(exercise.id);
  const exerciseLogs = getExerciseLogs(exercise.id);
  
  const handleLogExercise = () => {
    if (!weight.trim()) {
      toast.error("Informe a carga utilizada");
      return;
    }
    
    logExercise({
      exerciseId: exercise.id,
      weight,
      notes,
    });
    
    toast.success("Carga registrada com sucesso!");
    setWeight("");
    setNotes("");
  };
  
  const formatLogDate = (dateString: string) => {
    return formatRelative(new Date(dateString), new Date(), {
      locale: ptBR,
    });
  };
  
  return (
    <Card className="glass-card overflow-visible">
      <CardHeader>
        <CardTitle>
          <span className="text-secondary">{index + 1}.</span> {exercise.name}
        </CardTitle>
        <CardDescription>
          {exercise.sets} séries • {exercise.reps} repetições
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercise.notes && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Observações:</span> {exercise.notes}
          </p>
        )}
        
        {lastLog && (
          <div className="bg-card/50 rounded-lg p-3 text-sm">
            <p className="font-medium">Último registro:</p>
            <p className="text-primary">{lastLog.weight} kg</p>
            <p className="text-xs text-muted-foreground">{formatLogDate(lastLog.date)}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Carga (kg)"
              type="text"
              inputMode="decimal"
              className="flex-1"
            />
            <Button onClick={handleLogExercise} className="bg-gradient-workout hover:opacity-90">
              Registrar
            </Button>
          </div>
          
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações (opcional)"
          />
        </div>
        
        {exerciseLogs.length > 0 && (
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs w-full"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Ocultar histórico" : `Mostrar histórico (${exerciseLogs.length})`}
            </Button>
            
            {showHistory && (
              <div className="mt-3 space-y-2 text-sm max-h-60 overflow-y-auto pr-1">
                {exerciseLogs.map((log, i) => (
                  <div
                    key={i}
                    className="bg-card/40 p-2 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{log.weight} kg</p>
                      {log.notes && (
                        <p className="text-xs text-muted-foreground">{log.notes}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatLogDate(log.date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
