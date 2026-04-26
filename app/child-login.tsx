import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  withSpring,
  ZoomIn,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { childService } from '@/services/childService';

const isWeb = Platform.OS === 'web';
const PIN_LENGTH = 4;

// ── Animated text input ──────────────────────────────────────────────────────
interface AnimatedInputProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  delay?: number;
}

function AnimatedInput({ icon, placeholder, value, onChangeText, delay = 0 }: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  const boxAnim = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], ['rgba(255,255,255,0.15)', '#F9A8D4']),
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.13)']
    ),
    transform: [{ scale: withSpring(focused ? 1.015 : 1, { damping: 15 }) }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(700).springify()} style={styles.inputWrapper}>
      <Animated.View style={[styles.inputBox, boxAnim]}>
        <Ionicons
          name={icon}
          size={20}
          color={focused ? '#F9A8D4' : 'rgba(255,255,255,0.45)'}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          selectionColor="#F9A8D4"
          onFocus={() => { setFocused(true); focus.value = withTiming(1, { duration: 250 }); }}
          onBlur={() => { setFocused(false); focus.value = withTiming(0, { duration: 250 }); }}
        />
      </Animated.View>
    </Animated.View>
  );
}

// ── PIN dot ──────────────────────────────────────────────────────────────────
function PinDot({ filled, active }: { filled: boolean; active: boolean }) {
  const scale = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(filled ? 1 : 0, { damping: 12, stiffness: 200 });
  }, [filled, scale]);

  const dotAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <View style={[styles.pinCircle, active && styles.pinCircleActive, filled && styles.pinCircleFilled]}>
      <Animated.View style={[styles.pinDot, dotAnim]} />
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function ChildLogin() {
  const router = useRouter();
  const [childId, setChildId] = useState('');


  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Shake animation
  const shakeX = useSharedValue(0);
  const shakeAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const triggerShake = React.useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-12, { duration: 55 }),
      withRepeat(withTiming(12, { duration: 55 }), 4, true),
      withTiming(0, { duration: 55 })
    );
  }, [shakeX]);

  const handleLogin = React.useCallback(async (currentPin: string) => {
    if (!childId.trim()) {
      setError('Please enter your Child ID.');
      triggerShake();
      setPin('');
      return;
    }
    setLoading(true);
    setError('');
    Keyboard.dismiss();
    try {
      const child = await childService.validateChildLogin(childId.trim(), currentPin);
      await AsyncStorage.setItem('childId', child.id);
      await AsyncStorage.setItem('childName', (child as any).name || '');
      await AsyncStorage.setItem('activeRole', 'child');
      await AsyncStorage.setItem('lastChildId', child.id);
      setSuccess(true);
      setTimeout(() => router.replace('/(child)/(tabs)'), 600);
    } catch {
      setError('Incorrect Child ID or PIN. Please try again.');
      triggerShake();
      setTimeout(() => setPin(''), 500);
    } finally {
      setLoading(false);
    }
  }, [childId, router, triggerShake]);

  // Auto-submit when 4 digits entered
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleLogin(pin);
    }
  }, [pin, handleLogin]);

  const handleKeyPress = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1A0030', '#6B0050', '#C2185B', '#E91E8C']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        {/* Glow blobs */}
        <View style={[styles.blob, { top: -100, left: -80, backgroundColor: '#E91E8C' }]} />
        <View style={[styles.blob, { bottom: -60, right: -100, backgroundColor: '#7C3AED', width: 300, height: 300 }]} />

        <ScrollView
          contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, isWeb && styles.cardWeb]}>

            {/* Back button */}
            <Animated.View entering={FadeInDown.duration(500)}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backBtn}
                id="child-back-btn"
              >
                <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </Animated.View>

            {/* Avatar */}
            <Animated.View
              entering={ZoomIn.delay(80).duration(700).springify()}
              style={styles.avatarWrap}
            >
              <LinearGradient
                colors={['#F472B6', '#DB2777']}
                style={styles.avatar}
              >
                {success ? (
                  <Ionicons name="checkmark-circle" size={44} color="#FFF" />
                ) : (
                  <Text style={styles.avatarEmoji}>🧒</Text>
                )}
              </LinearGradient>
              <View style={styles.avatarBadge}>
                <Text style={{ fontSize: 11 }}>⭐</Text>
              </View>
            </Animated.View>

            {/* Headline */}
            <Animated.Text
              entering={FadeInDown.delay(160).duration(700)}
              style={styles.title}
            >
              Hey there, Kiddo! 👋
            </Animated.Text>
            <Animated.Text
              entering={FadeInDown.delay(210).duration(700)}
              style={styles.subtitle}
            >
              Enter your Child ID and secret PIN
            </Animated.Text>

            {/* Error */}
            {error ? (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#FCA5A5" />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            ) : null}

            {/* Child ID input */}
            <AnimatedInput
              icon="person-outline"
              placeholder="Child ID (from parent)"
              value={childId}
              onChangeText={setChildId}
              delay={280}
            />

            {/* PIN section */}
            <Animated.Text
              entering={FadeInDown.delay(340).duration(600)}
              style={styles.pinLabel}
            >
              Enter your 4-digit PIN
            </Animated.Text>

            {/* PIN circles */}
            <Animated.View
              entering={FadeInDown.delay(380).duration(700).springify()}
              style={[styles.pinRow, shakeAnim]}
            >
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <PinDot key={i} filled={i < pin.length} active={i === pin.length} />
              ))}
            </Animated.View>

            {/* Custom keypad */}
            <Animated.View
              entering={FadeInUp.delay(440).duration(700).springify()}
              style={styles.keypad}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="large" color="#F9A8D4" />
                  <Text style={styles.loadingText}>Checking...</Text>
                </View>
              ) : (
                <>
                  {[['1','2','3'],['4','5','6'],['7','8','9']].map((row, ri) => (
                    <View key={ri} style={styles.keyRow}>
                      {row.map(digit => (
                        <TouchableOpacity
                          key={digit}
                          id={`pin-key-${digit}`}
                          style={styles.keyBtn}
                          onPress={() => handleKeyPress(digit)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.keyText}>{digit}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                  <View style={styles.keyRow}>
                    <View style={styles.keyBtnEmpty} />
                    <TouchableOpacity
                      id="pin-key-0"
                      style={styles.keyBtn}
                      onPress={() => handleKeyPress('0')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.keyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      id="pin-key-del"
                      style={[styles.keyBtn, styles.keyBtnDel]}
                      onPress={handleBackspace}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="backspace-outline" size={22} color="rgba(255,255,255,0.8)" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Animated.View>

            {/* Divider */}
            <Animated.View
              entering={FadeInDown.delay(520).duration(600)}
              style={styles.divider}
            >
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>or</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            {/* Parent login link */}
            <Animated.View
              entering={FadeInDown.delay(560).duration(600)}
              style={styles.footerRow}
            >
              <Text style={styles.footerLabel}>Are you a parent? </Text>
              <TouchableOpacity
                id="go-parent-login-btn"
                onPress={() => router.replace('/parent-login')}
              >
                <Text style={styles.footerLink}>Parent Login →</Text>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  blob: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 999,
    opacity: 0.2,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  scrollWeb: { alignItems: 'center' },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 16,
  },
  cardWeb: { maxWidth: 440, width: '100%' },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 22,
    position: 'relative',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DB2777',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
  },
  avatarEmoji: { fontSize: 44, lineHeight: 52 },
  avatarBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: '#1A0030',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.28)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { color: '#FCA5A5', fontSize: 13, flex: 1 },
  inputWrapper: { marginBottom: 14 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 58,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#FFFFFF', height: '100%' },
  pinLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 28,
  },
  pinCircle: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinCircleActive: {
    borderColor: '#F9A8D4',
    borderWidth: 2.5,
  },
  pinCircleFilled: {
    backgroundColor: 'rgba(249,168,212,0.15)',
    borderColor: '#F472B6',
  },
  pinDot: {
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#F472B6',
    shadowColor: '#F472B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  keypad: { marginBottom: 8 },
  loadingRow: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 14,
  },
  keyBtn: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  keyBtnDel: {
    backgroundColor: 'rgba(248,113,113,0.14)',
    borderColor: 'rgba(248,113,113,0.25)',
  },
  keyBtnEmpty: { width: 72 },
  keyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.11)' },
  dividerLabel: { color: 'rgba(255,255,255,0.28)', fontSize: 12 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  footerLink: { color: '#F9A8D4', fontSize: 14, fontWeight: '700' },
});
