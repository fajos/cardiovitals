import React, { createContext, useContext, useState, useEffect } from 'react';
import { UniversalStorage } from '../utils/storage';
import {
  BloodPressureRecord,
  HeartRateRecord,
  BloodSugarRecord,
  WeightRecord,
  CholesterolRecord,
  WaterDayRecord,
  StepDayRecord,
  HealthChallenge,
  ReminderItem,
  InsightArticle,
  UserProfile,
} from '../types';
import {
  DEFAULT_USER_PROFILE,
  PREDEFINED_CHALLENGES,
  PREDEFINED_REMINDERS,
  INSIGHT_ARTICLES,
  generateSeedData,
} from '../utils/seedData';
import {
  classifyBloodPressure,
  classifyBloodSugar,
  calculateBMI,
  classifyCholesterol,
} from '../utils/healthCalculations';

interface HealthContextType {
  bpRecords: BloodPressureRecord[];
  hrRecords: HeartRateRecord[];
  bsRecords: BloodSugarRecord[];
  weightRecords: WeightRecord[];
  cholesterolRecords: CholesterolRecord[];
  waterRecords: WaterDayRecord[];
  stepRecords: StepDayRecord[];
  challenges: HealthChallenge[];
  reminders: ReminderItem[];
  articles: InsightArticle[];
  userProfile: UserProfile;

  addBPRecord: (data: Omit<BloodPressureRecord, 'id' | 'stage'>) => void;
  deleteBPRecord: (id: string) => void;

  addHRRecord: (data: Omit<HeartRateRecord, 'id'>) => void;
  deleteHRRecord: (id: string) => void;

  addBSRecord: (data: Omit<BloodSugarRecord, 'id' | 'stage'>) => void;
  deleteBSRecord: (id: string) => void;

  addWeightRecord: (weightKg: number, notes?: string) => void;
  deleteWeightRecord: (id: string) => void;

  addCholesterolRecord: (data: Omit<CholesterolRecord, 'id' | 'assessment' | 'nonHdl'>) => void;
  deleteCholesterolRecord: (id: string) => void;

  addWater: (amountMl: number) => void;
  addSteps: (steps: number) => void;

  toggleChallengeDay: (challengeId: string, dateStr: string) => void;
  toggleChallengeActive: (challengeId: string) => void;

  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<ReminderItem, 'id'>) => void;
  deleteReminder: (id: string) => void;

  toggleBookmarkArticle: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  resetToDefaultData: () => void;
  exportBackupJson: () => Promise<string>;
  importBackupJson: (jsonString: string) => Promise<boolean>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);
