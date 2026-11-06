import {
  BPStage,
  BMICategory,
  BSStage,
  BSTiming,
  CholesterolAssessment,
  HRContext,
  BloodPressureRecord,
} from '../types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

export interface StageInfo {
  stage: BPStage;
  label: string;
  rangeText: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  recommendation: string;
}

export const BP_STAGES: Record<BPStage, StageInfo> = {
  hypotension: {
    stage: 'hypotension',
    label: 'Hypotension (Low)',
    rangeText: 'SYS < 90 or DIA < 60',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#93c5fd',
    textColor: '#1d4ed8',
    description: 'Blood pressure is unusually low. May cause dizziness, fainting, or fatigue.',
    recommendation: 'Drink plenty of fluids, stand up gradually, and consult a physician if symptomatic.',
  },
  normal: {
    stage: 'normal',
    label: 'Normal BP',
    rangeText: 'SYS 90-119 & DIA 60-79',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7',
    textColor: '#047857',
    description: 'Ideal blood pressure range. Cardiovascular risk is well controlled.',
    recommendation: 'Maintain healthy lifestyle habits: balanced diet, regular exercise, and stress management.',
  },
  elevated: {
    stage: 'elevated',
    label: 'Elevated BP',
    rangeText: 'SYS 120-129 & DIA 60-79',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    textColor: '#b45309',
    description: 'Blood pressure is slightly higher than normal. Potential early warning sign.',
    recommendation: 'Adopt heart-healthy dietary changes (DASH diet), reduce sodium, and stay active.',
  },
  stage1: {
    stage: 'stage1',
    label: 'Hypertension Stage 1',
    rangeText: 'SYS 130-139 or DIA 80-89',
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
    textColor: '#c2410c',
    description: 'Persistent high blood pressure. Increases workload on arteries and heart.',
    recommendation: 'Consult your doctor. Lifestyle modifications recommended; medical therapy may be advised.',
  },
  stage2: {
    stage: 'stage2',
    label: 'Hypertension Stage 2',
    rangeText: 'SYS 140-180 or DIA 90-120',
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fca5a5',
    textColor: '#b91c1c',
    description: 'Moderately to severely elevated pressure. Significant risk of cardiovascular events.',
    recommendation: 'Prompt medical consultation required. Multiple medications and strict monitoring usually needed.',
  },
  crisis: {
    stage: 'crisis',
    label: 'Hypertensive Crisis',
    rangeText: 'SYS > 180 or DIA > 120',
    color: '#881337',
    bgColor: '#ffe4e6',
    borderColor: '#fda4af',
    textColor: '#881337',
    description: 'Critical emergency level! Severe risk of organ damage or stroke.',
    recommendation: 'Seek immediate emergency medical attention if accompanied by chest pain, headache, or vision changes!',
  },
};

export function classifyBloodPressure(systolic: number, diastolic: number): StageInfo {
  if (systolic > 180 || diastolic > 120) {
    return BP_STAGES.crisis;
  }
  if (systolic >= 140 || diastolic >= 90) {
    return BP_STAGES.stage2;
  }
  if (systolic >= 130 || diastolic >= 80) {
    return BP_STAGES.stage1;
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return BP_STAGES.elevated;
  }
  if (systolic >= 90 && systolic < 120 && diastolic >= 60 && diastolic < 80) {
    return BP_STAGES.normal;
  }
  if (systolic < 90 || diastolic < 60) {
    return BP_STAGES.hypotension;
  }
  return BP_STAGES.normal;
}

export function classifyHeartRate(bpm: number, age: number = 30, context: HRContext = 'resting'): {
  status: 'low' | 'normal' | 'high';
  label: string;
  color: string;
  normalMin: number;
  normalMax: number;
} {
  let normalMin = 60;
  let normalMax = 100;

  if (age <= 2) {
    normalMin = 80;
    normalMax = 130;
  } else if (age <= 4) {
    normalMin = 80;
    normalMax = 120;
  } else if (age <= 6) {
    normalMin = 75;
    normalMax = 115;
  } else if (age <= 9) {
    normalMin = 70;
    normalMax = 110;
  } else if (age <= 15) {
    normalMin = 70;
    normalMax = 100;
  } else {
    normalMin = 60;
    normalMax = 100;
  }

  if (context === 'workout') {
    normalMax = Math.round(220 - age);
    normalMin = 90;
  }

  if (bpm < normalMin) {
    return { status: 'low', label: 'Bradycardia (Low)', color: '#3b82f6', normalMin, normalMax };
  } else if (bpm > normalMax) {
    return { status: 'high', label: 'Tachycardia (Elevated)', color: '#ef4444', normalMin, normalMax };
  } else {
    return { status: 'normal', label: 'Normal Heart Rate', color: '#10b981', normalMin, normalMax };
  }
}

