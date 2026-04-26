import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AlertCardProps = {
  title: string;
  message: string;
  type: 'warning' | 'danger' | 'info';
  time: string;
};

export default function AlertCard({ title, message, type, time }: AlertCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'danger': return { name: 'shield-alert', color: '#EF4444' };
      case 'warning': return { name: 'time', color: '#F59E0B' };
      default: return { name: 'information-circle', color: '#3B82F6' };
    }
  };

  const { name, color } = getIcon();

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '1A' }]}>
        <Ionicons name={name as any} size={28} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#F3F4F6',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  }
});
