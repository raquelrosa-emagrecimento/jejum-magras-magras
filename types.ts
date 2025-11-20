
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
