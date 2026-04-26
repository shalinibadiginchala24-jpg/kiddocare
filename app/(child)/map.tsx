import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { alertService } from '@/services/alertService';
import SafeMapView from '@/components/SafeMapView';

export default function ChildJourneyMap() {
  const router = useRouter();
  const [checkedIn, setCheckedIn] = React.useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState('Getting your location...');
  const [loadingLoc, setLoadingLoc] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Location permission denied');
        setLoadingLoc(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = loc.coords;
        setCoords({ latitude, longitude });

        // Reverse geocode to get readable address
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          const parts = [place.name, place.district, place.city, place.region].filter(Boolean);
          setLocationName(parts.slice(0, 2).join(', '));
        } else {
          setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch {
        setLocationName('Could not get location');
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  const handleCheckIn = async () => {
    setCheckedIn(true);
    Alert.alert('✅ Checked In!', 'Your parents have been notified that you are safe! 🌟');
    try {
      const childId = await AsyncStorage.getItem('childId');
      const childName = await AsyncStorage.getItem('childName') || 'Your child';
      if (childId) {
        const locStr = coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'unknown';
        await alertService.addAlert(
          childId,
          `📍 LOCATION CHECK-IN: ${childName} is safe at "${locationName}" (${locStr}).`,
          'info'
        );
      }
    } catch (e) {}
  };

  const region = coords
    ? { latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }
    : { latitude: 20.5937, longitude: 78.9629, latitudeDelta: 10, longitudeDelta: 10 };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#FF6B6B', '#EE5253']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My Journey Map 🗺️</Text>
        <View style={{ width: 44 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapArea}>
          <Animated.View entering={ZoomIn.duration(800)} style={styles.mapCard}>
            {loadingLoc ? (
              <View style={styles.mapLoading}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={styles.loadingTxt}>Getting your location...</Text>
              </View>
            ) : (
              <SafeMapView
                style={styles.map}
                initialRegion={region}
                markers={coords ? [
                  {
                    coordinate: coords,
                    title: 'You are here! 🧒',
                    description: locationName,
                    customView: (
                      <View style={styles.avatarMarker}>
                        <Text style={{ fontSize: 24 }}>🧒</Text>
                      </View>
                    )
                  }
                ] : []}
              />
            )}
          </Animated.View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Your Location</Text>
          <Animated.View entering={FadeInDown.delay(400)} style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Text style={styles.iconEmoji}>📍</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.statusTitle}>{loadingLoc ? 'Locating...' : locationName}</Text>
              <Text style={styles.statusSub}>
                {coords ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}` : 'Live GPS Active'}
              </Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveTxt}>LIVE</Text>
            </View>
          </Animated.View>

          <TouchableOpacity 
            style={[styles.checkInBtn, checkedIn && styles.checkedInBtn]} 
            onPress={handleCheckIn}
            disabled={checkedIn || loadingLoc}
          >
            <LinearGradient
              colors={checkedIn ? ['#10B981', '#059669'] : ['#FF6B6B', '#EE5253']}
              style={styles.btnGradient}
            >
              <Ionicons name={checkedIn ? "shield-checkmark" : "notifications"} size={22} color="#FFF" style={{ marginRight: 10 }} />
              <Text style={styles.btnText}>{checkedIn ? "Safe & Checked In! ✅" : "I'm Safe — Check In"}</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.footerNote}>Tap to send your live location to your parents instantly! ✨</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F5' },
  header: { 
    paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20, 
    flexDirection: 'row', alignItems: 'center',
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    elevation: 5, shadowColor: '#FF6B6B', shadowOpacity: 0.2, shadowRadius: 15
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '900', color: '#FFF', flex: 1, textAlign: 'center' },
  scrollContent: { paddingBottom: 40 },
  mapArea: { padding: 24 },
  mapCard: { width: '100%', height: 340, borderRadius: 32, overflow: 'hidden', elevation: 8, shadowOpacity: 0.1, shadowRadius: 20 },
  map: { flex: 1 },
  mapLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F5' },
  loadingTxt: { marginTop: 12, fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  avatarMarker: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 6, borderWidth: 2, borderColor: '#FF6B6B' },
  infoSection: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#4B5563', marginBottom: 16 },
  statusCard: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    elevation: 4, shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 24,
    borderWidth: 1, borderColor: '#FEE2E2'
  },
  statusIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center' },
  iconEmoji: { fontSize: 28 },
  statusTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  statusSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2, fontWeight: '600' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 4 },
  liveTxt: { fontSize: 10, fontWeight: '900', color: '#059669' },
  checkInBtn: { height: 64, borderRadius: 20, overflow: 'hidden', elevation: 4, shadowOpacity: 0.2, shadowRadius: 10 },
  checkedInBtn: { elevation: 0, opacity: 0.9 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  footerNote: { textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginTop: 16, fontWeight: '500', paddingHorizontal: 20 }
});
