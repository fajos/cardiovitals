import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../context/HealthContext';
import { BP_STAGES, exportRecordsToCSVNative } from '../utils/healthCalculations';
import { BPStage, BloodPressureRecord } from '../types';

export const HistoryList: React.FC = () => {
  const { bpRecords, deleteBPRecord } = useHealth();
  const [filterStage, setFilterStage] = useState<BPStage | 'all'>('all');

  const filtered = bpRecords.filter((r) => {
    if (filterStage !== 'all' && r.stage !== filterStage) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    Alert.alert('Delete Record', 'Are you sure you want to remove this reading?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteBPRecord(id) },
    ]);
  };

  const renderItem = ({ item }: { item: BloodPressureRecord }) => {
    const stageInfo = BP_STAGES[item.stage];
    const date = new Date(item.timestamp);

    return (
      <View style={styles.recordCard}>
        <View style={styles.cardLeft}>
          <View style={[styles.stageStrip, { backgroundColor: stageInfo.color }]} />
          <View style={styles.recordInfo}>
            <View style={styles.recordValuesRow}>
              <Text style={styles.recordPressure}>
                {item.systolic}/{item.diastolic}
              </Text>
              <Text style={styles.recordUnit}>mmHg</Text>
              <View style={styles.pulseTag}>
                <Ionicons name="heart" size={12} color="#e11d48" />
                <Text style={styles.pulseText}>{item.pulse} BPM</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={[styles.stageBadge, { backgroundColor: stageInfo.bgColor }]}>
                <Text style={[styles.stageBadgeText, { color: stageInfo.textColor }]}>
                  {stageInfo.label}
                </Text>
              </View>
              <Text style={styles.dateText}>
                {date.toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.armText}>
                • {item.arm} ({item.position})
              </Text>
            </View>

            {item.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {item.tags.map((t) => (
                  <View key={t} style={styles.tagPill}>
                    <Text style={styles.tagText}>#{t}</Text>
                  </View>
                ))}
              </View>
            )}

            {item.notes ? <Text style={styles.notesText}>"{item.notes}"</Text> : null}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.6}
        >
          <Ionicons name="trash-outline" size={16} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topTitle}>Log History</Text>
          <Text style={styles.topSub}>
            {filtered.length} of {bpRecords.length} records shown
          </Text>
        </View>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() => exportRecordsToCSVNative(bpRecords)}
          activeOpacity={0.8}
        >
          <Ionicons name="share-outline" size={16} color="#e11d48" />
          <Text style={styles.exportBtnText}>Share CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsScroll}>
        <TouchableOpacity
          style={[styles.chip, filterStage === 'all' && styles.chipActive]}
          onPress={() => setFilterStage('all')}
        >
          <Text style={[styles.chipText, filterStage === 'all' && styles.chipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {(['normal', 'elevated', 'stage1', 'stage2', 'crisis', 'hypotension'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, filterStage === s && styles.chipActive]}
            onPress={() => setFilterStage(s)}
          >
            <Text style={[styles.chipText, filterStage === s && styles.chipTextActive]}>
              {BP_STAGES[s].label.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Records FlatList */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  topBar: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  topSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 4,
  },
  exportBtnText: {
    color: '#e11d48',
    fontSize: 12,
    fontWeight: '700',
  },
  chipsScroll: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    gap: 8,
  },
  recordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  stageStrip: {
    width: 4,
    height: 48,
    borderRadius: 2,
  },
  recordInfo: {
    flex: 1,
  },
  recordValuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  recordPressure: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  recordUnit: {
    fontSize: 10,
    color: '#94a3b8',
  },
  pulseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 6,
  },
  pulseText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#e11d48',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  stageBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stageBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  dateText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  armText: {
    fontSize: 9,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tagPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
  },
  notesText: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
});
