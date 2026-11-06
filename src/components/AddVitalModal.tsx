import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../context/HealthContext';
import {
  classifyBloodPressure,
  classifyBloodSugar,
  calculateBMI,
  classifyCholesterol,
} from '../utils/healthCalculations';

interface AddVitalModalProps {
  initialTab?: 'bp' | 'hr' | 'sugar' | 'weight' | 'cholesterol' | 'water';
  onClose: () => void;
}

export const AddVitalModal: React.FC<AddVitalModalProps> = ({
  initialTab = 'bp',
  onClose,
}) => {
  const {
    addBPRecord,
    addHRRecord,
    addBSRecord,
    addWeightRecord,
    addCholesterolRecord,
    addWater,
    userProfile,
  } = useHealth();

  const [activeTab, setActiveTab] = useState<'bp' | 'hr' | 'sugar' | 'weight' | 'cholesterol' | 'water'>(initialTab);

  // BP State
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);
  const [arm, setArm] = useState<'left' | 'right'>('left');
  const [position, setPosition] = useState<'sitting' | 'lying' | 'standing'>('sitting');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Morning', 'Resting']);
  const [bpNotes, setBpNotes] = useState('');

  // HR State
  const [hrBpm, setHrBpm] = useState<number>(72);
  const [hrContext, setHrContext] = useState<'resting' | 'morning' | 'walking' | 'workout' | 'general'>('resting');

  // BS State
  const [bsValue, setBsValue] = useState<number>(95);
  const [bsUnit, setBsUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [bsTiming, setBsTiming] = useState<'fasting' | 'before_meal' | 'after_meal_1h' | 'after_meal_2h' | 'bedtime' | 'random'>('fasting');

  // Weight State
  const [weightKg, setWeightKg] = useState<number>(74.5);

  // Cholesterol State
  const [tc, setTc] = useState<number>(190);
  const [hdl, setHdl] = useState<number>(50);
  const [ldl, setLdl] = useState<number>(115);
  const [tg, setTg] = useState<number>(130);

  // Water State
  const [waterMl, setWaterMl] = useState<number>(250);

  const availableTags = [
    'Morning',
    'Evening',
    'Resting',
    'Before Meal',
    'After Meal',
    'Post-Workout',
    'After Coffee',
    'Pill Taken',
    'Stress',
    'Well Rested',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const bpClassification = classifyBloodPressure(systolic, diastolic);
  const bsClassification = classifyBloodSugar(bsValue, bsTiming, bsUnit);
  const bmiInfo = calculateBMI(weightKg, userProfile.heightCm);
  const cholInfo = classifyCholesterol(tc, hdl, ldl, tg);

  const handleSave = () => {
    if (activeTab === 'bp') {
      addBPRecord({
        timestamp: new Date().toISOString(),
        systolic,
        diastolic,
        pulse,
        arm,
        position,
        tags: selectedTags,
        notes: bpNotes.trim() || undefined,
      });
    } else if (activeTab === 'hr') {
      addHRRecord({
        timestamp: new Date().toISOString(),
        bpm: hrBpm,
        context: hrContext,
        method: 'manual',
      });
    } else if (activeTab === 'sugar') {
      addBSRecord({
        timestamp: new Date().toISOString(),
        value: bsValue,
        unit: bsUnit,
        timing: bsTiming,
        tags: [bsTiming === 'fasting' ? 'Fasting' : 'Post-Meal'],
      });
    } else if (activeTab === 'weight') {
      addWeightRecord(weightKg);
    } else if (activeTab === 'cholesterol') {
      addCholesterolRecord({
        timestamp: new Date().toISOString(),
        tc,
        hdl,
        ldl,
        tg,
        unit: 'mg/dL',
      });
    } else if (activeTab === 'water') {
      addWater(waterMl);
    }
    onClose();
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Health Vital</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabScroll}>
            {[
              { id: 'bp', label: 'BP', icon: 'pulse' },
              { id: 'hr', label: 'Heart', icon: 'heart' },
              { id: 'sugar', label: 'Sugar', icon: 'water' },
              { id: 'weight', label: 'Weight', icon: 'scale' },
              { id: 'cholesterol', label: 'Lipids', icon: 'flask' },
              { id: 'water', label: 'Water', icon: 'water-outline' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab.id as typeof activeTab)}
                >
                  <Ionicons
                    name={tab.icon as any}
                    size={14}
                    color={isSelected ? '#ffffff' : '#64748b'}
                  />
                  <Text style={[styles.tabButtonText, isSelected && styles.tabButtonTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
            {/* BLOOD PRESSURE FORM */}
            {activeTab === 'bp' && (
              <View style={styles.formSection}>
                {/* Stage Banner */}
                <View
                  style={[
                    styles.stageBanner,
                    {
                      backgroundColor: bpClassification.bgColor,
                      borderColor: bpClassification.borderColor,
                    },
                  ]}
                >
                  <View style={styles.stageBannerLeft}>
                    <View style={[styles.stageDot, { backgroundColor: bpClassification.color }]} />
                    <View>
                      <Text style={[styles.stageBannerTitle, { color: bpClassification.textColor }]}>
                        {bpClassification.label}
                      </Text>
                      <Text style={[styles.stageBannerDesc, { color: bpClassification.textColor }]}>
                        {bpClassification.description}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.stageReadingPreview}>{systolic}/{diastolic}</Text>
                </View>

                {/* Systolic & Diastolic Steppers */}
                <View style={styles.stepperRow}>
                  <View style={styles.stepperBox}>
                    <Text style={styles.stepperLabel}>Systolic (SYS)</Text>
                    <View style={styles.stepperControl}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setSystolic((prev) => Math.max(60, prev - 1))}
                      >
                        <Ionicons name="remove" size={18} color="#e11d48" />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.stepInput}
                        value={String(systolic)}
                        keyboardType="numeric"
                        onChangeText={(t) => setSystolic(Number(t) || 0)}
                      />
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setSystolic((prev) => Math.min(260, prev + 1))}
                      >
                        <Ionicons name="add" size={18} color="#e11d48" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.unitSub}>mmHg</Text>
                  </View>

                  <View style={styles.stepperBox}>
                    <Text style={styles.stepperLabel}>Diastolic (DIA)</Text>
                    <View style={styles.stepperControl}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setDiastolic((prev) => Math.max(40, prev - 1))}
                      >
                        <Ionicons name="remove" size={18} color="#e11d48" />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.stepInput}
                        value={String(diastolic)}
                        keyboardType="numeric"
                        onChangeText={(t) => setDiastolic(Number(t) || 0)}
                      />
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => setDiastolic((prev) => Math.min(180, prev + 1))}
                      >
                        <Ionicons name="add" size={18} color="#e11d48" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.unitSub}>mmHg</Text>
                  </View>
                </View>

                {/* Pulse Stepper */}
                <View style={styles.pulseBox}>
                  <View>
                    <Text style={styles.stepperLabel}>Pulse (Heart Rate)</Text>
                    <Text style={styles.pulseNorm}>Norm: 60 - 100 BPM</Text>
                  </View>
                  <View style={styles.stepperControl}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setPulse((prev) => Math.max(40, prev - 1))}
                    >
                      <Ionicons name="remove" size={16} color="#e11d48" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.stepInputSmall}
                      value={String(pulse)}
                      keyboardType="numeric"
                      onChangeText={(t) => setPulse(Number(t) || 0)}
                    />
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => setPulse((prev) => Math.min(200, prev + 1))}
                    >
                      <Ionicons name="add" size={16} color="#e11d48" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Arm & Posture */}
                <View style={styles.optionsRow}>
                  <View style={styles.optionCol}>
                    <Text style={styles.optionLabel}>Arm Tested:</Text>
                    <View style={styles.optionToggleGroup}>
                      <TouchableOpacity
                        style={[styles.toggleBtn, arm === 'left' && styles.toggleBtnActive]}
                        onPress={() => setArm('left')}
                      >
                        <Text style={[styles.toggleBtnText, arm === 'left' && styles.toggleBtnTextActive]}>
                          Left
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.toggleBtn, arm === 'right' && styles.toggleBtnActive]}
                        onPress={() => setArm('right')}
                      >
                        <Text style={[styles.toggleBtnText, arm === 'right' && styles.toggleBtnTextActive]}>
                          Right
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.optionCol}>
                    <Text style={styles.optionLabel}>Body Posture:</Text>
                    <View style={styles.optionToggleGroup}>
                      {(['sitting', 'lying', 'standing'] as const).map((pos) => (
                        <TouchableOpacity
                          key={pos}
                          style={[styles.toggleBtn, position === pos && styles.toggleBtnActive]}
                          onPress={() => setPosition(pos)}
                        >
                          <Text style={[styles.toggleBtnText, position === pos && styles.toggleBtnTextActive]}>
                            {pos.charAt(0).toUpperCase() + pos.slice(1, 4)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Tags */}
                <View>
                  <Text style={styles.optionLabel}>Conditions & Tags:</Text>
                  <View style={styles.tagsContainer}>
                    {availableTags.map((t) => {
                      const isSelected = selectedTags.includes(t);
                      return (
                        <TouchableOpacity
                          key={t}
                          style={[styles.tagItem, isSelected && styles.tagItemActive]}
                          onPress={() => toggleTag(t)}
                        >
                          <Text style={[styles.tagItemText, isSelected && styles.tagItemTextActive]}>
                            #{t}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Notes */}
                <View>
                  <Text style={styles.optionLabel}>Notes (Optional):</Text>
                  <TextInput
                    style={styles.textInputNotes}
                    placeholder="e.g. morning resting reading before coffee"
                    value={bpNotes}
                    onChangeText={setBpNotes}
                  />
                </View>
              </View>
            )}

            {/* HEART RATE FORM */}
            {activeTab === 'hr' && (
              <View style={styles.formSection}>
                <View style={styles.centerValueCard}>
                  <Text style={styles.centerLabel}>Heart Rate Pulse</Text>
                  <TextInput
                    style={styles.centerNumber}
                    value={String(hrBpm)}
                    keyboardType="numeric"
                    onChangeText={(t) => setHrBpm(Number(t) || 0)}
                  />
                  <Text style={styles.centerUnit}>BPM</Text>
                </View>

                <View>
                  <Text style={styles.optionLabel}>Measurement Context:</Text>
                  <View style={styles.tagsContainer}>
                    {(['resting', 'morning', 'walking', 'workout', 'general'] as const).map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.tagItem, hrContext === c && styles.tagItemActive]}
                        onPress={() => setHrContext(c)}
                      >
                        <Text style={[styles.tagItemText, hrContext === c && styles.tagItemTextActive]}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* BLOOD SUGAR FORM */}
            {activeTab === 'sugar' && (
              <View style={styles.formSection}>
                <View
                  style={[
                    styles.stageBanner,
                    { backgroundColor: `${bsClassification.color}15`, borderColor: `${bsClassification.color}40` },
                  ]}
                >
                  <View>
                    <Text style={[styles.stageBannerTitle, { color: bsClassification.color }]}>
                      {bsClassification.label}
                    </Text>
                    <Text style={styles.stageBannerDesc}>
                      {bsTiming === 'fasting' ? 'Fasting Target: 70-99 mg/dL' : 'Post-Meal Target: <140 mg/dL'}
                    </Text>
                  </View>
                  <View style={styles.unitToggleRow}>
                    <TouchableOpacity
                      style={[styles.unitToggleBtn, bsUnit === 'mg/dL' && styles.unitToggleBtnActive]}
                      onPress={() => setBsUnit('mg/dL')}
                    >
                      <Text style={[styles.unitToggleText, bsUnit === 'mg/dL' && styles.unitToggleTextActive]}>
                        mg/dL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.unitToggleBtn, bsUnit === 'mmol/L' && styles.unitToggleBtnActive]}
                      onPress={() => setBsUnit('mmol/L')}
                    >
                      <Text style={[styles.unitToggleText, bsUnit === 'mmol/L' && styles.unitToggleTextActive]}>
                        mmol/L
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.centerValueCard}>
                  <TextInput
                    style={styles.centerNumber}
                    value={String(bsValue)}
                    keyboardType="numeric"
                    onChangeText={(t) => setBsValue(Number(t) || 0)}
                  />
                  <Text style={styles.centerUnit}>{bsUnit}</Text>
                </View>

                <View>
                  <Text style={styles.optionLabel}>Timing & Condition:</Text>
                  <View style={styles.tagsContainer}>
                    {[
                      { id: 'fasting', label: 'Fasting' },
                      { id: 'before_meal', label: 'Before Meal' },
                      { id: 'after_meal_1h', label: '1h After' },
                      { id: 'after_meal_2h', label: '2h After' },
                      { id: 'bedtime', label: 'Bedtime' },
                    ].map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={[styles.tagItem, bsTiming === t.id && styles.tagItemActive]}
                        onPress={() => setBsTiming(t.id as any)}
                      >
                        <Text style={[styles.tagItemText, bsTiming === t.id && styles.tagItemTextActive]}>
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* WEIGHT FORM */}
            {activeTab === 'weight' && (
              <View style={styles.formSection}>
                <View style={styles.centerValueCard}>
                  <Text style={styles.centerLabel}>Weight</Text>
                  <TextInput
                    style={styles.centerNumber}
                    value={String(weightKg)}
                    keyboardType="numeric"
                    onChangeText={(t) => setWeightKg(Number(t) || 0)}
                  />
                  <Text style={styles.centerUnit}>kg</Text>
                </View>

                <View style={styles.bmiResultCard}>
                  <View>
                    <Text style={styles.bmiTitle}>Calculated BMI ({userProfile.heightCm} cm)</Text>
                    <Text style={styles.bmiValue}>
                      {bmiInfo.bmi} ({bmiInfo.label})
                    </Text>
                    <Text style={styles.bmiSub}>
                      Healthy weight: {bmiInfo.healthyWeightMin} - {bmiInfo.healthyWeightMax} kg
                    </Text>
                  </View>
                  <View style={[styles.bmiBadge, { backgroundColor: bmiInfo.color }]}>
                    <Text style={styles.bmiBadgeText}>BMI</Text>
                  </View>
                </View>
              </View>
            )}

            {/* CHOLESTEROL FORM */}
            {activeTab === 'cholesterol' && (
              <View style={styles.formSection}>
                <View style={styles.cholGrid}>
                  <View style={styles.cholBox}>
                    <Text style={styles.cholLabel}>Total (TC)</Text>
                    <TextInput
                      style={styles.cholInput}
                      value={String(tc)}
                      keyboardType="numeric"
                      onChangeText={(t) => setTc(Number(t) || 0)}
                    />
                    <Text style={styles.cholSub}>&lt; 200 mg/dL</Text>
                  </View>
                  <View style={styles.cholBox}>
                    <Text style={styles.cholLabel}>HDL (Good)</Text>
                    <TextInput
                      style={styles.cholInput}
                      value={String(hdl)}
                      keyboardType="numeric"
                      onChangeText={(t) => setHdl(Number(t) || 0)}
                    />
                    <Text style={[styles.cholSub, { color: '#10b981' }]}>&ge; 40 mg/dL</Text>
                  </View>
                  <View style={styles.cholBox}>
                    <Text style={styles.cholLabel}>LDL (Bad)</Text>
                    <TextInput
                      style={styles.cholInput}
                      value={String(ldl)}
                      keyboardType="numeric"
                      onChangeText={(t) => setLdl(Number(t) || 0)}
                    />
                    <Text style={styles.cholSub}>&lt; 100 mg/dL</Text>
                  </View>
                  <View style={styles.cholBox}>
                    <Text style={styles.cholLabel}>Triglycerides</Text>
                    <TextInput
                      style={styles.cholInput}
                      value={String(tg)}
                      keyboardType="numeric"
                      onChangeText={(t) => setTg(Number(t) || 0)}
                    />
                    <Text style={styles.cholSub}>&lt; 150 mg/dL</Text>
                  </View>
                </View>
              </View>
            )}

            {/* WATER FORM */}
            {activeTab === 'water' && (
              <View style={styles.formSection}>
                <Text style={styles.optionLabel}>Select Amount to Log:</Text>
                <View style={styles.waterQuickGrid}>
                  {[
                    { ml: 200, label: 'Cup' },
                    { ml: 250, label: 'Glass' },
                    { ml: 330, label: 'Can' },
                    { ml: 500, label: 'Bottle' },
                    { ml: 750, label: 'Large' },
                    { ml: 1000, label: '1 Liter' },
                  ].map((w) => (
                    <TouchableOpacity
                      key={w.ml}
                      style={[styles.waterCard, waterMl === w.ml && styles.waterCardActive]}
                      onPress={() => setWaterMl(w.ml)}
                    >
                      <Ionicons
                        name="water"
                        size={20}
                        color={waterMl === w.ml ? '#ffffff' : '#0284c7'}
                      />
                      <Text style={[styles.waterAmount, waterMl === w.ml && styles.waterAmountActive]}>
                        +{w.ml}ml
                      </Text>
                      <Text style={[styles.waterSubText, waterMl === w.ml && styles.waterSubTextActive]}>
                        {w.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Save Button */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
              <Text style={styles.saveBtnText}>Save Reading</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
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
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
  },
  tabScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 6,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    gap: 4,
  },
  tabButtonActive: {
    backgroundColor: '#e11d48',
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  scrollBody: {
    maxHeight: 460,
  },
  scrollContent: {
    padding: 20,
  },
  formSection: {
    gap: 14,
  },
  stageBanner: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stageBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  stageBannerDesc: {
    fontSize: 10,
    opacity: 0.85,
    marginTop: 1,
  },
  stageReadingPreview: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepperBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#fecdd3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepInput: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    minWidth: 50,
  },
  unitSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  pulseBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pulseNorm: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 1,
  },
  stepInputSmall: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    minWidth: 40,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionCol: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 6,
  },
  optionToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 2,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  toggleBtnTextActive: {
    color: '#e11d48',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagItem: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagItemActive: {
    backgroundColor: '#ffe4e6',
    borderWidth: 1,
    borderColor: '#fda4af',
  },
  tagItemText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  tagItemTextActive: {
    color: '#e11d48',
    fontWeight: '800',
  },
  textInputNotes: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: '#0f172a',
  },
  centerValueCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  centerLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  centerNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: '#0f172a',
    marginVertical: 4,
  },
  centerUnit: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e11d48',
  },
  unitToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unitToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitToggleBtnActive: {
    backgroundColor: '#10b981',
  },
  unitToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  unitToggleTextActive: {
    color: '#ffffff',
  },
  bmiResultCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bmiTitle: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
  },
  bmiValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#065f46',
    marginTop: 2,
  },
  bmiSub: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
  },
  bmiBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bmiBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ffffff',
  },
  cholGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cholBox: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cholLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  cholInput: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginVertical: 2,
  },
  cholSub: {
    fontSize: 10,
    color: '#94a3b8',
  },
  waterQuickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  waterCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 4,
  },
  waterCardActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  waterAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  waterAmountActive: {
    color: '#ffffff',
  },
  waterSubText: {
    fontSize: 10,
    color: '#64748b',
  },
  waterSubTextActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  saveBtn: {
    backgroundColor: '#e11d48',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
