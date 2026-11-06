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
  FoodItem,
  UserProfile,
} from '../types';
import { classifyBloodPressure } from './healthCalculations';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  age: 42,
  gender: 'male',
  heightCm: 178,
  targetWeightKg: 74,
  targetSteps: 8000,
  targetWaterMl: 2200,
  targetSystolic: 120,
  targetDiastolic: 80,
  units: {
    pressure: 'mmHg',
    glucose: 'mg/dL',
    weight: 'kg',
    height: 'cm',
    water: 'ml',
  },
};

export const PREDEFINED_CHALLENGES: HealthChallenge[] = [
  {
    id: 'ch_sleep',
    iconName: 'moon',
    title: '7-8h Restorative Sleep',
    description: 'Consistent sleep stabilizes nocturnal blood pressure dipping and reduces arterial stiffness.',
    category: 'habit',
    durationDays: 14,
    currentStreak: 6,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_water',
    iconName: 'water',
    title: 'Daily 2L Hydration',
    description: 'Adequate hydration prevents hyperviscosity and supports optimal kidney filtration.',
    category: 'habit',
    durationDays: 21,
    currentStreak: 8,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_walk',
    iconName: 'walk',
    title: 'Daily 30-Min Walk',
    description: 'Brisk walking triggers nitric oxide release, relaxing arterial walls and lowering systolic BP.',
    category: 'activity',
    durationDays: 30,
    currentStreak: 12,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_veg',
    iconName: 'nutrition',
    title: 'Eat Fresh Greens & Veggies',
    description: 'Pack your meals with dietary potassium, magnesium, and nitrates to counterbalance sodium.',
    category: 'diet',
    durationDays: 14,
    currentStreak: 5,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_cardio',
    iconName: 'flame',
    title: '20-Min Aerobic Cardio',
    description: 'Moderate cardio strengthens cardiac muscle, reducing the effort needed to pump blood.',
    category: 'activity',
    durationDays: 21,
    currentStreak: 4,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_smoke',
    iconName: 'ban',
    title: 'Smoke-Free Days',
    description: 'Smoking immediately spikes blood pressure and damages arterial endothelial lining.',
    category: 'habit',
    durationDays: 30,
    currentStreak: 30,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_alcohol',
    iconName: 'wine',
    title: 'Zero / Minimal Alcohol',
    description: 'Cutting alcohol intake reduces renin-angiotensin activation and lowers high blood pressure.',
    category: 'diet',
    durationDays: 14,
    currentStreak: 9,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_sugar',
    iconName: 'ice-cream',
    title: 'Cut Added Sugars',
    description: 'Excess fructose impairs endothelial relaxation and drives visceral abdominal fat.',
    category: 'diet',
    durationDays: 21,
    currentStreak: 7,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_caffeine',
    iconName: 'cafe',
    title: 'Limit Afternoon Caffeine',
    description: 'Avoid caffeine after 2 PM to preserve deep sleep architecture and nocturnal BP dipping.',
    category: 'habit',
    durationDays: 14,
    currentStreak: 11,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_meditation',
    iconName: 'heart',
    title: '10-Min Mindfulness Meditation',
    description: 'Stimulates the vagus nerve, calming sympathetic nervous tone and rapid heart rate.',
    category: 'mind',
    durationDays: 21,
    currentStreak: 14,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_smile',
    iconName: 'happy',
    title: 'Daily Laughter & Positive Mood',
    description: 'Laughter reduces serum cortisol and prompts beneficial cardiovascular vasodilation.',
    category: 'mind',
    durationDays: 30,
    currentStreak: 18,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_fried',
    iconName: 'warning',
    title: 'Avoid Fried & Trans-Fats',
    description: 'Keeps LDL particle count low and protects blood vessel elasticity from inflammation.',
    category: 'diet',
    durationDays: 14,
    currentStreak: 10,
    completedDates: [],
    active: true,
  },
  {
    id: 'ch_vitamins',
    iconName: 'medkit',
    title: 'Daily Minerals (Mg & K)',
    description: 'Magnesium and potassium work synergistically to regulate vascular tone and heart rhythm.',
    category: 'diet',
    durationDays: 30,
    currentStreak: 22,
    completedDates: [],
    active: true,
  },
];

