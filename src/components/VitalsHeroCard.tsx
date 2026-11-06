import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../context/HealthContext';
import { BP_STAGES, classifyHeartRate } from '../utils/healthCalculations';

interface VitalsHeroCardProps {
  onOpenAddModal: (tab: 'bp' | 'hr' | 'sugar' | 'weight' | 'water') => void;
  onOpenPPG: () => void;
}

export const VitalsHeroCard: React.FC<VitalsHeroCardProps> = ({
  onOpenAddModal,
  onOpenPPG,
}) => {
  const {
    bpRecords,
    hrRecords,
    bsRecords,
    weightRecords,
    waterRecords,
    stepRecords,
    userProfile,
    addWater,
  } = useHealth();

  const latestBP = bpRecords[0];
  const latestHR = hrRecords[0];
  const latestBS = bsRecords[0];
  const latestWeight = weightRecords[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayWater = waterRecords.find((w) => w.date === todayStr) || {
    totalMl: 0,
    goalMl: userProfile.targetWaterMl,
  };
  const waterPct = Math.min(100, Math.round((todayWater.totalMl / (todayWater.goalMl || 2000)) * 100));

  const todaySteps = stepRecords.find((s) => s.date === todayStr) || {
    steps: 0,
    goalSteps: userProfile.targetSteps,
    distanceKm: 0,
    caloriesKcal: 0,
  };
  const stepPct = Math.min(100, Math.round((todaySteps.steps / (todaySteps.goalSteps || 8000)) * 100));
  const hrStatus = latestHR ? classifyHeartRate(latestHR.bpm, userProfile.age, latestHR.context) : null;

  return (
    <View style={styles.container}>
      {/* Hero Blood Pressure Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroHeaderLeft}>
            <View style={styles.heroIconBox}>
              <Ionicons name="pulse" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.heroLabel}>LATEST BLOOD PRESSURE</Text>
              <Text style={styles.heroTime}>
                {latestBP
                  ? new Date(latestBP.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'No readings yet'}
              </Text>
            </View>
          </View>

          {latestBP && (
            <View style={styles.heroStageBadge}>
              <Text style={styles.heroStageText}>{BP_STAGES[latestBP.stage].label}</Text>
            </View>
          )}
        </View>

        {/* Big Numbers */}
        <View style={styles.heroNumbersRow}>
          <View style={styles.heroMainValue}>
            <Text style={styles.heroDigits}>
              {latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : '--/--'}
            </Text>
            <Text style={styles.heroUnit}>mmHg</Text>
          </View>

          {latestBP && (
            <View style={styles.heroPulseBox}>
              <View style={styles.pulseRow}>
                <Ionicons name="heart" size={16} color="#ffffff" />
                <Text style={styles.pulseValue}>{latestBP.pulse}</Text>
                <Text style={styles.pulseUnit}>BPM</Text>
              </View>
              <Text style={styles.heroArmText}>
                {latestBP.arm === 'left' ? 'Left' : 'Right'} Arm • {latestBP.position}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.heroActionsRow}>
          <TouchableOpacity
            style={styles.heroPrimaryBtn}
            onPress={() => onOpenAddModal('bp')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={18} color="#e11d48" />
            <Text style={styles.heroPrimaryBtnText}>Log BP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heroSecondaryBtn}
            onPress={onOpenPPG}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={18} color="#ffffff" />
            <Text style={styles.heroSecondaryBtnText}>Measure Pulse</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid of Other Key Vitals */}
      <View style={styles.vitalsGrid}>
        {/* Heart Rate Card */}
        <TouchableOpacity
          style={styles.vitalCard}
          onPress={() => onOpenAddModal('hr')}
          activeOpacity={0.7}
        >
          <View style={styles.vitalCardHeader}>
            <View style={[styles.vitalIconBox, { backgroundColor: '#ffe4e6' }]}>
              <Ionicons name="heart" size={16} color="#e11d48" />
            </View>
            <Text style={styles.vitalCardTitle}>HEART RATE</Text>
          </View>
          <View style={styles.vitalValueRow}>
            <Text style={styles.vitalNumber}>{latestHR ? latestHR.bpm : '--'}</Text>
            <Text style={styles.vitalUnit}>BPM</Text>
          </View>
          <Text style={[styles.vitalStatus, { color: hrStatus?.color || '#10b981' }]}>
            {hrStatus ? hrStatus.label : 'Norm 60-100'}
          </Text>
        </TouchableOpacity>

        {/* Blood Sugar Card */}
        <TouchableOpacity
          style={styles.vitalCard}
          onPress={() => onOpenAddModal('sugar')}
          activeOpacity={0.7}
        >
          <View style={styles.vitalCardHeader}>
            <View style={[styles.vitalIconBox, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="water" size={16} color="#10b981" />
            </View>
            <Text style={styles.vitalCardTitle}>BLOOD SUGAR</Text>
          </View>
          <View style={styles.vitalValueRow}>
            <Text style={styles.vitalNumber}>{latestBS ? latestBS.value : '--'}</Text>
            <Text style={styles.vitalUnit}>{latestBS?.unit || 'mg/dL'}</Text>
          </View>
          <Text style={styles.vitalSub}>
            {latestBS ? latestBS.timing.replace(/_/g, ' ') : 'Fasting < 100'}
          </Text>
        </TouchableOpacity>

        {/* Weight & BMI Card */}
        <TouchableOpacity
          style={styles.vitalCard}
          onPress={() => onOpenAddModal('weight')}
          activeOpacity={0.7}
        >
          <View style={styles.vitalCardHeader}>
            <View style={[styles.vitalIconBox, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="scale" size={16} color="#3b82f6" />
            </View>
            <Text style={styles.vitalCardTitle}>WEIGHT & BMI</Text>
          </View>
          <View style={styles.vitalValueRow}>
            <Text style={styles.vitalNumber}>{latestWeight ? latestWeight.weightKg : '--'}</Text>
            <Text style={styles.vitalUnit}>kg</Text>
          </View>
          <Text style={[styles.vitalStatus, { color: '#3b82f6' }]}>
            {latestWeight ? `BMI ${latestWeight.bmi}` : 'Target: 74 kg'}
          </Text>
        </TouchableOpacity>

        {/* Daily Hydration Card */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalCardHeader}>
            <View style={[styles.vitalIconBox, { backgroundColor: '#f0f9ff' }]}>
              <Ionicons name="water-outline" size={16} color="#0284c7" />
            </View>
            <TouchableOpacity
              style={styles.waterQuickBtn}
              onPress={() => addWater(250)}
              activeOpacity={0.7}
            >
              <Text style={styles.waterQuickBtnText}>+250ml</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.vitalValueRow}>
            <Text style={styles.vitalNumber}>{todayWater.totalMl}</Text>
            <Text style={styles.vitalUnit}>/ {todayWater.goalMl}ml</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${waterPct}%` }]} />
          </View>
        </View>
      </View>

      {/* Pedometer Activity Row */}
      <View style={styles.stepCard}>
        <View style={styles.stepLeft}>
          <View style={styles.stepIconBox}>
            <Ionicons name="walk" size={20} color="#d97706" />
          </View>
          <View>
            <Text style={styles.stepTitle}>Pedometer & Activity</Text>
            <Text style={styles.stepSub}>
              {todaySteps.steps.toLocaleString()} / {todaySteps.goalSteps.toLocaleString()} steps ({stepPct}%)
            </Text>
          </View>
        </View>
        <View style={styles.stepRight}>
          <Text style={styles.stepKm}>{todaySteps.distanceKm} km</Text>
          <Text style={styles.stepKcal}>{todaySteps.caloriesKcal} kcal</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heroCard: {
    backgroundColor: '#e11d48',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.5,
  },
  heroTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 1,
  },
  heroStageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroStageText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  heroNumbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: 14,
  },
  heroMainValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  heroDigits: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  heroUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroPulseBox: {
    alignItems: 'flex-end',
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pulseValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  pulseUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  heroArmText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  heroPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  heroPrimaryBtnText: {
    color: '#e11d48',
    fontSize: 13,
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  heroSecondaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vitalCard: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  vitalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vitalIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalCardTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.4,
  },
  vitalValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 8,
  },
  vitalNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  vitalUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  vitalStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  vitalSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  waterQuickBtn: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  waterQuickBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284c7',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284c7',
    borderRadius: 3,
  },
  stepCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  stepSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  stepRight: {
    alignItems: 'flex-end',
  },
  stepKm: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  stepKcal: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
});
