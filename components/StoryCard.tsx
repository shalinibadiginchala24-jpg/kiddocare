import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CardProps = {
  title: string;
  icon: string;
  color: string;
  subtitle?: string;
};

export function StoryCard({ title, icon, color, subtitle }: CardProps) {
  return (
    <TouchableOpacity style={[styles.storyCard, { backgroundColor: color }]}>
      <View style={styles.storyIcon}>
        <Ionicons name={icon as any} size={32} color={color} />
      </View>
      <View>
        <Text style={styles.storyTitle}>{title}</Text>
        {subtitle && <Text style={styles.storySubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export function FunCard({ title, icon, color }: CardProps) {
  return (
    <TouchableOpacity style={[styles.funCard, { borderColor: color }]}>
      <View style={[styles.funIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={28} color="#FFFFFF" />
      </View>
      <Text style={[styles.funTitle, { color: '#1F2937' }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  storyCard: {
    width: 140,
    height: 180,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  storyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  storySubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  funCard: {
    width: 100,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    borderWidth: 2,
  },
  funIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  funTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  }
});
