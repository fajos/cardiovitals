# CardioVitals Pro 🩺
### Cross-Platform Cardiometabolic & Hemodynamic Health Suite
*Built with Expo SDK 58 (React Native 0.88.1) + TypeScript*

---

## 📖 Overview & Provenance

**CardioVitals Pro** is a comprehensive, medical-grade cross-platform mobile application engineered from deep clinical reverse engineering and architectural analysis of **Blood Pressure App Pro (v1.3.2)** (`bloodpressure.bloodpressureapppro.bloodpressureapp`).

Every clinical algorithm, classification threshold, data schema, and workflow found in the original APK has been faithfully reconstructed and enhanced into a modern, offline-first mobile application compatible with iOS, Android, and Web.

---

## 🔬 Reverse-Engineered Clinical Evidence

Analysis of DEX string pools, GreenDAO tables, Room database definitions (`CholesterolDb_Impl`, `ChallengeDb_Impl`), and decompiled JSON assets revealed the following clinical architectures:

### 1. Blood Pressure Clinical Stages (AHA / ACC 2017 & WHO Standards)
| Stage ID | Classification | Systolic (mmHg) | Diastolic (mmHg) | Visual Color Code |
| :--- | :--- | :--- | :--- | :--- |
| `hypotension` | Hypotension | `< 90` | or `< 60` | Blue (`#3b82f6`) |
| `normal` | Normal BP | `90 - 119` | and `60 - 79` | Green (`#10b981`) |
| `elevated` | Elevated | `120 - 129` | and `60 - 79` | Amber (`#f59e0b`) |
| `stage1` | Hypertension Stage 1 | `130 - 139` | or `80 - 89` | Orange (`#f97316`) |
| `stage2` | Hypertension Stage 2 | `140 - 180` | or `90 - 120` | Red (`#ef4444`) |
| `crisis` | Hypertensive Crisis | `> 180` | or `> 120` | Purple (`#881337`) |

### 2. Resting Heart Rate Clinical Matrix (`assets/resting_config.json`)
Resting pulse standards are parameterized across demographic age ranges (18-25, 26-35, 36-45, 46-55, 56-65, 65+):
- **Athlete**: 49–55 BPM
- **Excellent**: 56–61 BPM
- **Good / Normal**: 62–73 BPM
- **Above Normal**: 74–81 BPM
- **Elevated / Tachycardia**: > 82 BPM

### 3. Lipid Panel Reference Standards (`CholesterolDb`)
- **Total Cholesterol (TC)**: Desirable (<200 mg/dL), Borderline (200-239), High (≥240)
- **HDL (High-Density)**: Optimal (≥60 mg/dL), Low/Risk (<40 mg/dL)
- **LDL (Low-Density)**: Optimal (<100 mg/dL), High (160-189), Very High (≥190)
- **Triglycerides (TG)**: Normal (<150 mg/dL), High (200-499), Very High (≥500)
- **Non-HDL**: Evaluated automatically as `TC - HDL`

### 4. 13 Daily Health Habit Challenges
Extracted directly from decompiled challenge drawables (`icon_challenge_sleep_1` through `icon_challenge_take_vitamins_13`):
1. **Sleep 8 Hours**: Circadian rhythm regulation for nocturnal blood pressure dipping.
2. **Drink 2000ml Water**: Adequate intravascular volume & renal sodium clearance.
3. **10,000 Daily Steps**: Aerobic physical conditioning for arterial compliance.
4. **Eat Vegetables & Fruits**: Dietary potassium & magnesium for DASH eating plan.
5. **30-Min Cardio Workout**: Myocardial strengthening and peripheral vasodilation.
6. **Limit Sodium Intake**: Salt restriction (<2,300 mg/day) to reduce fluid retention.
7. **No Alcohol Today**: Prevents alcohol-induced acute hypertensive spikes.
8. **Low Sugar Day**: Prevents insulin resistance and vascular endothelial stiffness.
9. **No Coffee After 2 PM**: Minimizes caffeine-induced arterial vasoconstriction.
10. **10-Min Meditation**: Parasympathetic nervous system activation & stress reduction.
11. **Measure BP Morning & Evening**: Clinical home blood pressure monitoring protocol.
12. **Weight Measurement**: Daily weight tracking to detect fluid retention.
13. **Take Daily Prescriptions**: Medication adherence for antihypertensive therapy.

---

## ✨ Features & Capabilities

