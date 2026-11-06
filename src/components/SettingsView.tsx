import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useHealth } from '../context/HealthContext';
import { UserProfile } from '../types';

export const SettingsView: React.FC = () => {
  const { userProfile, updateProfile, resetToDefaultData, exportBackupJson, importBackupJson } = useHealth();

  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(String(userProfile.age));
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(userProfile.gender);
  const [heightCm, setHeightCm] = useState(String(userProfile.heightCm));
  const [targetWeightKg, setTargetWeightKg] = useState(String(userProfile.targetWeightKg));
  const [targetSteps, setTargetSteps] = useState(String(userProfile.targetSteps));
  const [targetWaterMl, setTargetWaterMl] = useState(String(userProfile.targetWaterMl));
  const [targetSystolic, setTargetSystolic] = useState(String(userProfile.targetSystolic));
  const [targetDiastolic, setTargetDiastolic] = useState(String(userProfile.targetDiastolic));

  const [glucoseUnit, setGlucoseUnit] = useState<'mg/dL' | 'mmol/L'>(userProfile.units.glucose);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(userProfile.units.weight);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSaveProfile = () => {
    updateProfile({
      name: name.trim() || 'Alex Mercer',
      age: parseInt(age, 10) || 45,
      gender,
      heightCm: parseFloat(heightCm) || 178,
      targetWeightKg: parseFloat(targetWeightKg) || 75,
      targetSteps: parseInt(targetSteps, 10) || 8000,
      targetWaterMl: parseInt(targetWaterMl, 10) || 2000,
      targetSystolic: parseInt(targetSystolic, 10) || 120,
      targetDiastolic: parseInt(targetDiastolic, 10) || 80,
      units: {
        ...userProfile.units,
        glucose: glucoseUnit,
        weight: weightUnit,
      },
    });

    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleExportBackup = async () => {
    try {
      const json = await exportBackupJson();
      const fileName = `CardioVitals_Backup_${new Date().toISOString().split('T')[0]}.json`;
      const docDir = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory;
      const fileUri = `${docDir}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export CardioVitals Pro Backup',
          UTI: 'public.json',
        });
      } else {
        Alert.alert('Backup Generated', `Backup file saved locally:\n${fileUri}`);
      }
    } catch (e: any) {
      Alert.alert('Export Failed', e.message || 'Unable to export backup file.');
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Health Records',
      'This will restore 30 days of realistic clinical seed data and reset all vitals. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Data',
          style: 'destructive',
          onPress: () => {
            resetToDefaultData();
            Alert.alert('Success', 'Health data has been reset to default clinical profile.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Ionicons name="settings-sharp" size={18} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.bannerTitle}>Settings & Profile</Text>
          <Text style={styles.bannerSub}>Demographics, Clinical Targets & Backup</Text>
        </View>
      </View>

      {savedBanner && (
        <View style={styles.successNotification}>
          <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
          <Text style={styles.successText}>Profile settings saved successfully!</Text>
        </View>
      )}

      {/* Patient Profile Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={20} color="#e11d48" />
          <Text style={styles.cardTitle}>Personal Profile</Text>
        </View>

        <Text style={styles.label}>Patient / User Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Alex Mercer"
          placeholderTextColor="#94a3b8"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Age (Years)</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="45"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Biological Sex</Text>
            <View style={styles.genderRow}>
              {(['male', 'female', 'other'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g === 'male' ? 'Male' : g === 'female' ? 'Female' : 'Other'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={heightCm}
              onChangeText={setHeightCm}
              keyboardType="decimal-pad"
              placeholder="178"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Target Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={targetWeightKg}
              onChangeText={setTargetWeightKg}
              keyboardType="decimal-pad"
              placeholder="75"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>
      </View>

      {/* Clinical Target Values */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="speedometer-outline" size={20} color="#0284c7" />
          <Text style={styles.cardTitle}>Daily Clinical Targets</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Target Systolic (mmHg)</Text>
            <TextInput
              style={styles.input}
              value={targetSystolic}
              onChangeText={setTargetSystolic}
              keyboardType="number-pad"
              placeholder="120"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Target Diastolic (mmHg)</Text>
            <TextInput
              style={styles.input}
              value={targetDiastolic}
              onChangeText={setTargetDiastolic}
              keyboardType="number-pad"
              placeholder="80"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Target Steps / Day</Text>
            <TextInput
              style={styles.input}
              value={targetSteps}
              onChangeText={setTargetSteps}
              keyboardType="number-pad"
              placeholder="8000"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Water Goal (ml / Day)</Text>
            <TextInput
              style={styles.input}
              value={targetWaterMl}
              onChangeText={setTargetWaterMl}
              keyboardType="number-pad"
              placeholder="2000"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Units Switcher */}
        <View style={styles.unitRow}>
          <Text style={styles.unitLabel}>Blood Glucose Unit:</Text>
          <View style={styles.unitSwitch}>
            <TouchableOpacity
              style={[styles.unitBtn, glucoseUnit === 'mg/dL' && styles.unitBtnActive]}
              onPress={() => setGlucoseUnit('mg/dL')}
            >
              <Text style={[styles.unitBtnText, glucoseUnit === 'mg/dL' && styles.unitBtnTextActive]}>mg/dL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitBtn, glucoseUnit === 'mmol/L' && styles.unitBtnActive]}
              onPress={() => setGlucoseUnit('mmol/L')}
            >
              <Text style={[styles.unitBtnText, glucoseUnit === 'mmol/L' && styles.unitBtnTextActive]}>mmol/L</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} activeOpacity={0.8}>
          <Ionicons name="save-outline" size={18} color="#ffffff" />
          <Text style={styles.saveBtnText}>Save Profile & Targets</Text>
        </TouchableOpacity>
      </View>

      {/* Data Management & Backups */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cloud-download-outline" size={20} color="#16a34a" />
          <Text style={styles.cardTitle}>Data & Privacy Management</Text>
        </View>

        <Text style={styles.bodyMuted}>
          All health records are stored 100% locally on your device with complete offline privacy. No medical information is sent to third-party cloud servers.
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleExportBackup} activeOpacity={0.7}>
            <Ionicons name="share-outline" size={18} color="#0284c7" />
            <Text style={styles.actionBtnText}>Export JSON Backup</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.dangerBtn]} onPress={handleResetData} activeOpacity={0.7}>
            <Ionicons name="refresh-outline" size={18} color="#dc2626" />
            <Text style={[styles.actionBtnText, styles.dangerBtnText]}>Reset Demo Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clinical Guidelines Standards */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#6366f1" />
          <Text style={styles.cardTitle}>Clinical Diagnostic Standards</Text>
        </View>

        <View style={styles.standardItem}>
          <Text style={styles.standardTitle}>AHA / ACC 2017 Blood Pressure Guideline</Text>
          <Text style={styles.standardDesc}>
            Classification follows the American Heart Association & American College of Cardiology: Normal (&lt;120/&lt;80), Elevated (120-129/&lt;80), Stage 1 Hypertension (130-139/80-89), Stage 2 Hypertension (≥140/≥90), and Hypertensive Crisis (&gt;180 and/or &gt;120 mmHg).
          </Text>
        </View>

        <View style={styles.standardItem}>
          <Text style={styles.standardTitle}>ADA 2024 Glycemic Reference Norms</Text>
          <Text style={styles.standardDesc}>
            Fasting glucose: Normal (&lt;100 mg/dL), Prediabetes (100-125 mg/dL), Diabetes (≥126 mg/dL). Postprandial: Normal (&lt;140 mg/dL), Prediabetes (140-199 mg/dL), Diabetes (≥200 mg/dL).
          </Text>
        </View>

        <View style={styles.standardItem}>
          <Text style={styles.standardTitle}>WHO & CDC Adult BMI Classifications</Text>
          <Text style={styles.standardDesc}>
            Underweight (&lt;18.5), Normal weight (18.5-24.9), Overweight (25.0-29.9), Obesity Class I (30.0-34.9), Obesity Class II (35.0-39.9), Severe Class III (≥40.0).
          </Text>
        </View>
      </View>

      {/* Medical Disclaimer */}
      <View style={styles.disclaimerCard}>
        <View style={styles.disclaimerHeader}>
          <Ionicons name="alert-circle" size={22} color="#b45309" />
          <Text style={styles.disclaimerTitle}>Medical & Legal Disclaimer</Text>
        </View>
        <Text style={styles.disclaimerText}>
          CardioVitals Pro is intended exclusively for personal health tracking, clinical journal keeping, and informational purposes. It is NOT a medical diagnostic device, does not measure blood pressure directly through software alone, and does not replace medical advice, diagnosis, or treatment by a qualified healthcare professional. Always consult your physician for clinical diagnosis, before altering medication regimens, or if you experience symptoms of hypertensive emergency.
        </Text>
        <Text style={styles.versionText}>CardioVitals Pro · Expo Cross-Platform Edition v1.3.2</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  bannerBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  bannerSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  successNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  genderBtnActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#e11d48',
  },
  genderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  genderTextActive: {
    color: '#e11d48',
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 6,
    marginBottom: 14,
  },
  unitLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  unitSwitch: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 3,
  },
  unitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unitBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  unitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  unitBtnTextActive: {
    color: '#0f172a',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e11d48',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  bodyMuted: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284c7',
  },
  dangerBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  dangerBtnText: {
    color: '#dc2626',
  },
  standardItem: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  standardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  standardDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  disclaimerCard: {
    backgroundColor: '#fefce8',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fef08a',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#854d0e',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#713f12',
    lineHeight: 18,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 11,
    color: '#a16207',
    fontWeight: '500',
    textAlign: 'center',
  },
});
