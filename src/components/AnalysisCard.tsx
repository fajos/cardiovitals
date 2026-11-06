import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BloodPressureRecord, BPStage } from '../types';
import { BP_STAGES } from '../utils/healthCalculations';

interface AnalysisCardProps {
  records: BloodPressureRecord[];
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ records }) => {
  if (records.length === 0) return null;

  const stageCounts: Record<BPStage, number> = {
    hypotension: 0,
    normal: 0,
    elevated: 0,
    stage1: 0,
    stage2: 0,
    crisis: 0,
  };

  records.forEach((r) => {
    if (stageCounts[r.stage] !== undefined) {
      stageCounts[r.stage]++;
    }
  });

  const total = records.length;
  const inTargetPct = Math.round(((stageCounts.normal + stageCounts.elevated) / total) * 100);

  let healthGrade = 'A';
  let gradeBg = '#ecfdf5';
  let gradeBorder = '#a7f3d0';
  let gradeText = '#047857';
  let gradeAdvice = 'Outstanding blood pressure control. Your readings are predominantly in the healthy range.';

  if (inTargetPct < 40) {
    healthGrade = 'C-';
    gradeBg = '#fef2f2';
    gradeBorder = '#fecaca';
    gradeText = '#b91c1c';
    gradeAdvice = 'Frequent readings in Stage 1/Stage 2. Schedule a clinical review with your physician.';
  } else if (inTargetPct < 70) {
    healthGrade = 'B';
    gradeBg = '#fffbeb';
    gradeBorder = '#fde68a';
    gradeText = '#b45309';
    gradeAdvice = 'Moderate control. Focus on low-sodium dietary habits, regular walking, and stress reduction.';
  }

  const stageKeys: BPStage[] = ['hypotension', 'normal', 'elevated', 'stage1', 'stage2', 'crisis'];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={18} color="#e11d48" />
          <Text style={styles.cardTitle}>Stage Distribution & Health Score</Text>
        </View>
        <Text style={styles.headerSub}>{total} logs analyzed</Text>
      </View>

      {/* Grade Card */}
      <View style={[styles.gradeCard, { backgroundColor: gradeBg, borderColor: gradeBorder }]}>
        <View style={styles.gradeTextCol}>
          <Text style={[styles.gradeHeader, { color: gradeText }]}>CARDIOVASCULAR CONTROL SCORE</Text>
          <Text style={styles.gradeAdvice}>{gradeAdvice}</Text>
        </View>
        <View style={[styles.gradeCircle, { borderColor: gradeText }]}>
          <Text style={[styles.gradeLetter, { color: gradeText }]}>{healthGrade}</Text>
        </View>
      </View>

      {/* Stacked Distribution Bar */}
      <View style={styles.barSection}>
        <View style={styles.barHeader}>
          <Text style={styles.barLabel}>AHA / WHO Classification</Text>
          <Text style={styles.barPercent}>{inTargetPct}% In-Target</Text>
        </View>
        <View style={styles.stackedBar}>
          {stageKeys.map((stageKey) => {
            const count = stageCounts[stageKey];
            const pct = (count / total) * 100;
            if (pct === 0) return null;
            return (
              <View
                key={stageKey}
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  backgroundColor: BP_STAGES[stageKey].color,
                }}
              />
            );
          })}
        </View>
      </View>

      {/* Stage Grid */}
      <View style={styles.stageGrid}>
        {stageKeys.map((stageKey) => {
          const info = BP_STAGES[stageKey];
          const count = stageCounts[stageKey];
          const pct = Math.round((count / total) * 100);

          return (
            <View
              key={stageKey}
              style={[
                styles.stageBox,
                { backgroundColor: info.bgColor, borderColor: info.borderColor },
              ]}
            >
              <View style={styles.stageLeft}>
                <View style={[styles.stageDot, { backgroundColor: info.color }]} />
                <View>
                  <Text style={[styles.stageName, { color: info.textColor }]}>{info.label}</Text>
                  <Text style={styles.stageRange}>{info.rangeText}</Text>
                </View>
              </View>
              <View style={styles.stageRight}>
                <Text style={styles.stagePct}>{pct}%</Text>
                <Text style={styles.stageCount}>{count} logs</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#94a3b8',
  },
  gradeCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  gradeHeader: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gradeAdvice: {
    fontSize: 11,
    color: '#334155',
    marginTop: 2,
    lineHeight: 15,
  },
  gradeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  gradeLetter: {
    fontSize: 20,
    fontWeight: '900',
  },
  barSection: {
    gap: 6,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  barPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  stackedBar: {
    height: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  stageGrid: {
    gap: 6,
  },
  stageBox: {
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageName: {
    fontSize: 12,
    fontWeight: '700',
  },
  stageRange: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
  stageRight: {
    alignItems: 'flex-end',
  },
  stagePct: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
  },
  stageCount: {
    fontSize: 9,
    color: '#94a3b8',
  },
});
