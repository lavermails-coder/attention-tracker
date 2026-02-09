export type CategoryType =
  | 'phone_media'
  | 'worries_negative'
  | 'work_study'
  | 'people_relationships'
  | 'planning_future'
  | 'past_memories'
  | 'body_present_moment'
  | 'observing_neutral';

export type ExperimentStatus = 'active' | 'completed' | 'abandoned';

export interface AttentionEntry {
  id: string;
  timestamp: string;
  category: CategoryType;
  details?: string;
  dayNumber: number;
  weekNumber: number;
  createdAt: string;
}

export interface DailyPractice {
  date: string;
  completed: boolean;
  note?: string;
}

export interface Experiment {
  id: string;
  exerciseId: string;
  exerciseName: string;
  startDate: string;
  endDate: string;
  targetPattern: CategoryType | 'scattered';
  baselinePercentage: number;
  status: ExperimentStatus;
  dailyPracticeLog: DailyPractice[];
  completedDate?: string;
  resultPercentage?: number;
  percentageChange?: number;
  userReflection?: string;
}

export interface PingSchedule {
  date: string;
  ping1Time: string;
  ping2Time: string;
  ping1Completed: boolean;
  ping2Completed: boolean;
}

export interface UserSettings {
  id: string;
  activeHoursStart: string;
  activeHoursEnd: string;
  notificationsEnabled: boolean;
  timezone: string;
  onboardingCompleted: boolean;
  firstUseDate: string;
  lastPingSchedule: PingSchedule | null;
  version: string;
}

export interface CategoryBreakdown {
  category: CategoryType;
  count: number;
  percentage: number;
}

export interface WeekComparison {
  category: CategoryType;
  percentageChange: number;
  direction: 'increase' | 'decrease' | 'same';
}

export interface WeeklySummary {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalEntries: number;
  categoryBreakdown: CategoryBreakdown[];
  topCategory: CategoryType;
  topCategoryPercentage: number;
  comparisonToPreviousWeek?: WeekComparison;
  generatedAt: string;
}

export interface Category {
  id: CategoryType;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export interface ExerciseStep {
  step: number;
  title: string;
  instruction: string;
}

export interface ExerciseInstructions {
  overview: string;
  steps: ExerciseStep[];
  expectedOutcome: string;
  warning: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetPattern: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  shortDescription: string;
  fullInstructions: ExerciseInstructions;
}

export interface ExerciseSuggestion {
  exerciseId: string;
  targetPattern: CategoryType | 'scattered';
  percentage: number | null;
  reason: string;
}

export interface Intention {
  id: string;
  timestamp: string;
  category?: CategoryType;
  description?: string;
  createdAt: string;
}
