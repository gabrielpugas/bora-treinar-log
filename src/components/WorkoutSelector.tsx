
import { useState, useEffect } from "react";
import { useWorkout } from "@/contexts/WorkoutContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface WorkoutSelectorProps {
  categoryId: string;
}

const WorkoutSelector = ({ categoryId }: WorkoutSelectorProps) => {
  const { 
    categories, 
    setSelectedCategory,
    setSelectedWeek,
    setSelectedDay,
    selectedWeek,
    selectedDay
  } = useWorkout();
  
  const [availableWeeks, setAvailableWeeks] = useState<{ id: string; name: string }[]>([]);
  const [availableDays, setAvailableDays] = useState<{ id: string; name: string }[]>([]);
  
  // Set current category
  useEffect(() => {
    setSelectedCategory(categoryId);
  }, [categoryId, setSelectedCategory]);
  
  // Update available weeks when category changes
  useEffect(() => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setAvailableWeeks(category.weeks.map(w => ({ id: w.id, name: w.name })));
      
      // Set default week if not already set
      if (category.weeks.length > 0) {
        const weekExists = category.weeks.some(w => w.id === selectedWeek);
        if (!weekExists) {
          setSelectedWeek(category.weeks[0].id);
        }
      }
    }
  }, [categoryId, categories, selectedWeek, setSelectedWeek]);
  
  // Update available days when week changes
  useEffect(() => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const week = category.weeks.find(w => w.id === selectedWeek);
      if (week) {
        setAvailableDays(week.days.map(d => ({ id: d.id, name: d.name })));
        
        // Set default day if not already set
        if (week.days.length > 0) {
          const dayExists = week.days.some(d => d.id === selectedDay);
          if (!dayExists) {
            setSelectedDay(week.days[0].id);
          }
        }
      }
    }
  }, [categoryId, categories, selectedWeek, selectedDay, setSelectedDay]);
  
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end">
      <div className="space-y-2 flex-1">
        <Label htmlFor="week-select">Semana</Label>
        <Select
          value={selectedWeek}
          onValueChange={setSelectedWeek}
        >
          <SelectTrigger id="week-select" className="w-full">
            <SelectValue placeholder="Selecione a semana" />
          </SelectTrigger>
          <SelectContent>
            {availableWeeks.map((week) => (
              <SelectItem key={week.id} value={week.id}>
                {week.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 flex-1">
        <Label htmlFor="day-select">Dia</Label>
        <Select
          value={selectedDay}
          onValueChange={setSelectedDay}
        >
          <SelectTrigger id="day-select" className="w-full">
            <SelectValue placeholder="Selecione o dia" />
          </SelectTrigger>
          <SelectContent>
            {availableDays.map((day) => (
              <SelectItem key={day.id} value={day.id}>
                {day.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default WorkoutSelector;
