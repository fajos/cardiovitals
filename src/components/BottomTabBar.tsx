import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomTabBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Vitals', icon: 'pulse' },
    { id: 'trends', label: 'Trends', icon: 'trending-up' },
    { id: 'history', label: 'Logs', icon: 'list' },
    { id: 'challenges', label: 'Habits', icon: 'trophy' },
    { id: 'insights', label: 'Guides', icon: 'book' },
    { id: 'reminders', label: 'Alarms', icon: 'alarm' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab) => {
        const isSelected = currentTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrapper, isSelected && styles.iconWrapperActive]}>
              <Ionicons
                name={(isSelected ? tab.icon : `${tab.icon}-outline`) as any}
                size={20}
                color={isSelected ? '#e11d48' : '#94a3b8'}
              />
            </View>
            <Text style={[styles.tabLabel, isSelected && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {isSelected && <View style={styles.indicatorDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingVertical: 6,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    padding: 4,
    borderRadius: 8,
  },
  iconWrapperActive: {
    backgroundColor: '#fff1f2',
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#e11d48',
    fontWeight: '800',
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e11d48',
    position: 'absolute',
    top: 2,
  },
});
