export interface Identity {
  id: number;
  name: string;
  description: string;
}

export interface Habit {
  id: number;
  name: string;
  category: string;
  daily_target: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  cue?: string;
  reward?: string;
  identity_id?: number;
  identity_name?: string;
  stack_after_id?: number;
  created_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  completed_at: string;
}

export interface Reflection {
  id: number;
  date: string;
  easiest_habit: string;
  difficult_habit: string;
  consistency_insight: string;
  created_at: string;
}

export interface Experiment {
  id: number;
  name: string;
  duration_days: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed';
  summary?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  focusTime: number;
  breakTime: number;
}
