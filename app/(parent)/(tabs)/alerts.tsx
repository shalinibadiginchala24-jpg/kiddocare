import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '@/contexts/AppContext';

export default function AlertsScreen() {
  const { alerts, clearAlerts } = useAppContext();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent Alerts</Text>
        {alerts.length > 0 && (
          <TouchableOpacity onPress={clearAlerts}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="warning" size={24} color="#FF3B30" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>{item.message}</Text>
              <Text style={styles.alertTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No alerts active. All good! 👍</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  clearText: {
    color: '#4A90E2',
    fontSize: 16,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 15,
  },
  iconContainer: {
    backgroundColor: '#FFEBEB',
    padding: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  alertTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
