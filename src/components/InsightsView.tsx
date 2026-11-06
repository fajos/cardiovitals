import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../context/HealthContext';
import { InsightArticle } from '../types';

export const InsightsView: React.FC = () => {
  const { articles, toggleBookmarkArticle } = useHealth();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [readingArticle, setReadingArticle] = useState<InsightArticle | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'blood_pressure', label: 'Blood Pressure' },
    { id: 'heart', label: 'Heart & Pulse' },
    { id: 'diet', label: 'DASH & Diet' },
    { id: 'cholesterol', label: 'Cholesterol' },
    { id: 'sugar', label: 'Blood Sugar' },
  ];

  const filtered = articles.filter(
    (a) => selectedCat === 'all' || a.category === selectedCat
  );

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTag}>CLINICAL KNOWLEDGE BASE</Text>
        <Text style={styles.bannerTitle}>Medical Guides & Insights</Text>
        <Text style={styles.bannerDesc}>
          Evidence-based educational guides curated by certified cardiologists and nutritionists.
        </Text>
      </View>

      {/* Categories */}
      <View style={styles.catRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.catPill, selectedCat === c.id && styles.catPillActive]}
            onPress={() => setSelectedCat(c.id)}
          >
            <Text style={[styles.catText, selectedCat === c.id && styles.catTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Articles List */}
      <View style={styles.articlesList}>
        {filtered.map((art) => (
          <TouchableOpacity
            key={art.id}
            style={styles.articleCard}
            onPress={() => setReadingArticle(art)}
            activeOpacity={0.7}
          >
            <View style={styles.artTopRow}>
              <View style={styles.artCatBadge}>
                <Text style={styles.artCatText}>{art.category.replace('_', ' ')}</Text>
              </View>
              <View style={styles.readTimeRow}>
                <Ionicons name="time-outline" size={12} color="#94a3b8" />
                <Text style={styles.readTimeText}>{art.readTimeMin} min read</Text>
              </View>
            </View>

            <Text style={styles.artTitle}>{art.title}</Text>
            <Text style={styles.artSummary} numberOfLines={2}>
              {art.summary}
            </Text>

            <View style={styles.artBottomRow}>
              <View style={styles.reviewRow}>
                <Ionicons name="checkmark-done-circle" size={14} color="#10b981" />
                <Text style={styles.reviewerText}>Dr. Reviewed</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleBookmarkArticle(art.id)}
                style={styles.bookmarkBtn}
              >
                <Ionicons
                  name={art.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={art.isBookmarked ? '#e11d48' : '#94a3b8'}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reader Modal */}
      {readingArticle && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTag}>{readingArticle.category.replace('_', ' ')}</Text>
                <TouchableOpacity onPress={() => setReadingArticle(null)}>
                  <Ionicons name="close" size={22} color="#0f172a" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
                <Text style={styles.modalArticleTitle}>{readingArticle.title}</Text>
                <Text style={styles.modalMeta}>
                  By {readingArticle.author} • Reviewed by {readingArticle.reviewedBy}
                </Text>

                {/* Key takeaways */}
                <View style={styles.takeawaysBox}>
                  <Text style={styles.takeawaysHeader}>KEY CLINICAL TAKEAWAYS</Text>
                  {readingArticle.keyTakeaways.map((k, idx) => (
                    <View key={idx} style={styles.takeawayItem}>
                      <Ionicons name="checkmark-circle" size={14} color="#e11d48" />
                      <Text style={styles.takeawayText}>{k}</Text>
                    </View>
                  ))}
                </View>

                {/* Body paragraphs */}
                {readingArticle.content.map((p, idx) => (
                  <Text key={idx} style={styles.bodyParagraph}>
                    {p}
                  </Text>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.closeModalBtn}
                  onPress={() => setReadingArticle(null)}
                >
                  <Text style={styles.closeModalBtnText}>Close Article</Text>
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
  banner: {
    backgroundColor: '#2563eb',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#bfdbfe',
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
  catRow: {
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
  articlesList: {
    gap: 10,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 8,
  },
  artTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  artCatBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  artCatText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  readTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  artTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  artSummary: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
  },
  artBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10b981',
  },
  bookmarkBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
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
  modalTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#e11d48',
    textTransform: 'uppercase',
  },
  modalScroll: {
    maxHeight: 520,
  },
  modalScrollContent: {
    padding: 20,
    gap: 12,
  },
  modalArticleTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 26,
  },
  modalMeta: {
    fontSize: 11,
    color: '#64748b',
  },
  takeawaysBox: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  takeawaysHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#e11d48',
    letterSpacing: 0.5,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  takeawayText: {
    flex: 1,
    fontSize: 11,
    color: '#9f1239',
    lineHeight: 15,
  },
  bodyParagraph: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  closeModalBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeModalBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