export const PREDEFINED_REMINDERS: ReminderItem[] = [
  {
    id: 'rem_morning_bp',
    type: 'bp',
    title: 'Morning Blood Pressure Check',
    time: '07:30',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    notes: 'Measure after waking up and emptying bladder, before breakfast or caffeine.',
  },
  {
    id: 'rem_evening_bp',
    type: 'bp',
    title: 'Evening Blood Pressure Check',
    time: '19:30',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    notes: 'Sit quietly for 5 minutes before taking the measurement.',
  },
  {
    id: 'rem_water_1',
    type: 'water',
    title: 'Hydration Check - Drink a Glass',
    time: '11:00',
    daysOfWeek: [1, 2, 3, 4, 5],
    enabled: true,
    notes: 'Drink 250ml water to keep circulation smooth.',
  },
  {
    id: 'rem_medication',
    type: 'medication',
    title: 'Daily Cardioprotective Supplement',
    time: '08:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    enabled: true,
    notes: 'CoQ10 + Magnesium Glycinate with breakfast.',
  },
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: 'art_bp_101',
    title: 'Blood Pressure 101: Understanding Systolic vs. Diastolic',
    category: 'blood_pressure',
    readTimeMin: 4,
    author: 'CardioVitals Clinical Team',
    reviewedBy: 'Dr. Sarah Lin, MD, FACC',
    summary: 'The difference between the two numbers, what happens inside your arteries during every heartbeat, and why pulse pressure matters.',
    content: [
      'Every time your heart beats, it pumps oxygen-rich blood through a network of muscular arteries. The pressure exerted on arterial walls peaks during the contraction phase — this is your Systolic pressure (the top number).',
      'Between beats, while the heart muscle rests and refills with blood, pressure falls to its minimum level — your Diastolic pressure (the bottom number).',
      'Both numbers matter significantly. Systolic hypertension is especially common as arteries stiffen with age, while elevated diastolic pressure reflects continuous vascular resistance. The difference between the two is known as Pulse Pressure; a widened pulse pressure (>60 mmHg) indicates stiffened central arteries.',
      'To obtain an accurate measurement, always sit upright with back supported, feet flat on the floor, and arm supported at heart level. Avoid caffeine, nicotine, and exercise for 30 minutes prior to measuring.',
    ],
    keyTakeaways: [
      'Systolic = peak pressure during heart contraction (target <120 mmHg).',
      'Diastolic = baseline pressure while heart is resting between beats (target <80 mmHg).',
      'Always rest quietly for 5 minutes prior to testing for accurate readings.',
    ],
    tags: ['Basics', 'Systolic', 'Diastolic', 'Measurement Tips'],
  },
  {
    id: 'art_dash_diet',
    title: 'The DASH Diet: Evidence-Based Nutrition for Lower Blood Pressure',
    category: 'diet',
    readTimeMin: 5,
    author: 'Elena Gomez, Clinical Dietitian',
    reviewedBy: 'Dr. Marcus Vance, Cardiologist',
    summary: 'How Dietary Approaches to Stop Hypertension can lower systolic blood pressure by up to 11 mmHg within 2 to 4 weeks.',
    content: [
      'The DASH (Dietary Approaches to Stop Hypertension) diet remains one of the most thoroughly validated dietary regimens in cardiovascular medicine. In clinical trials, it produced blood pressure reductions comparable to first-line antihypertensive medications.',
      'The core philosophy focuses on nutrient density rather than severe calorie restriction. It emphasizes vegetables, fruits, whole grains, fat-free or low-fat dairy products, fish, poultry, beans, nuts, and vegetable oils.',
      'Key minerals in DASH include Potassium, Calcium, and Magnesium. Potassium encourages kidneys to excrete sodium via urine and relaxes vascular smooth muscle. Sodium intake should ideally be kept below 2,300 mg per day, with optimal goals near 1,500 mg for people with hypertension.',
    ],
    keyTakeaways: [
      'DASH can lower blood pressure within 14 days of adoption.',
      'Prioritize potassium-rich foods (bananas, spinach, sweet potatoes, avocado).',
      'Keep sodium intake under 2,000 mg daily by limiting processed and canned foods.',
    ],
    tags: ['DASH Diet', 'Nutrition', 'Sodium', 'Potassium'],
  },
  {
    id: 'art_resting_pulse',
    title: 'Resting Heart Rate & Longevity: What Your Pulse Reveals',
    category: 'heart',
    readTimeMin: 4,
    author: 'CardioVitals Health Lab',
    reviewedBy: 'Dr. Robert Chen, Electrophysiologist',
    summary: 'A normal resting heart rate spans 60 to 100 beats per minute, but optimal cardiovascular fitness frequently rests in the 50s and 60s.',
    content: [
      'Your resting heart rate (RHR) is the number of times your heart pumps per minute while at complete physical rest. It serves as a direct barometer of cardiac efficiency and autonomic nervous balance.',
      'A lower resting heart rate usually signals more efficient cardiac function and higher cardiovascular fitness. For example, an endurance athlete might have an RHR of 45-55 BPM because each beat ejects a larger stroke volume.',
      'Conversely, an elevated resting heart rate (>85 BPM) over time correlates with higher risks of cardiovascular events, sympathetic overdrive, chronic stress, or systemic inflammation.',
    ],
    keyTakeaways: [
      'Optimal resting heart rate is between 55 and 75 BPM.',
      'Measure immediately upon waking before getting out of bed.',
      'Cardio exercise and deep breathing consistently lower resting pulse over time.',
    ],
    tags: ['Pulse', 'Heart Rate', 'Fitness', 'PPG'],
  },
  {
    id: 'art_cholesterol_lipid',
    title: 'Demystifying Cholesterol: HDL, LDL, and Triglycerides',
    category: 'cholesterol',
    readTimeMin: 5,
    author: 'Dr. Sarah Lin, MD, FACC',
    reviewedBy: 'Dr. Marcus Vance, Cardiologist',
    summary: 'Why "good" vs "bad" cholesterol is only half the story, and how Non-HDL and Triglyceride ratios predict arterial plaque.',
    content: [
      'Cholesterol is a waxy lipid essential for cell membranes, steroid hormone synthesis, and vitamin D creation. Because lipids cannot dissolve in blood, they travel in lipoprotein packages.',
      'Low-Density Lipoprotein (LDL) transports cholesterol from the liver to tissues. When oxidized or present in excess, LDL penetrates the endothelium, driving atherosclerosis (plaque buildup).',
      'High-Density Lipoprotein (HDL) acts as a scavenger, collecting excess cholesterol and escorting it back to the liver for excretion (reverse cholesterol transport).',
      'Triglycerides are the most common type of fat in your body, storing unused calories. High triglycerides combined with high LDL and low HDL accelerates arterial stiffening.',
    ],
    keyTakeaways: [
      'Aim for LDL < 100 mg/dL and HDL > 40 mg/dL (men) or > 50 mg/dL (women).',
      'Non-HDL cholesterol (Total minus HDL) reflects all atherogenic particles.',
      'Aerobic exercise and soluble fiber are the best natural tools to raise HDL and drop LDL.',
    ],
    tags: ['Lipids', 'Cholesterol', 'LDL', 'HDL', 'Triglycerides'],
  },
  {
    id: 'art_glucose_vascular',
    title: 'Blood Sugar & Arterial Health: Why Glucose Spikes Stiffen Vessels',
    category: 'sugar',
    readTimeMin: 4,
    author: 'Elena Gomez, Clinical Dietitian',
    reviewedBy: 'Dr. Sarah Lin, MD',
    summary: 'How repeated post-meal glucose spikes trigger advanced glycation end-products (AGEs) and vascular endothelial damage.',
    content: [
      'Hypertension and blood sugar dysregulation frequently travel together in what clinicians call Metabolic Syndrome. High circulating glucose levels injure the delicate layer of cells lining your blood vessels (the endothelium).',
      'When blood sugar spikes repeatedly after refined carbohydrate meals, glucose binds to proteins in artery walls, creating Advanced Glycation End-products (AGEs). This cross-links collagen, making arteries less flexible and requiring higher systolic pressure to push blood through.',
      'Fasting glucose should remain below 100 mg/dL (5.6 mmol/L). Post-meal levels 2 hours after eating should stay below 140 mg/dL (7.8 mmol/L). Simple habits like taking a 10-minute walk after eating dramatically blunt glucose spikes.',
    ],
    keyTakeaways: [
      'Healthy blood sugar protects blood vessels from premature stiffening.',
      'A 10-minute post-meal stroll can reduce glucose spikes by up to 30%.',
      'Track both fasting and 2-hour postprandial readings for a comprehensive picture.',
    ],
    tags: ['Glucose', 'Metabolic Health', 'Artery Elasticity'],
  },
];

