export type BPStage = 'hypotension' | 'normal' | 'elevated' | 'stage1' | 'stage2' | 'crisis';

export interface BloodPressureRecord {
  id: string;
  timestamp: string; // ISO string
  systolic: number; // mmHg
  diastolic: number; // mmHg
  pulse: number; // BPM
  arm: 'left' | 'right';
  position: 'sitting' | 'lying' | 'standing';
  stage: BPStage;
  tags: string[];
  notes?: string;
}

export type HRContext = 'resting' | 'workout' | 'walking' | 'morning' | 'general';

export interface HeartRateRecord {
  id: string;
  timestamp: string;
  bpm: number;
  context: HRContext;
  method: 'camera_ppg' | 'manual' | 'sensor';
  notes?: string;
  wavePoints?: number[];
}

export type BSTiming = 'fasting' | 'before_meal' | 'after_meal_1h' | 'after_meal_2h' | 'bedtime' | 'random';
export type BSStage = 'low' | 'normal' | 'prediabetes' | 'diabetes';

export interface BloodSugarRecord {
  id: string;
  timestamp: string;
  value: number; // in mg/dL internally
  unit: 'mg/dL' | 'mmol/L';
  timing: BSTiming;
  stage: BSStage;
  tags: string[];
  notes?: string;
}

export type BMICategory = 
  | 'severely_underweight' 
  | 'underweight' 
  | 'normal' 
  | 'overweight' 
  | 'obese1' 
  | 'obese2' 
  | 'obese3';

export interface WeightRecord {
  id: string;
  timestamp: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  category: BMICategory;
  notes?: string;
}

export type CholesterolAssessment = 'desirable' | 'borderline' | 'high';

export interface CholesterolRecord {
  id: string;
  timestamp: string;
  tc: number; // Total Cholesterol mg/dL
  hdl: number; // High-Density Lipoprotein mg/dL
  ldl: number; // Low-Density Lipoprotein mg/dL
  tg: number; // Triglycerides mg/dL
  nonHdl: number; // TC - HDL
  unit: 'mg/dL' | 'mmol/L';
  assessment: CholesterolAssessment;
  notes?: string;
}

export interface WaterEntry {
  id: string;
  time: string; // HH:mm
  amountMl: number;
}

export interface WaterDayRecord {
  date: string; // YYYY-MM-DD
  totalMl: number;
  goalMl: number;
  entries: WaterEntry[];
}

export interface StepDayRecord {
  date: string; // YYYY-MM-DD
  steps: number;
  goalSteps: number;
  distanceKm: number;
  caloriesKcal: number;
  activeMinutes: number;
}

export interface HealthChallenge {
  id: string;
  iconName: string;
  title: string;
  description: string;
  category: 'habit' | 'diet' | 'activity' | 'mind';
  durationDays: number;
  currentStreak: number;
  completedDates: string[]; // YYYY-MM-DD
  active: boolean;
}

export interface ReminderItem {
  id: string;
  type: 'bp' | 'medication' | 'water' | 'hr' | 'sugar';
  title: string;
  time: string; // "08:00"
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  enabled: boolean;
  notes?: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  category: 'blood_pressure' | 'heart' | 'sugar' | 'cholesterol' | 'diet' | 'lifestyle';
  readTimeMin: number;
  author: string;
  reviewedBy: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  tags: string[];
  isBookmarked?: boolean;
}

export interface FoodItem {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  caloriesPer100g: number;
  sodiumMg: number;
  carbsG: number;
  sugarG: number;
  fatG: number;
  proteinG: number;
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E';
  hypertensionFriendly: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  targetWeightKg: number;
  targetSteps: number;
  targetWaterMl: number;
  targetSystolic: number;
  targetDiastolic: number;
  units: {
    pressure: 'mmHg';
    glucose: 'mg/dL' | 'mmol/L';
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft_in';
    water: 'ml' | 'oz';
  };
}
