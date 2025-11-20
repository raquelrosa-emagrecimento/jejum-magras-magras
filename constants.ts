
import { FastingPlan } from './types';

export const FASTING_PLANS: FastingPlan[] = [
  { name: '16:8', hours: 16, description: 'Fast for 16 hours, eat in an 8-hour window. Great for beginners.' },
  { name: '18:6', hours: 18, description: 'Fast for 18 hours, eat in a 6-hour window. A step up.' },
  { name: '20:4', hours: 20, description: 'Fast for 20 hours, eat in a 4-hour window. More advanced.' },
  { name: 'OMAD', hours: 23, description: 'One Meal A Day. Fast for 23 hours.' },
  { name: '36 Hours', hours: 36, description: 'A full day of fasting. Consult a doctor before trying.' },
];