export const SAMPLE_FOOD_DATABASE: FoodItem[] = [
  {
    id: 'food_oats',
    barcode: '0030000010204',
    name: '100% Whole Grain Rolled Oats',
    brand: 'Quaker',
    caloriesPer100g: 379,
    sodiumMg: 5,
    carbsG: 67,
    sugarG: 1,
    fatG: 6.5,
    proteinG: 13,
    nutriScore: 'A',
    hypertensionFriendly: true,
  },
  {
    id: 'food_soup',
    barcode: '0051000012517',
    name: 'Classic Chicken Noodle Soup',
    brand: "Campbell's",
    caloriesPer100g: 65,
    sodiumMg: 890,
    carbsG: 8,
    sugarG: 1,
    fatG: 2,
    proteinG: 3.5,
    nutriScore: 'D',
    hypertensionFriendly: false,
  },
  {
    id: 'food_almonds',
    barcode: '0041570054368',
    name: 'Raw Unsalted California Almonds',
    brand: 'Blue Diamond',
    caloriesPer100g: 579,
    sodiumMg: 2,
    carbsG: 21,
    sugarG: 4.4,
    fatG: 49.9,
    proteinG: 21.2,
    nutriScore: 'A',
    hypertensionFriendly: true,
  },
  {
    id: 'food_chips',
    barcode: '0028400064286',
    name: 'Classic Potato Chips',
    brand: "Lay's",
    caloriesPer100g: 536,
    sodiumMg: 570,
    carbsG: 53,
    sugarG: 0.5,
    fatG: 34,
    proteinG: 6.5,
    nutriScore: 'D',
    hypertensionFriendly: false,
  },
  {
    id: 'food_yogurt',
    barcode: '0053600000088',
    name: 'Nonfat Plain Greek Yogurt',
    brand: 'FAGE Total 0%',
    caloriesPer100g: 54,
    sodiumMg: 35,
    carbsG: 3,
    sugarG: 3,
    fatG: 0,
    proteinG: 10.3,
    nutriScore: 'A',
    hypertensionFriendly: true,
  },
  {
    id: 'food_soda',
    barcode: '0049000006346',
    name: 'Original Classic Cola',
    brand: 'Coca-Cola',
    caloriesPer100g: 42,
    sodiumMg: 12,
    carbsG: 10.6,
    sugarG: 10.6,
    fatG: 0,
    proteinG: 0,
    nutriScore: 'E',
    hypertensionFriendly: false,
  },
];

