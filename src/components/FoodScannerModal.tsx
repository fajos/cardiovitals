import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem } from '../types';
import { SAMPLE_FOOD_DATABASE } from '../utils/seedData';

interface FoodScannerModalProps {
  onClose: () => void;
}

export const FoodScannerModal: React.FC<FoodScannerModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem>(SAMPLE_FOOD_DATABASE[0]);

  const filtered = SAMPLE_FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.brand.toLowerCase().includes(search.toLowerCase()) ||
      f.barcode.includes(search)
  );

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="qr-code" size={18} color="#059669" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Food & Nutrition Scanner</Text>
                <Text style={styles.headerSub}>Inspect sodium & cardiac safety</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search food or barcode..."
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Quick Barcode Shelf */}
            <Text style={styles.sectionLabel}>Sample Barcodes (Tap to Inspect):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sampleScroll}>
              {SAMPLE_FOOD_DATABASE.map((f) => {
                const isSelected = selectedFood.id === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.sampleChip, isSelected && styles.sampleChipActive]}
                    onPress={() => setSelectedFood(f)}
                  >
                    <Ionicons
                      name="barcode-outline"
                      size={14}
                      color={isSelected ? '#047857' : '#64748b'}
                    />
                    <View>
                      <Text style={[styles.sampleName, isSelected && styles.sampleNameActive]}>
                        {f.name}
                      </Text>
                      <Text style={styles.sampleBrand}>{f.brand}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Selected Food Detail Card */}
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailTitleCol}>
                  <Text style={styles.brandBadge}>{selectedFood.brand}</Text>
                  <Text style={styles.foodName}>{selectedFood.name}</Text>
                  <Text style={styles.barcodeText}>UPC: {selectedFood.barcode}</Text>
                </View>
                <View
                  style={[
                    styles.nutriBadge,
                    {
                      backgroundColor:
                        selectedFood.nutriScore === 'A'
                          ? '#10b981'
                          : selectedFood.nutriScore === 'B'
                          ? '#34d399'
                          : selectedFood.nutriScore === 'C'
                          ? '#f59e0b'
                          : selectedFood.nutriScore === 'D'
                          ? '#f97316'
                          : '#ef4444',
                    },
                  ]}
                >
                  <Text style={styles.nutriScoreText}>{selectedFood.nutriScore}</Text>
                </View>
              </View>

              {/* Hypertension & Sodium Alert */}
              <View
                style={[
                  styles.alertBox,
                  {
                    backgroundColor: selectedFood.hypertensionFriendly ? '#ecfdf5' : '#fef2f2',
                    borderColor: selectedFood.hypertensionFriendly ? '#a7f3d0' : '#fecaca',
                  },
                ]}
              >
                <Ionicons
                  name={selectedFood.hypertensionFriendly ? 'checkmark-circle' : 'warning'}
                  size={18}
                  color={selectedFood.hypertensionFriendly ? '#047857' : '#b91c1c'}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.alertTitle,
                      { color: selectedFood.hypertensionFriendly ? '#047857' : '#b91c1c' },
                    ]}
                  >
                    {selectedFood.hypertensionFriendly
                      ? 'Heart & Blood Pressure Friendly'
                      : 'High Sodium Warning'}
                  </Text>
                  <Text
                    style={[
                      styles.alertDesc,
                      { color: selectedFood.hypertensionFriendly ? '#065f46' : '#991b1b' },
                    ]}
                  >
                    {selectedFood.hypertensionFriendly
                      ? 'Low sodium content (under 140mg/100g). Safe for daily BP control.'
                      : `Contains ${selectedFood.sodiumMg}mg sodium. May promote fluid retention and spike blood pressure.`}
                  </Text>
                </View>
              </View>

              {/* Nutrients Grid */}
              <View style={styles.nutrientsGrid}>
                <View style={styles.nutriItem}>
                  <Text style={styles.nutriLabel}>Calories</Text>
                  <Text style={styles.nutriVal}>{selectedFood.caloriesPer100g} kcal</Text>
                </View>
                <View style={styles.nutriItem}>
                  <Text style={styles.nutriLabel}>Sodium</Text>
                  <Text
                    style={[
                      styles.nutriVal,
                      { color: selectedFood.sodiumMg > 400 ? '#ef4444' : '#10b981' },
                    ]}
                  >
                    {selectedFood.sodiumMg} mg
                  </Text>
                </View>
                <View style={styles.nutriItem}>
                  <Text style={styles.nutriLabel}>Sugar</Text>
                  <Text style={styles.nutriVal}>{selectedFood.sugarG} g</Text>
                </View>
                <View style={styles.nutriItem}>
                  <Text style={styles.nutriLabel}>Total Carbs</Text>
                  <Text style={styles.nutriVal}>{selectedFood.carbsG} g</Text>
                </View>
                <View style={styles.nutriItem}>
                  <Text style={styles.nutriLabel}>Total Fat</Text>
                  <Text style={styles.nutriVal}>{selectedFood.fatG} g</Text>
                </View>
                <View style={styles.nutriItem}>
                  <Text style={styles.nutriLabel}>Protein</Text>
                  <Text style={styles.nutriVal}>{selectedFood.proteinG} g</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Done</Text>
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
    maxHeight: '85%',
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
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
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
  bodyScroll: {
    maxHeight: 480,
  },
  bodyContent: {
    padding: 20,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  sampleScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  sampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
    marginRight: 8,
  },
  sampleChipActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  sampleName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  sampleNameActive: {
    color: '#047857',
  },
  sampleBrand: {
    fontSize: 9,
    color: '#94a3b8',
  },
  detailCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    marginTop: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  brandBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  foodName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  barcodeText: {
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  nutriBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  nutriScoreText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  alertBox: {
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  alertDesc: {
    fontSize: 9,
    marginTop: 1,
    lineHeight: 13,
  },
  nutrientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutriItem: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nutriLabel: {
    fontSize: 9,
    color: '#94a3b8',
  },
  nutriVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  doneBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
