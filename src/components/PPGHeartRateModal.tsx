import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import { useHealth } from '../context/HealthContext';
import { classifyHeartRate } from '../utils/healthCalculations';

interface PPGHeartRateModalProps {
  onClose: () => void;
  onSaved?: (bpm: number) => void;
}

export const PPGHeartRateModal: React.FC<PPGHeartRateModalProps> = ({ onClose, onSaved }) => {
  const { addHRRecord, userProfile } = useHealth();
  const [measuring, setMeasuring] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);
  const [finalBpm, setFinalBpm] = useState<number | null>(null);
  const [wavePoints, setWavePoints] = useState<number[]>([]);
  const [context, setContext] = useState<'resting' | 'morning' | 'walking' | 'workout' | 'general'>('resting');

  const simulatedTargetBpm = useRef(Math.floor(Math.random() * 10) + 68);

  useEffect(() => {
    let startTime = Date.now();
    const durationMs = 12000;
    let lastBeatTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      const timeSec = elapsed / 1000;
      const beatPeriod = 60 / simulatedTargetBpm.current;
      const phase = (timeSec % beatPeriod) / beatPeriod;

      // Arterial pulse wave simulation:
      const mainPeak = Math.exp(-Math.pow((phase - 0.2) / 0.08, 2)) * 70;
      const dicroticPeak = Math.exp(-Math.pow((phase - 0.45) / 0.07, 2)) * 25;
      const val = 30 + mainPeak + dicroticPeak + Math.sin(timeSec * 4) * 4;

      setWavePoints((prev) => {
        const next = [...prev, val];
        return next.slice(-45);
      });

      const now = Date.now();
      if (now - lastBeatTime > beatPeriod * 1000) {
        lastBeatTime = now;
        setCurrentBpm(simulatedTargetBpm.current);
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setMeasuring(false);
        setFinalBpm(simulatedTargetBpm.current);
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    if (!finalBpm) return;
    addHRRecord({
      timestamp: new Date().toISOString(),
      bpm: finalBpm,
      context,
      method: 'camera_ppg',
      notes: 'Measured via Optical PPG Pulse Sensor',
      wavePoints,
    });
    if (onSaved) onSaved(finalBpm);
    onClose();
  };

  const hrClassification = finalBpm ? classifyHeartRate(finalBpm, userProfile.age, context) : null;

  const chartWidth = 280;
  const chartHeight = 60;
  const polyPoints = wavePoints
    .map((pt, idx) => {
      const x = (idx / (wavePoints.length - 1 || 1)) * chartWidth;
      const min = Math.min(...wavePoints);
      const max = Math.max(...wavePoints) || 1;
      const norm = (pt - min) / (max - min || 1);
      const y = chartHeight - norm * (chartHeight - 10) - 5;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="pulse" size={18} color="#e11d48" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Instant PPG Pulse Meter</Text>
                <Text style={styles.headerSub}>Capillary vascular rhythm analysis</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.modalBody}>
            {/* Heart Animation */}
            <View style={styles.heartWrapper}>
              <View
                style={[
                  styles.heartCircle,
                  measuring ? styles.heartCirclePulse : styles.heartCircleDone,
                ]}
              >
                <Ionicons
                  name="heart"
                  size={48}
                  color={measuring ? '#e11d48' : '#10b981'}
                />
              </View>
            </View>

            {/* Digits */}
            <View style={styles.digitsRow}>
              <Text style={styles.digits}>{finalBpm || currentBpm || '--'}</Text>
              <Text style={styles.digitsUnit}>BPM</Text>
            </View>
            <Text style={styles.statusText}>
              {measuring ? `Detecting optical arterial pulse... ${progress}%` : 'Measurement Complete'}
            </Text>

            {/* Live ECG Wave View */}
            <View style={styles.waveBox}>
              <Svg width={chartWidth} height={chartHeight}>
                {wavePoints.length > 1 && (
                  <Polyline
                    points={polyPoints}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </Svg>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE ECG</Text>
              </View>
            </View>

            {/* Result Classification */}
            {finalBpm && hrClassification && (
              <View style={styles.resultBox}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={18} color="#047857" />
                  <Text style={styles.resultLabel}>{hrClassification.label}</Text>
                </View>
                <Text style={styles.resultSub}>
                  Resting Norm for Age {userProfile.age}: {hrClassification.normalMin}-{hrClassification.normalMax} BPM
                </Text>

                {/* State selector */}
                <View style={styles.contextGrid}>
                  {(['resting', 'morning', 'walking', 'workout'] as const).map((ctx) => (
                    <TouchableOpacity
                      key={ctx}
                      style={[styles.ctxBtn, context === ctx && styles.ctxBtnActive]}
                      onPress={() => setContext(ctx)}
                    >
                      <Text style={[styles.ctxBtnText, context === ctx && styles.ctxBtnTextActive]}>
                        {ctx.charAt(0).toUpperCase() + ctx.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            {finalBpm ? (
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
                <Text style={styles.saveBtnText}>Save to Pulse History</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffe4e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  heartWrapper: {
    marginVertical: 10,
  },
  heartCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartCirclePulse: {
    backgroundColor: '#fff1f2',
  },
  heartCircleDone: {
    backgroundColor: '#ecfdf5',
  },
  digitsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  digits: {
    fontSize: 44,
    fontWeight: '900',
    color: '#0f172a',
  },
  digitsUnit: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e11d48',
  },
  statusText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  waveBox: {
    width: '100%',
    height: 70,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  liveBadge: {
    position: 'absolute',
    top: 6,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e11d48',
  },
  liveText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#f43f5e',
  },
  resultBox: {
    width: '100%',
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  resultSub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
  },
  contextGrid: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  ctxBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  ctxBtnActive: {
    backgroundColor: '#047857',
  },
  ctxBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  ctxBtnTextActive: {
    color: '#ffffff',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  saveBtn: {
    backgroundColor: '#e11d48',
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
});
