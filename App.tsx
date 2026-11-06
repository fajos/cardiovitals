import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { HealthProvider, useHealth } from './src/context/HealthContext';
import { Header } from './src/components/Header';
import { BottomTabBar } from './src/components/BottomTabBar';
import { VitalsHeroCard } from './src/components/VitalsHeroCard';
import { TrendChart } from './src/components/TrendChart';
import { AnalysisCard } from './src/components/AnalysisCard';
import { HistoryList } from './src/components/HistoryList';
import { ChallengesView } from './src/components/ChallengesView';
import { InsightsView } from './src/components/InsightsView';
import { RemindersView } from './src/components/RemindersView';
import { SettingsView } from './src/components/SettingsView';
import { AddVitalModal } from './src/components/AddVitalModal';
import { PPGHeartRateModal } from './src/components/PPGHeartRateModal';
import { FoodScannerModal } from './src/components/FoodScannerModal';
import { MedicalReportModal } from './src/components/MedicalReportModal';

function MainApp() {
  const { bpRecords } = useHealth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Modals state
  const [addVitalOpen, setAddVitalOpen] = useState(false);
  const [addVitalTab, setAddVitalTab] = useState<'bp' | 'hr' | 'sugar' | 'weight' | 'cholesterol' | 'water'>('bp');
  const [ppgOpen, setPpgOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleOpenAddModal = (tab?: 'bp' | 'hr' | 'sugar' | 'weight' | 'cholesterol' | 'water') => {
    setAddVitalTab(tab || 'bp');
    setAddVitalOpen(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Top Application Header */}
      <Header
        onOpenAddModal={() => handleOpenAddModal('bp')}
        onOpenPPG={() => setPpgOpen(true)}
        onOpenScanner={() => setScannerOpen(true)}
        onOpenReport={() => setReportOpen(true)}
      />

      {/* Main Content Area */}
      <View style={styles.content}>
        {currentTab === 'dashboard' && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <VitalsHeroCard
              onOpenAddModal={handleOpenAddModal}
              onOpenPPG={() => setPpgOpen(true)}
            />
            <AnalysisCard records={bpRecords} />
            <TrendChart records={bpRecords} />
          </ScrollView>
        )}

        {currentTab === 'trends' && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TrendChart records={bpRecords} />
            <AnalysisCard records={bpRecords} />
          </ScrollView>
        )}

        {currentTab === 'history' && <HistoryList />}

        {currentTab === 'challenges' && <ChallengesView />}

        {currentTab === 'insights' && <InsightsView />}

        {currentTab === 'reminders' && <RemindersView />}

        {currentTab === 'settings' && <SettingsView />}
      </View>

      {/* Persistent Bottom Floating Navigation */}
      <BottomTabBar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Action Modals */}
      {addVitalOpen && (
        <AddVitalModal
          initialTab={addVitalTab}
          onClose={() => setAddVitalOpen(false)}
        />
      )}

      {ppgOpen && (
        <PPGHeartRateModal onClose={() => setPpgOpen(false)} />
      )}

      {scannerOpen && (
        <FoodScannerModal onClose={() => setScannerOpen(false)} />
      )}

      {reportOpen && (
        <MedicalReportModal onClose={() => setReportOpen(false)} />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <HealthProvider>
      <MainApp />
    </HealthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
});
