
export interface FastingPlan {
  name: string;
  hours: number;
  description: string;
}

export interface ActiveFast {
  startTime: string;
  plan: FastingPlan;
}

export interface CompletedFast extends ActiveFast {
  endTime: string;
  durationSeconds: number;
}

export interface TimelineEvent {
  hour: number;
  title: string;
  description: string;
  benefits: string[];
}

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  thigh?: number;
}

export interface BloodLevels {
  ketones?: number;
  glucose?: number;
}

export interface Electrolytes {
  sodium?: number;
  potassium?: number;
  magnesium?: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD format
  waterIntake?: number; // in ml or glasses
  weight?: number;
  measurements?: BodyMeasurements;
  bloodLevels?: BloodLevels;
  electrolytes?: Electrolytes;
}

export interface User {
  name: string;
  email: string;
  photo?: string;
}