- 📊 **Dynamic Dashboard**: Real-time display of latest BP, pulse, glycemic readings, BMI, daily hydration progress, and step counts.
- 📈 **Native Vector SVG Trendline Charts**: 7-day, 30-day, 90-day, and all-time interactive charts with target band shading and detailed min/max/avg hemodynamic analytics.
- 🏆 **13 Healthy Habit Challenges**: Daily streak counter, category filtering (habit, diet, activity, mind), and one-tap check-in buttons.
- 💓 **Optical PPG Heart Rate Monitor**: Simulated camera PPG pulse meter featuring live dicrotic arterial pulse waveform rendering, 12-second measurement countdown, and resting pulse classification.
- 🥗 **Food & Nutrition Barcode Scanner**: Barcode lookup tool evaluating sodium (mg), sugar, carbs, calories, and cardiac suitability (DASH & hypertension-friendly assessment).
- 📋 **Doctor Clinical Report Generator**: Doctor-ready hemodynamic report displaying patient demographics, MAP (Mean Arterial Pressure), Pulse Pressure, 6-stage distribution, and physical signature section with native sharing via `expo-sharing`.
- 💾 **100% Offline-First Privacy**: Stored securely on-device using `@react-native-async-storage/async-storage` with full JSON backup export & restore capabilities.
- 🔔 **Intelligent Reminders**: Configurable measurement schedules, pill reminders, and hydration alarms with day-of-week recurrence.
- 📚 **Clinical Knowledge Base**: Evidence-based medical library covering DASH dietary patterns, white-coat hypertension, glycemic thresholds, and lifestyle interventions.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [Expo Go](https://expo.dev/go) app installed on your physical iOS or Android phone (or an emulator/simulator)

### Installation
```bash
# Navigate to project directory
cd "C:\Users\saintsbuilder\Documents\Projects\blood-pressure"

# Install dependencies (if not already installed)
npm install
```

### Running the App
```bash
# Start Expo development server
npm start
```

Once the terminal displays the QR code:
- **Android**: Open the **Expo Go** app and scan the QR code.
- **iOS**: Open the native **Camera** app, scan the QR code, and tap to open in **Expo Go**.
- **Web**: Press `w` in the terminal to open the application in your default browser.
- **Android Emulator**: Press `a` in the terminal.
- **iOS Simulator**: Press `i` in the terminal (macOS only).

---

## 📂 Project Architecture

```
blood-pressure/
├── App.tsx                     # Main application entry & tab navigation
├── app.json                    # Expo configuration (CardioVitals Pro, bundleId, splash)
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration extending expo/tsconfig.base
└── src/
    ├── types/
    │   └── index.ts            # Type definitions for all cardiometabolic records
    ├── utils/
    │   ├── healthCalculations.ts # AHA/WHO classification, BMI, MAP, CSV generator
    │   └── seedData.ts         # 30-day clinical vitals history, challenges, articles
    ├── context/
    │   └── HealthContext.tsx   # Offline-first AsyncStorage reactive state manager
    └── components/
        ├── Header.tsx          # Top bar with PRO badge and quick modal triggers
        ├── BottomTabBar.tsx    # 7-tab floating navigation bar
        ├── VitalsHeroCard.tsx  # Hero card with live vitals and mini-cards
        ├── TrendChart.tsx      # Native SVG blood pressure trend chart
        ├── AnalysisCard.tsx    # 6-stage distribution bar & cardiovascular grade
        ├── HistoryList.tsx     # Filterable record list with native CSV export
        ├── AddVitalModal.tsx   # Comprehensive modal to log BP, HR, Sugar, Weight, etc.
        ├── PPGHeartRateModal.tsx # Optical PPG camera pulse meter with live ECG wave
        ├── FoodScannerModal.tsx # Sodium & Nutri-Score barcode scanner
        ├── MedicalReportModal.tsx # Physician clinical summary & sharing
        ├── ChallengesView.tsx  # 13 habit challenges with streak tracking
        ├── InsightsView.tsx    # Clinical articles with reader modal
        ├── RemindersView.tsx   # Scheduled alarms for BP, pills, and water
        └── SettingsView.tsx    # User profile, targets, and data backup
```

---

## ⚖️ Clinical & Legal Notice
*CardioVitals Pro is intended exclusively for personal health tracking, clinical journal keeping, and informational purposes. It is NOT a certified medical diagnostic device and does not replace medical consultation, diagnosis, or treatment by a qualified physician. Always consult your healthcare provider before modifying antihypertensive medication regimens.*