const STORAGE_KEY = '@cardiovitals_pro_data_v1';

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [bpRecords, setBpRecords] = useState<BloodPressureRecord[]>([]);
  const [hrRecords, setHrRecords] = useState<HeartRateRecord[]>([]);
  const [bsRecords, setBsRecords] = useState<BloodSugarRecord[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [cholesterolRecords, setCholesterolRecords] = useState<CholesterolRecord[]>([]);
  const [waterRecords, setWaterRecords] = useState<WaterDayRecord[]>([]);
  const [stepRecords, setStepRecords] = useState<StepDayRecord[]>([]);
  const [challenges, setChallenges] = useState<HealthChallenge[]>(PREDEFINED_CHALLENGES);
  const [reminders, setReminders] = useState<ReminderItem[]>(PREDEFINED_REMINDERS);
  const [articles, setArticles] = useState<InsightArticle[]>(INSIGHT_ARTICLES);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Load data from AsyncStorage
  useEffect(() => {
    async function loadData() {
      try {
        const saved = await UniversalStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setBpRecords(parsed.bpRecords || []);
          setHrRecords(parsed.hrRecords || []);
          setBsRecords(parsed.bsRecords || []);
          setWeightRecords(parsed.weightRecords || []);
          setCholesterolRecords(parsed.cholesterolRecords || []);
          setWaterRecords(parsed.waterRecords || []);
          setStepRecords(parsed.stepRecords || []);
          setChallenges(parsed.challenges || PREDEFINED_CHALLENGES);
          setReminders(parsed.reminders || PREDEFINED_REMINDERS);
          setArticles(parsed.articles || INSIGHT_ARTICLES);
          setUserProfile(parsed.userProfile || DEFAULT_USER_PROFILE);
        } else {
          const seed = generateSeedData();
          setBpRecords(seed.bpRecords);
          setHrRecords(seed.hrRecords);
          setBsRecords(seed.bsRecords);
          setWeightRecords(seed.weightRecords);
          setCholesterolRecords(seed.cholesterolRecords);
          setWaterRecords(seed.waterRecords);
          setStepRecords(seed.stepRecords);
        }
      } catch (e) {
        console.error('Failed to load local health data:', e);
        const seed = generateSeedData();
        setBpRecords(seed.bpRecords);
        setHrRecords(seed.hrRecords);
        setBsRecords(seed.bsRecords);
        setWeightRecords(seed.weightRecords);
        setCholesterolRecords(seed.cholesterolRecords);
        setWaterRecords(seed.waterRecords);
        setStepRecords(seed.stepRecords);
      } finally {
        setDataLoaded(true);
      }
    }
    loadData();
  }, []);

  // Save data to AsyncStorage
  useEffect(() => {
    if (!dataLoaded) return;
    async function saveData() {
      try {
        const payload = {
          bpRecords,
          hrRecords,
          bsRecords,
          weightRecords,
          cholesterolRecords,
          waterRecords,
          stepRecords,
          challenges,
          reminders,
          articles,
          userProfile,
        };
        await UniversalStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.error('Failed to save health data:', e);
      }
    }
    saveData();
  }, [
    dataLoaded,
    bpRecords,
    hrRecords,
    bsRecords,
    weightRecords,
    cholesterolRecords,
    waterRecords,
    stepRecords,
    challenges,
    reminders,
    articles,
    userProfile,
  ]);

  const addBPRecord = (data: Omit<BloodPressureRecord, 'id' | 'stage'>) => {
    const stageInfo = classifyBloodPressure(data.systolic, data.diastolic);
    const newRecord: BloodPressureRecord = {
      ...data,
      id: `bp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      stage: stageInfo.stage,
    };
    setBpRecords((prev) => [newRecord, ...prev]);
  };

  const deleteBPRecord = (id: string) => {
    setBpRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addHRRecord = (data: Omit<HeartRateRecord, 'id'>) => {
    const newRecord: HeartRateRecord = {
      ...data,
      id: `hr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setHrRecords((prev) => [newRecord, ...prev]);
  };

  const deleteHRRecord = (id: string) => {
    setHrRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addBSRecord = (data: Omit<BloodSugarRecord, 'id' | 'stage'>) => {
    const stageInfo = classifyBloodSugar(data.value, data.timing, data.unit);
    const newRecord: BloodSugarRecord = {
      ...data,
      id: `bs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      stage: stageInfo.stage,
    };
    setBsRecords((prev) => [newRecord, ...prev]);
  };

  const deleteBSRecord = (id: string) => {
    setBsRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addWeightRecord = (weightKg: number, notes?: string) => {
    const bmiInfo = calculateBMI(weightKg, userProfile.heightCm);
    const newRecord: WeightRecord = {
      id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      weightKg,
      heightCm: userProfile.heightCm,
      bmi: bmiInfo.bmi,
      category: bmiInfo.category,
      notes,
    };
    setWeightRecords((prev) => [newRecord, ...prev]);
  };

  const deleteWeightRecord = (id: string) => {
    setWeightRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addCholesterolRecord = (data: Omit<CholesterolRecord, 'id' | 'assessment' | 'nonHdl'>) => {
    const nonHdl = Math.max(0, data.tc - data.hdl);
    const classification = classifyCholesterol(data.tc, data.hdl, data.ldl, data.tg);
    const newRecord: CholesterolRecord = {
      ...data,
      id: `chol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nonHdl,
      assessment: classification.assessment,
    };
    setCholesterolRecords((prev) => [newRecord, ...prev]);
  };

  const deleteCholesterolRecord = (id: string) => {
    setCholesterolRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const addWater = (amountMl: number) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setWaterRecords((prev) => {
      const existing = prev.find((w) => w.date === today);
      if (existing) {
        return prev.map((w) =>
          w.date === today
            ? {
                ...w,
                totalMl: w.totalMl + amountMl,
                entries: [...w.entries, { id: `entry_${Date.now()}`, time: nowTime, amountMl }],
              }
            : w
        );
      } else {
        return [
          {
            date: today,
            totalMl: amountMl,
            goalMl: userProfile.targetWaterMl,
            entries: [{ id: `entry_${Date.now()}`, time: nowTime, amountMl }],
          },
          ...prev,
        ];
      }
    });
  };

  const addSteps = (steps: number) => {
    const today = new Date().toISOString().split('T')[0];
    setStepRecords((prev) => {
      const existing = prev.find((s) => s.date === today);
      if (existing) {
        const newTotal = existing.steps + steps;
        return prev.map((s) =>
          s.date === today
            ? {
                ...s,
                steps: newTotal,
                distanceKm: Number((newTotal * 0.00078).toFixed(2)),
                caloriesKcal: Math.round(newTotal * 0.042),
                activeMinutes: Math.round(newTotal / 105),
              }
            : s
        );
      } else {
        return [
          {
            date: today,
            steps,
            goalSteps: userProfile.targetSteps,
            distanceKm: Number((steps * 0.00078).toFixed(2)),
            caloriesKcal: Math.round(steps * 0.042),
            activeMinutes: Math.round(steps / 105),
          },
          ...prev,
        ];
      }
    });
  };

  const toggleChallengeDay = (challengeId: string, dateStr: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id !== challengeId) return ch;
        const exists = ch.completedDates.includes(dateStr);
        const newDates = exists
          ? ch.completedDates.filter((d) => d !== dateStr)
          : [...ch.completedDates, dateStr];
        return {
          ...ch,
          completedDates: newDates,
          currentStreak: newDates.length,
        };
      })
    );
  };

  const toggleChallengeActive = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => (ch.id === challengeId ? { ...ch, active: !ch.active } : ch))
    );
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const addReminder = (reminder: Omit<ReminderItem, 'id'>) => {
    const newRem: ReminderItem = {
      ...reminder,
      id: `rem_${Date.now()}`,
    };
    setReminders((prev) => [...prev, newRem]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleBookmarkArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a))
    );
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const resetToDefaultData = async () => {
    const seed = generateSeedData();
    setBpRecords(seed.bpRecords);
    setHrRecords(seed.hrRecords);
    setBsRecords(seed.bsRecords);
    setWeightRecords(seed.weightRecords);
    setCholesterolRecords(seed.cholesterolRecords);
    setWaterRecords(seed.waterRecords);
    setStepRecords(seed.stepRecords);
    setChallenges(PREDEFINED_CHALLENGES);
    setReminders(PREDEFINED_REMINDERS);
    setArticles(INSIGHT_ARTICLES);
    setUserProfile(DEFAULT_USER_PROFILE);
    await UniversalStorage.removeItem(STORAGE_KEY);
  };

  const exportBackupJson = async (): Promise<string> => {
    const data = {
      bpRecords,
      hrRecords,
      bsRecords,
      weightRecords,
      cholesterolRecords,
      waterRecords,
      stepRecords,
      challenges,
      reminders,
      articles,
      userProfile,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackupJson = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.bpRecords) setBpRecords(parsed.bpRecords);
      if (parsed.hrRecords) setHrRecords(parsed.hrRecords);
      if (parsed.bsRecords) setBsRecords(parsed.bsRecords);
      if (parsed.weightRecords) setWeightRecords(parsed.weightRecords);
      if (parsed.cholesterolRecords) setCholesterolRecords(parsed.cholesterolRecords);
      if (parsed.waterRecords) setWaterRecords(parsed.waterRecords);
      if (parsed.stepRecords) setStepRecords(parsed.stepRecords);
      if (parsed.challenges) setChallenges(parsed.challenges);
      if (parsed.reminders) setReminders(parsed.reminders);
      if (parsed.articles) setArticles(parsed.articles);
      if (parsed.userProfile) setUserProfile(parsed.userProfile);
      return true;
    } catch (e) {
      console.error('Invalid backup JSON:', e);
      return false;
    }
  };

  return (
    <HealthContext.Provider
      value={{
        bpRecords,
        hrRecords,
        bsRecords,
        weightRecords,
        cholesterolRecords,
        waterRecords,
        stepRecords,
        challenges,
        reminders,
        articles,
        userProfile,
        addBPRecord,
        deleteBPRecord,
        addHRRecord,
        deleteHRRecord,
        addBSRecord,
        deleteBSRecord,
        addWeightRecord,
        deleteWeightRecord,
        addCholesterolRecord,
        deleteCholesterolRecord,
        addWater,
        addSteps,
        toggleChallengeDay,
        toggleChallengeActive,
        toggleReminder,
        addReminder,
        deleteReminder,
        toggleBookmarkArticle,
        updateProfile,
        resetToDefaultData,
        exportBackupJson,
        importBackupJson,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
