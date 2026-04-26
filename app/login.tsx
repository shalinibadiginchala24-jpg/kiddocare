import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelect = (role: 'parent' | 'child') => {
    if (role === 'parent') {
      router.push('/parent-login');
    } else {
      router.push('/child-login');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text 
        entering={FadeInDown.duration(800).easing(Easing.out(Easing.exp))} 
        style={styles.title}
      >
        Welcome Back!
      </Animated.Text>
      <Animated.Text 
        entering={FadeInDown.duration(800).delay(100).easing(Easing.out(Easing.exp))} 
        style={styles.subtitle}
      >
        Who is logging in today?
      </Animated.Text>

      <View style={styles.optionsContainer}>
        {/* Parent Option */}
        <Animated.View entering={FadeInDown.duration(800).delay(200).easing(Easing.out(Easing.exp))}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => handleRoleSelect('parent')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="shield-checkmark" size={40} color="#4F46E5" />
            </View>
            <Text style={styles.optionTitle}>Parent Login</Text>
            <Text style={styles.optionSubtitle}>Manage settings and track progress</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Child Option */}
        <Animated.View entering={FadeInDown.duration(800).delay(300).easing(Easing.out(Easing.exp))}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => handleRoleSelect('child')}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="happy" size={40} color="#DB2777" />
            </View>
            <Text style={styles.optionTitle}>Child Login</Text>
            <Text style={styles.optionSubtitle}>Complete tasks, earn rewards!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 50,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