export function generateSeedData(): {
  bpRecords: BloodPressureRecord[];
  hrRecords: HeartRateRecord[];
  bsRecords: BloodSugarRecord[];
  weightRecords: WeightRecord[];
  cholesterolRecords: CholesterolRecord[];
  waterRecords: WaterDayRecord[];
  stepRecords: StepDayRecord[];
} {
  const now = new Date();
  const bpRecords: BloodPressureRecord[] = [];
  const hrRecords: HeartRateRecord[] = [];
  const bsRecords: BloodSugarRecord[] = [];
  const weightRecords: WeightRecord[] = [];
  const cholesterolRecords: CholesterolRecord[] = [];
  const waterRecords: WaterDayRecord[] = [];
  const stepRecords: StepDayRecord[] = [];

  const bpValues = [
    { sys: 118, dia: 76, pulse: 68, arm: 'left', pos: 'sitting', tags: ['Morning', 'Resting'] },
    { sys: 124, dia: 78, pulse: 72, arm: 'left', pos: 'sitting', tags: ['Evening', 'After Work'] },
    { sys: 116, dia: 74, pulse: 65, arm: 'right', pos: 'sitting', tags: ['Morning', 'Fasting'] },
    { sys: 132, dia: 84, pulse: 82, arm: 'left', pos: 'sitting', tags: ['After Coffee', 'Stressful Day'] },
    { sys: 128, dia: 80, pulse: 75, arm: 'left', pos: 'standing', tags: ['Afternoon'] },
    { sys: 119, dia: 77, pulse: 66, arm: 'left', pos: 'sitting', tags: ['Morning', 'Well Rested'] },
    { sys: 122, dia: 79, pulse: 70, arm: 'left', pos: 'sitting', tags: ['Evening'] },
    { sys: 135, dia: 86, pulse: 78, arm: 'right', pos: 'sitting', tags: ['Post-Workout', 'Tired'] },
    { sys: 115, dia: 73, pulse: 64, arm: 'left', pos: 'lying', tags: ['Before Sleep'] },
    { sys: 121, dia: 78, pulse: 69, arm: 'left', pos: 'sitting', tags: ['Morning'] },
    { sys: 126, dia: 81, pulse: 73, arm: 'left', pos: 'sitting', tags: ['Evening'] },
    { sys: 117, dia: 75, pulse: 67, arm: 'right', pos: 'sitting', tags: ['Morning'] },
    { sys: 138, dia: 88, pulse: 84, arm: 'left', pos: 'sitting', tags: ['High Salt Meal', 'Busy'] },
    { sys: 123, dia: 79, pulse: 71, arm: 'left', pos: 'sitting', tags: ['Evening', 'Relaxed'] },
    { sys: 114, dia: 72, pulse: 63, arm: 'left', pos: 'sitting', tags: ['Morning'] },
    { sys: 120, dia: 76, pulse: 68, arm: 'left', pos: 'sitting', tags: ['After Walk'] },
    { sys: 127, dia: 82, pulse: 74, arm: 'right', pos: 'sitting', tags: ['Afternoon'] },
    { sys: 118, dia: 75, pulse: 66, arm: 'left', pos: 'sitting', tags: ['Morning'] },
    { sys: 125, dia: 80, pulse: 72, arm: 'left', pos: 'sitting', tags: ['Evening'] },
    { sys: 119, dia: 76, pulse: 65, arm: 'left', pos: 'sitting', tags: ['Morning'] },
    { sys: 122, dia: 78, pulse: 70, arm: 'right', pos: 'sitting', tags: ['Evening'] },
    { sys: 116, dia: 74, pulse: 64, arm: 'left', pos: 'sitting', tags: ['Morning'] },
    { sys: 124, dia: 79, pulse: 71, arm: 'left', pos: 'sitting', tags: ['Evening'] },
    { sys: 118, dia: 75, pulse: 66, arm: 'left', pos: 'sitting', tags: ['Morning'] },
    { sys: 120, dia: 77, pulse: 68, arm: 'left', pos: 'sitting', tags: ['Latest Check', 'Resting'] },
  ];

  bpValues.forEach((val, idx) => {
    const daysAgo = 25 - idx;
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    date.setHours(idx % 2 === 0 ? 8 : 19, Math.floor(Math.random() * 40) + 10, 0, 0);

    const classification = classifyBloodPressure(val.sys, val.dia);
    bpRecords.push({
      id: `bp_${idx + 1}`,
      timestamp: date.toISOString(),
      systolic: val.sys,
      diastolic: val.dia,
      pulse: val.pulse,
      arm: val.arm as 'left' | 'right',
      position: val.pos as 'sitting' | 'lying' | 'standing',
      stage: classification.stage,
      tags: val.tags,
      notes: idx === 3 ? 'Had a double espresso before measurement' : undefined,
    });
  });

  const hrBpm = [65, 72, 64, 82, 68, 75, 63, 71, 66, 69, 78, 64, 85, 70, 62, 67, 73, 65, 71, 64, 68];
  hrBpm.forEach((bpm, idx) => {
    const daysAgo = 20 - idx;
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    hrRecords.push({
      id: `hr_${idx + 1}`,
      timestamp: date.toISOString(),
      bpm,
      context: idx % 3 === 0 ? 'morning' : idx % 3 === 1 ? 'resting' : 'walking',
      method: idx % 2 === 0 ? 'camera_ppg' : 'sensor',
      notes: idx % 2 === 0 ? 'Measured via Camera PPG Pulse meter' : undefined,
    });
  });

  const bsList = [
    { val: 92, timing: 'fasting' as const },
    { val: 128, timing: 'after_meal_2h' as const },
    { val: 95, timing: 'fasting' as const },
    { val: 135, timing: 'after_meal_2h' as const },
    { val: 89, timing: 'fasting' as const },
    { val: 110, timing: 'before_meal' as const },
    { val: 94, timing: 'fasting' as const },
    { val: 142, timing: 'after_meal_2h' as const },
    { val: 91, timing: 'fasting' as const },
    { val: 124, timing: 'after_meal_2h' as const },
  ];
  bsList.forEach((bs, idx) => {
    const daysAgo = 10 - idx;
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    bsRecords.push({
      id: `bs_${idx + 1}`,
      timestamp: date.toISOString(),
      value: bs.val,
      unit: 'mg/dL',
      timing: bs.timing,
      stage: bs.val < 100 ? 'normal' : bs.val <= 125 ? 'prediabetes' : 'diabetes',
      tags: [bs.timing === 'fasting' ? 'Morning Fast' : 'After Dinner'],
    });
  });

  weightRecords.push(
    { id: 'w_1', timestamp: new Date(now.getTime() - 28 * 86400000).toISOString(), weightKg: 76.5, heightCm: 178, bmi: 24.1, category: 'normal' },
    { id: 'w_2', timestamp: new Date(now.getTime() - 21 * 86400000).toISOString(), weightKg: 75.8, heightCm: 178, bmi: 23.9, category: 'normal' },
    { id: 'w_3', timestamp: new Date(now.getTime() - 14 * 86400000).toISOString(), weightKg: 75.2, heightCm: 178, bmi: 23.7, category: 'normal' },
    { id: 'w_4', timestamp: new Date(now.getTime() - 7 * 86400000).toISOString(), weightKg: 74.6, heightCm: 178, bmi: 23.5, category: 'normal' },
    { id: 'w_5', timestamp: new Date().toISOString(), weightKg: 74.2, heightCm: 178, bmi: 23.4, category: 'normal', notes: 'Reached target goal!' }
  );

  cholesterolRecords.push(
    {
      id: 'chol_1',
      timestamp: new Date(now.getTime() - 90 * 86400000).toISOString(),
      tc: 215,
      hdl: 42,
      ldl: 138,
      tg: 175,
      nonHdl: 173,
      unit: 'mg/dL',
      assessment: 'borderline',
      notes: 'Initial checkup. Recommended DASH diet and omega-3.',
    },
    {
      id: 'chol_2',
      timestamp: new Date(now.getTime() - 15 * 86400000).toISOString(),
      tc: 188,
      hdl: 48,
      ldl: 112,
      tg: 140,
      nonHdl: 140,
      unit: 'mg/dL',
      assessment: 'desirable',
      notes: 'Follow-up after 10 weeks of exercise and low saturated fats.',
    }
  );

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const amounts = [300, 250, 400, 350, 500, 300];
    const total = i === 0 ? 1750 : 2100 + (i % 2 === 0 ? 150 : -200);
    waterRecords.push({
      date: dateStr,
      totalMl: total,
      goalMl: 2200,
      entries: amounts.map((amt, idx) => ({ id: `w_${i}_${idx}`, time: `${8 + idx * 2}:00`, amountMl: amt })),
    });
  }

  const stepCounts = [8420, 9150, 7890, 10240, 6800, 8950, 8310];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const steps = stepCounts[6 - i];
    const distanceKm = Number((steps * 0.00078).toFixed(2));
    const caloriesKcal = Math.round(steps * 0.042);
    stepRecords.push({
      date: dateStr,
      steps,
      goalSteps: 8000,
      distanceKm,
      caloriesKcal,
      activeMinutes: Math.round(steps / 105),
    });
  }

  return {
    bpRecords,
    hrRecords,
    bsRecords,
    weightRecords,
    cholesterolRecords,
    waterRecords,
    stepRecords,
  };
}
