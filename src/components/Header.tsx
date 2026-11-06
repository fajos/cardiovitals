import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenPPG: () => void;
  onOpenScanner: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenPPG,
  onOpenScanner,
  onOpenReport,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="heart" size={20} color="#ffffff" />
        </View>
        <View style={styles.titleColumn}>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandName}>CardioVitals</Text>
            <View style={styles.proPill}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.subTitle}>Cardiovascular & Vitals Suite</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onOpenReport} activeOpacity={0.7}>
          <Ionicons name="document-text-outline" size={18} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onOpenScanner} activeOpacity={0.7}>
          <Ionicons name="qr-code-outline" size={18} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconButton, styles.ppgButton]} onPress={onOpenPPG} activeOpacity={0.7}>
          <Ionicons name="pulse" size={18} color="#e11d48" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={onOpenAddModal} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Log</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#e11d48',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  titleColumn: {
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  proPill: {
    backgroundColor: '#ffe4e6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  proText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#e11d48',
  },
  subTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ppgButton: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e11d48',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
