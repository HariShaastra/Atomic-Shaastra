export interface Identity {
  id: string;
  name: string;
  description: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  daily_target: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  cue?: string;
  reward?: string;
  identity_id?: string;
  identity_name?: string;
  stack_after_id?: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
  userId: string;
}

export interface Reflection {
  id: string;
  date: string;
  easiest_habit: string;
  difficult_habit: string;
  consistency_insight: string;
  userId: string;
  created_at: string;
}

export interface Experiment {
  id: string;
  name: string;
  duration_days: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed';
  summary?: string;
  userId: string;
}

export interface UserProfile {
  name: string;
  email: string;
  focusTime: number;
  breakTime: number;
  xp: number;
  level: number;
  badges: string[];
}
