import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../context/HealthContext';

export const ChallengesView: React.FC = () => {
  const { challenges, toggleChallengeDay } = useHealth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'habit' | 'diet' | 'activity' | 'mind'>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const getIcon = (name: string): any => {
    switch (name) {
      case 'moon':
        return 'moon';
      case 'water':
        return 'water';
      case 'walk':
        return 'walk';
      case 'nutrition':
        return 'nutrition';
      case 'flame':
        return 'flame';
      case 'ban':
        return 'ban';
      case 'wine':
        return 'wine';
      case 'ice-cream':
        return 'ice-cream';
      case 'cafe':
        return 'cafe';
      case 'heart':
        return 'heart';
      case 'happy':
        return 'happy';
      case 'warning':
        return 'warning';
      case 'medkit':
        return 'medkit';
      default:
        return 'sparkles';
    }
  };

  const filtered = challenges.filter(
    (ch) => selectedCategory === 'all' || ch.category === selectedCategory
  );

  const totalCompletedToday = challenges.filter((c) => c.completedDates.includes(todayStr)).length;

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          <Text style={styles.bannerTag}>DAILY CARDIOVASCULAR HABITS</Text>
          <Text style={styles.bannerTitle}>13 Healthy Heart Routines</Text>
          <Text style={styles.bannerDesc}>
            Scientifically validated routines to reduce vascular stiffness and support steady blood pressure.
          </Text>
        </View>
        <View style={styles.todayCounter}>
          <Text style={styles.todayNum}>{totalCompletedToday}</Text>
          <Text style={styles.todaySub}>Done Today</Text>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryRow}>
        {(['all', 'habit', 'diet', 'activity', 'mind'] as const).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPill, selectedCategory === cat && styles.catPillActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Challenges Grid */}
      <View style={styles.challengesGrid}>
        {filtered.map((ch) => {
          const isDoneToday = ch.completedDates.includes(todayStr);
          return (
            <View
              key={ch.id}
              style={[styles.challengeCard, isDoneToday && styles.challengeCardDone]}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.iconBox}>
                  <Ionicons name={getIcon(ch.iconName)} size={20} color="#e11d48" />
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.challengeTitle}>{ch.title}</Text>
                  <Text style={styles.challengeDesc} numberOfLines={2}>
                    {ch.description}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBottomRow}>
                <View style={styles.streakBox}>
                  <Ionicons name="flame" size={14} color="#f97316" />
                  <Text style={styles.streakText}>{ch.currentStreak} day streak</Text>
                </View>

                <TouchableOpacity
                  style={[styles.checkBtn, isDoneToday && styles.checkBtnDone]}
                  onPress={() => toggleChallengeDay(ch.id, todayStr)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isDoneToday ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={16}
                    color={isDoneToday ? '#ffffff' : '#047857'}
                  />
                  <Text style={[styles.checkBtnText, isDoneToday && styles.checkBtnTextDone]}>
                    {isDoneToday ? 'Completed' : 'Check In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  banner: {
    backgroundColor: '#ea580c',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fed7aa',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
  bannerDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    lineHeight: 15,
  },
  todayCounter: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  todayNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  todaySub: {
    fontSize: 8,
    fontWeight: '700',
    color: '#fed7aa',
    textTransform: 'uppercase',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  catPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  catTextActive: {
    color: '#ffffff',
  },
  challengesGrid: {
    gap: 10,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 10,
  },
  challengeCardDone: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  challengeDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f97316',
  },
  checkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  checkBtnDone: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  checkBtnTextDone: {
    color: '#ffffff',
  },
});
