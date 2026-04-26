import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// ── Animated floating input ──────────────────────────────────────────────────
interface AnimatedInputProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  delay?: number;
}

function AnimatedInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  delay = 0,
}: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const focus = useSharedValue(0);

  const borderAnim = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      ['rgba(255,255,255,0.15)', '#A78BFA']
    ),
    backgroundColor: interpolateColor(
      focus.value,
      [0, 1],
      ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.13)']
    ),
    transform: [{ scale: withSpring(focused ? 1.015 : 1, { damping: 15 }) }],
  }));

  const onFocus = () => {
    setFocused(true);
    focus.value = withTiming(1, { duration: 250 });
  };
  const onBlur = () => {
    setFocused(false);
    focus.value = withTiming(0, { duration: 250 });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(700).springify()}
      style={styles.inputWrapper}
    >
      <Animated.View style={[styles.inputBox, borderAnim]}>
        <Ionicons
          name={icon}
          size={20}
          color={focused ? '#C4B5FD' : 'rgba(255,255,255,0.45)'}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onFocus={onFocus}
          onBlur={onBlur}
          selectionColor="#A78BFA"
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPass(!showPass)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="rgba(255,255,255,0.45)"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function ParentLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const btnScale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handleLogin = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password)     { setError('Please enter your password.');       return; }
    setLoading(true);
    setError('');
    btnScale.value = withSpring(0.96, { damping: 12 });
    try {
      await authService.parentLogin(email.trim(), password);
      await AsyncStorage.setItem('activeRole', 'parent');
      router.replace('/(parent)/(tabs)');
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
      btnScale.value = withSpring(1, { damping: 12 });
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0F0024', '#2D0A6E', '#5B21B6', '#7C3AED']}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative glow blobs */}
        <View style={[styles.blob, { top: -120, right: -80, backgroundColor: '#7C3AED' }]} />
        <View style={[styles.blob, { bottom: -80, left: -100, backgroundColor: '#4F46E5', width: 320, height: 320 }]} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.card, isWeb && styles.cardWeb, shakeAnim]}>

              {/* Back button */}
              <Animated.View entering={FadeInDown.duration(500)}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backBtn}
                  id="parent-back-btn"
                >
                  <Ionicons name="arrow-back" size={18} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
              </Animated.View>

              {/* Shield avatar */}
              <Animated.View
                entering={FadeInDown.delay(80).duration(700).springify()}
                style={styles.avatarWrap}
              >
                <LinearGradient
                  colors={['#A78BFA', '#6D28D9']}
                  style={styles.avatar}
                >
                  <Ionicons name="shield-checkmark" size={38} color="#FFF" />
                </LinearGradient>
                <View style={styles.avatarBadge}>
                  <Ionicons name="star" size={11} color="#FCD34D" />
                </View>
              </Animated.View>

              {/* Headline */}
              <Animated.Text
                entering={FadeInDown.delay(160).duration(700)}
                style={styles.title}
              >
                Welcome Back,{'\n'}Parent! 👋
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(210).duration(700)}
                style={styles.subtitle}
              >
                {"Sign in to manage your family's activities"}
              </Animated.Text>

              {/* Error banner */}
              {error ? (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={16} color="#FCA5A5" />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              ) : null}

              {/* Inputs */}
              <AnimatedInput
                icon="mail-outline"
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                delay={280}
              />
              <AnimatedInput
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                delay={350}
              />

              {/* Forgot */}
              <Animated.View
                entering={FadeInDown.delay(420).duration(600)}
                style={styles.forgotRow}
              >
                <TouchableOpacity id="parent-forgot-btn">
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* CTA button */}
              <Animated.View
                entering={FadeInDown.delay(480).duration(700).springify()}
                style={btnAnim}
              >
                <TouchableOpacity
                  id="parent-login-btn"
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={loading ? ['#5B21B6', '#5B21B6'] : ['#C4B5FD', '#8B5CF6', '#5B21B6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.loginBtn}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Text style={styles.loginBtnText}>Sign In</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Divider */}
              <Animated.View
                entering={FadeInDown.delay(540).duration(600)}
                style={styles.divider}
              >
                <View style={styles.dividerLine} />
                <Text style={styles.dividerLabel}>or</Text>
                <View style={styles.dividerLine} />
              </Animated.View>

              {/* Child login link */}
              <Animated.View
                entering={FadeInDown.delay(590).duration(600)}
                style={styles.footerRow}
              >
                <Text style={styles.footerLabel}>Logging in as a child? </Text>
                <TouchableOpacity
                  id="go-child-login-btn"
                  onPress={() => router.replace('/child-login')}
                >
                  <Text style={styles.footerLink}>Child Login →</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Sign up link */}
              <Animated.View
                entering={FadeInDown.delay(630).duration(600)}
                style={styles.footerRow}
              >
                <Text style={styles.footerLabel}>No account? </Text>
                {/* @ts-ignore */}
                <Link href="/parent-signup" asChild>
                  <TouchableOpacity id="go-signup-btn">
                    <Text style={styles.footerLink}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </Animated.View>

            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  blob: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 999,
    opacity: 0.22,
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
    width: 82,
    height: 82,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#1E0A4C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 38,
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
  forgotRow: { alignItems: 'flex-end', marginBottom: 20, marginTop: 2 },
  forgotText: { color: '#C4B5FD', fontSize: 13, fontWeight: '600' },
  loginBtn: {
    borderRadius: 18,
    height: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
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
    marginBottom: 10,
  },
  footerLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  footerLink: { color: '#C4B5FD', fontSize: 14, fontWeight: '700' },
});
