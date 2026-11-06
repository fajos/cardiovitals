import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../context/HealthContext';
import { ReminderItem } from '../types';

export const RemindersView: React.FC = () => {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useHealth();
  const [showAddModal, setShowAddModal] = useState(false);

  const [type, setType] = useState<ReminderItem['type']>('bp');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [notes, setNotes] = useState('');

  const daysLabel = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    addReminder({
      type,
      title: title.trim(),
      time,
      daysOfWeek: daysOfWeek.length > 0 ? daysOfWeek : [0, 1, 2, 3, 4, 5, 6],
      enabled: true,
      notes: notes.trim() || undefined,
    });
    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  const getTypeIcon = (t: ReminderItem['type']): any => {
    switch (t) {
      case 'bp':
        return 'pulse';
      case 'medication':
        return 'medkit';
      case 'water':
        return 'water';
      default:
        return 'alarm';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.headerTitle}>Alarms & Reminders</Text>
          <Text style={styles.headerSub}>Timed prompts for BP, pills & water</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text style={styles.addBtnText}>Add Alarm</Text>
        </TouchableOpacity>
      </View>

      {/* Reminders List */}
      <View style={styles.remindersList}>
        {reminders.map((rem) => (
          <View
            key={rem.id}
            style={[styles.remCard, !rem.enabled && styles.remCardDisabled]}
          >
            <View style={styles.remLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name={getTypeIcon(rem.type)} size={18} color="#e11d48" />
              </View>

              <View style={styles.remDetails}>
                <View style={styles.timeTitleRow}>
                  <Text style={styles.remTime}>{rem.time}</Text>
                  <Text style={styles.remTitle}>{rem.title}</Text>
                </View>
                <Text style={styles.remRepeat}>
                  {rem.daysOfWeek.length === 7
                    ? 'Every day'
                    : rem.daysOfWeek.map((d) => daysLabel[d]).join(', ')}
                  {rem.notes ? ` • ${rem.notes}` : ''}
                </Text>
              </View>
            </View>

            <View style={styles.remActions}>
              <Switch
                value={rem.enabled}
                onValueChange={() => toggleReminder(rem.id)}
                trackColor={{ false: '#cbd5e1', true: '#fecdd3' }}
                thumbColor={rem.enabled ? '#e11d48' : '#94a3b8'}
              />
              <TouchableOpacity
                onPress={() => deleteReminder(rem.id)}
                style={styles.trashBtn}
              >
                <Ionicons name="trash-outline" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Add Modal */}
      {showAddModal && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Health Alarm</Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                {/* Type pills */}
                <Text style={styles.inputLabel}>Category:</Text>
                <View style={styles.typeRow}>
                  {(['bp', 'medication', 'water', 'sugar'] as const).map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.typePill, type === t && styles.typePillActive]}
                      onPress={() => setType(t)}
                    >
                      <Text style={[styles.typePillText, type === t && styles.typePillTextActive]}>
                        {t.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Title */}
                <Text style={styles.inputLabel}>Title / Pill Name:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Morning Blood Pressure Log"
                  value={title}
                  onChangeText={setTitle}
                />

                {/* Time */}
                <Text style={styles.inputLabel}>Time (HH:MM):</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="08:00"
                  value={time}
                  onChangeText={setTime}
                />

                {/* Repeat days */}
                <Text style={styles.inputLabel}>Repeat Days:</Text>
                <View style={styles.daysRow}>
                  {daysLabel.map((d, idx) => {
                    const isSelected = daysOfWeek.includes(idx);
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[styles.dayCircle, isSelected && styles.dayCircleActive]}
                        onPress={() => toggleDay(idx)}
                      >
                        <Text style={[styles.dayText, isSelected && styles.dayTextActive]}>
                          {d}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Notes */}
                <Text style={styles.inputLabel}>Notes (Optional):</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. take with a glass of water"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}>
                  <Text style={styles.saveBtnText}>Save Alarm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerBar: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e11d48',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  remindersList: {
    gap: 8,
  },
  remCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  remCardDisabled: {
    opacity: 0.6,
  },
  remLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remDetails: {
    flex: 1,
  },
  timeTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  remTime: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  remTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  remRepeat: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  remActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trashBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalBody: {
    padding: 20,
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typePill: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  typePillActive: {
    backgroundColor: '#e11d48',
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
  },
  typePillTextActive: {
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0f172a',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleActive: {
    backgroundColor: '#0f172a',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  dayTextActive: {
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
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