export function classifyBloodSugar(
  value: number,
  timing: BSTiming,
  unit: 'mg/dL' | 'mmol/L' = 'mg/dL'
): {
  stage: BSStage;
  label: string;
  color: string;
  mgDlValue: number;
  mmolLValue: number;
} {
  const mgDl = unit === 'mmol/L' ? value * 18.0182 : value;
  const mmolL = unit === 'mg/dL' ? value / 18.0182 : value;
  const isFasting = timing === 'fasting' || timing === 'before_meal';

  if (isFasting) {
    if (mgDl < 70) {
      return { stage: 'low', label: 'Hypoglycemia (Low)', color: '#3b82f6', mgDlValue: mgDl, mmolLValue: mmolL };
    }
    if (mgDl <= 99) {
      return { stage: 'normal', label: 'Normal Fasting', color: '#10b981', mgDlValue: mgDl, mmolLValue: mmolL };
    }
    if (mgDl <= 125) {
      return { stage: 'prediabetes', label: 'Impaired / Pre-diabetes', color: '#f59e0b', mgDlValue: mgDl, mmolLValue: mmolL };
    }
    return { stage: 'diabetes', label: 'Elevated / Diabetic Range', color: '#ef4444', mgDlValue: mgDl, mmolLValue: mmolL };
  } else {
    if (mgDl < 70) {
      return { stage: 'low', label: 'Hypoglycemia (Low)', color: '#3b82f6', mgDlValue: mgDl, mmolLValue: mmolL };
    }
    if (mgDl <= 139) {
      return { stage: 'normal', label: 'Normal Post-Meal', color: '#10b981', mgDlValue: mgDl, mmolLValue: mmolL };
    }
    if (mgDl <= 199) {
      return { stage: 'prediabetes', label: 'Elevated Post-Meal', color: '#f59e0b', mgDlValue: mgDl, mmolLValue: mmolL };
    }
    return { stage: 'diabetes', label: 'High / Diabetic Range', color: '#ef4444', mgDlValue: mgDl, mmolLValue: mmolL };
  }
}

export function calculateBMI(
  weightKg: number,
  heightCm: number
): {
  bmi: number;
  category: BMICategory;
  label: string;
  color: string;
  healthyWeightMin: number;
  healthyWeightMax: number;
} {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  const healthyWeightMin = Number((18.5 * heightM * heightM).toFixed(1));
  const healthyWeightMax = Number((24.9 * heightM * heightM).toFixed(1));

  if (bmi < 16.0) {
    return { bmi, category: 'severely_underweight', label: 'Severely Underweight', color: '#3b82f6', healthyWeightMin, healthyWeightMax };
  }
  if (bmi < 18.5) {
    return { bmi, category: 'underweight', label: 'Underweight', color: '#60a5fa', healthyWeightMin, healthyWeightMax };
  }
  if (bmi <= 24.9) {
    return { bmi, category: 'normal', label: 'Normal Weight', color: '#10b981', healthyWeightMin, healthyWeightMax };
  }
  if (bmi <= 29.9) {
    return { bmi, category: 'overweight', label: 'Overweight', color: '#f59e0b', healthyWeightMin, healthyWeightMax };
  }
  if (bmi <= 34.9) {
    return { bmi, category: 'obese1', label: 'Obese Class I', color: '#f97316', healthyWeightMin, healthyWeightMax };
  }
  if (bmi <= 39.9) {
    return { bmi, category: 'obese2', label: 'Obese Class II', color: '#ef4444', healthyWeightMin, healthyWeightMax };
  }
  return { bmi, category: 'obese3', label: 'Obese Class III', color: '#881337', healthyWeightMin, healthyWeightMax };
}

export function classifyCholesterol(
  tc: number,
  hdl: number,
  ldl: number,
  tg: number
): {
  assessment: CholesterolAssessment;
  label: string;
  color: string;
} {
  let assessment: CholesterolAssessment = 'desirable';
  if (tc >= 240 || ldl >= 160 || tg >= 200 || hdl < 35) {
    assessment = 'high';
  } else if (tc >= 200 || ldl >= 130 || tg >= 150 || hdl < 40) {
    assessment = 'borderline';
  }

  return {
    assessment,
    label: assessment === 'desirable' ? 'Desirable Lipid Profile' : assessment === 'borderline' ? 'Borderline High' : 'High Cardiovascular Risk',
    color: assessment === 'desirable' ? '#10b981' : assessment === 'borderline' ? '#f59e0b' : '#ef4444',
  };
}

export async function exportRecordsToCSVNative(records: BloodPressureRecord[]): Promise<void> {
  try {
    const headers = ['Date & Time', 'Systolic (mmHg)', 'Diastolic (mmHg)', 'Pulse (BPM)', 'Stage', 'Arm', 'Position', 'Tags', 'Notes'];
    const rows = records.map((r) => [
      new Date(r.timestamp).toLocaleString(),
      r.systolic,
      r.diastolic,
      r.pulse,
      BP_STAGES[r.stage].label,
      r.arm === 'left' ? 'Left Arm' : 'Right Arm',
      r.position.charAt(0).toUpperCase() + r.position.slice(1),
      `"${r.tags.join(', ')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `CardioVitals_BP_Export_${dateStr}.csv`;
    const docDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
    const filePath = `${docDir}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath, {
        mimeType: 'text/csv',
        dialogTitle: 'Share Blood Pressure CSV Export',
      });
    } else {
      Alert.alert('CSV Exported', `File saved to ${filePath}`);
    }
  } catch (err: any) {
    console.error('Failed to export CSV:', err);
    Alert.alert('Export Error', err.message || 'Could not export CSV file.');
  }
}
