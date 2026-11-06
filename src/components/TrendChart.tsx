import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Rect, Line, Polyline, Circle, Text as SvgText, G } from 'react-native-svg';
import { BloodPressureRecord } from '../types';
import { BP_STAGES } from '../utils/healthCalculations';

interface TrendChartProps {
  records: BloodPressureRecord[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ records }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedRecord, setSelectedRecord] = useState<BloodPressureRecord | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 48, 550);
  const chartHeight = 180;
  const paddingX = 35;
  const paddingY = 20;

  const now = new Date();
  const filtered = records
    .filter((r) => {
      const diffDays = (now.getTime() - new Date(r.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      if (timeRange === '7d') return diffDays <= 7;
      if (timeRange === '30d') return diffDays <= 30;
      if (timeRange === '90d') return diffDays <= 90;
      return true;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (filtered.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No blood pressure records found for this period.</Text>
      </View>
    );
  }

  const sysValues = filtered.map((r) => r.systolic);
  const diaValues = filtered.map((r) => r.diastolic);
  const pulseValues = filtered.map((r) => r.pulse);

  const avgSys = Math.round(sysValues.reduce((a, b) => a + b, 0) / sysValues.length);
  const avgDia = Math.round(diaValues.reduce((a, b) => a + b, 0) / diaValues.length);
  const avgPulse = Math.round(pulseValues.reduce((a, b) => a + b, 0) / pulseValues.length);

  const maxSys = Math.max(...sysValues);
  const minSys = Math.min(...sysValues);
  const maxDia = Math.max(...diaValues);
  const minDia = Math.min(...diaValues);

  const yMin = Math.min(50, ...diaValues) - 5;
  const yMax = Math.max(160, ...sysValues) + 10;

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - yMin) / (yMax - yMin)) * (chartHeight - 2 * paddingY);
  };

  const getX = (index: number) => {
    if (filtered.length === 1) return chartWidth / 2;
    return paddingX + (index / (filtered.length - 1)) * (chartWidth - 2 * paddingX);
  };

  const sysPoints = filtered.map((r, i) => `${getX(i)},${getY(r.systolic)}`).join(' ');
  const diaPoints = filtered.map((r, i) => `${getX(i)},${getY(r.diastolic)}`).join(' ');

  const normalSysTop = getY(120);
  const normalSysBottom = getY(90);
  const normalDiaTop = getY(80);
  const normalDiaBottom = getY(60);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Blood Pressure Trends</Text>
          <Text style={styles.cardSubtitle}>Systolic & Diastolic variation</Text>
        </View>

        <View style={styles.timeRangePills}>
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.pill, timeRange === range && styles.pillActive]}
              onPress={() => setTimeRange(range)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, timeRange === range && styles.pillTextActive]}>
                {range.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Native SVG Chart */}
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Shaded Target Normal Zone for Systolic (90-120) */}
          <Rect
            x={paddingX}
            y={normalSysTop}
            width={chartWidth - 2 * paddingX}
            height={Math.max(2, normalSysBottom - normalSysTop)}
            fill="#10b981"
            fillOpacity={0.08}
            rx={4}
          />

          {/* Shaded Target Normal Zone for Diastolic (60-80) */}
          <Rect
            x={paddingX}
            y={normalDiaTop}
            width={chartWidth - 2 * paddingX}
            height={Math.max(2, normalDiaBottom - normalDiaTop)}
            fill="#10b981"
            fillOpacity={0.08}
            rx={4}
          />

          {/* Grid lines */}
          {[60, 80, 100, 120, 140, 160].map((val) => {
            if (val < yMin || val > yMax) return null;
            const y = getY(val);
            return (
              <G key={val}>
                <Line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />
                <SvgText
                  x={paddingX - 6}
                  y={y + 3}
                  fontSize="9"
                  fill="#94a3b8"
                  textAnchor="end"
                  fontWeight="600"
                >
                  {val}
                </SvgText>
              </G>
            );
          })}

          {/* Polyline Curves */}
          <Polyline
            points={sysPoints}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Polyline
            points={diaPoints}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {filtered.map((record, index) => {
            const x = getX(index);
            const sysY = getY(record.systolic);
            const diaY = getY(record.diastolic);
            const isSelected = selectedRecord?.id === record.id;

            return (
              <G key={record.id} onPress={() => setSelectedRecord(record)}>
                <Line
                  x1={x}
                  y1={sysY}
                  x2={x}
                  y2={diaY}
                  stroke="#cbd5e1"
                  strokeWidth={isSelected ? '2' : '1'}
                />
                <Circle
                  cx={x}
                  cy={sysY}
                  r={isSelected ? 6 : 4}
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <Circle
                  cx={x}
                  cy={diaY}
                  r={isSelected ? 6 : 4}
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </G>
            );
          })}
        </Svg>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f43f5e' }]} />
            <Text style={styles.legendText}>Systolic</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>Diastolic</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]} />
            <Text style={styles.legendText}>Normal Target Band</Text>
          </View>
        </View>
      </View>

      {/* Selected Tooltip */}
      {selectedRecord && (
        <View style={styles.tooltipBox}>
          <View style={styles.tooltipLeft}>
            <View style={[styles.tooltipDot, { backgroundColor: BP_STAGES[selectedRecord.stage].color }]} />
            <View>
              <Text style={styles.tooltipValue}>
                {selectedRecord.systolic}/{selectedRecord.diastolic} mmHg • {selectedRecord.pulse} BPM
              </Text>
              <Text style={styles.tooltipTime}>
                {new Date(selectedRecord.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                {new Date(selectedRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                • {selectedRecord.arm} Arm
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.tooltipBadge,
              { backgroundColor: BP_STAGES[selectedRecord.stage].bgColor },
            ]}
          >
            <Text
              style={[
                styles.tooltipBadgeText,
                { color: BP_STAGES[selectedRecord.stage].textColor },
              ]}
            >
              {BP_STAGES[selectedRecord.stage].label}
            </Text>
          </View>
        </View>
      )}

      {/* Summary Statistics */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>AVERAGE</Text>
          <Text style={styles.statValue}>
            {avgSys}/{avgDia}
          </Text>
          <Text style={styles.statSub}>Pulse: {avgPulse} BPM</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>LOWEST</Text>
          <Text style={[styles.statValue, { color: '#10b981' }]}>
            {minSys}/{minDia}
          </Text>
          <Text style={styles.statSub}>Minimum</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>PEAK</Text>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>
            {maxSys}/{maxDia}
          </Text>
          <Text style={styles.statSub}>Maximum</Text>
        </View>
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  timeRangePills: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 2,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  pillTextActive: {
    color: '#e11d48',
  },
  chartWrapper: {
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendBox: {
    width: 10,
    height: 6,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  tooltipBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tooltipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tooltipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tooltipValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  tooltipTime: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  tooltipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tooltipBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  statSub: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
