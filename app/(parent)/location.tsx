import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import SafeMapView from '@/components/SafeMapView';

export default function LocationTracking() {
  const router = useRouter();
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationName, setLocationName] = useState('Locating child...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName('Location permission denied');
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = loc.coords;
        setCoords({ latitude, longitude });
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          const parts = [place.name, place.district, place.city, place.region].filter(Boolean);
          setLocationName(parts.slice(0, 2).join(', ') || 'Current Location');
        } else {
          setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch {
        setLocationName('Location unavailable');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const region = coords
    ? { latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }
    : { latitude: 20.5937, longitude: 78.9629, latitudeDelta: 10, longitudeDelta: 10 };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#4F46E5', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Location</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statusCard}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusLabel}>📍 Child is currently at</Text>
            <Text style={styles.statusValue}>{loading ? 'Locating...' : locationName}</Text>
            {coords && (
              <Text style={styles.coordsText}>{coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}</Text>
            )}
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.badgeText}>Live</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.delay(300)} style={styles.mapContainer}>
          {loading ? (
            <View style={styles.mapLoader}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loaderTxt}>Getting real-time location...</Text>
            </View>
          ) : (
            <SafeMapView
              style={styles.map}
              initialRegion={region}
              markers={coords ? [
                {
                  coordinate: coords,
                  title: "Child's Location",
                  description: locationName,
                  customView: (
                    <View style={styles.avatarMarker}>
                      <Text style={{ fontSize: 26 }}>👶</Text>
                    </View>
                  )
                }
              ] : []}
            />
          )}
        </Animated.View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Safe Zones</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Manage</Text></TouchableOpacity>
        </View>

        <View style={styles.zonesRow}>
          <TouchableOpacity style={styles.zoneCard}>
            <View style={[styles.zoneIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="home" size={24} color="#2563EB" />
            </View>
            <Text style={styles.zoneName}>Home</Text>
            <Text style={styles.zoneStatus}>Safe Zone</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.zoneCard}>
            <View style={[styles.zoneIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="school" size={24} color="#D97706" />
            </View>
            <Text style={styles.zoneName}>School</Text>
            <Text style={styles.zoneStatus}>Safe Zone</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addZoneCard}>
            <Ionicons name="add-circle-outline" size={32} color="#9CA3AF" />
            <Text style={styles.addZoneText}>Add Zone</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <Animated.View entering={FadeInDown.delay(400)} style={styles.historyCard}>
          {[
            { time: 'Just Now', action: `At "${loading ? '...' : locationName}"`, dot: '#4F46E5' },
            { time: 'Today 09:00 AM', action: 'Arrived at School', dot: '#10B981' },
            { time: 'Today 08:30 AM', action: 'Left Home', dot: '#F59E0B' },
          ].map((item, i) => (
            <View key={i} style={styles.historyItem}>
              <View style={styles.timeline}>
                <View style={[styles.timelineDot, { backgroundColor: item.dot }]} />
                {i < 2 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTime}>{item.time}</Text>
                <Text style={styles.historyAction}>{item.action}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  statusCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusInfo: { flex: 1 },
  statusLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600' },
  statusValue: { color: '#FFF', fontSize: 17, fontWeight: '800', marginTop: 4 },
  coordsText: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 3, fontWeight: '500' },
  statusBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 6 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  mapContainer: { width: '100%', height: 280, borderRadius: 24, overflow: 'hidden', backgroundColor: '#FFF', marginBottom: 32, elevation: 6, shadowOpacity: 0.1, shadowRadius: 10 },
  map: { flex: 1 },
  mapLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderTxt: { marginTop: 12, fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  avatarMarker: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 6, borderWidth: 2, borderColor: '#4F46E5' },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  seeAll: { color: '#4F46E5', fontWeight: '700', fontSize: 14 },
  zonesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  zoneCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, width: (width - 68) / 3, alignItems: 'center', elevation: 2 },
  zoneIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  zoneName: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
  zoneStatus: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  addZoneCard: { width: (width - 68) / 3, borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', minHeight: 100 },
  addZoneText: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', marginTop: 4 },
  historyCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2 },
  historyItem: { flexDirection: 'row', minHeight: 60 },
  timeline: { width: 20, alignItems: 'center' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, zIndex: 2 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginTop: 4 },
  historyInfo: { marginLeft: 16, flex: 1, paddingBottom: 10 },
  historyTime: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  historyAction: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginTop: 3 }
});
