import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { authService } from "@/services/authService";
import { childService } from "@/services/childService";
import { rewardService } from "@/services/rewardService";
import { alertService } from "@/services/alertService";

const { width } = Dimensions.get("window");

// Unique pastel palette per child
const CHILD_PALETTES = [
  { bg: ['#FFD1DC', '#FFB7C5'] as const, chipBg: '#FFF0F4', dot: '#FF6B9D' },
  { bg: ['#B5EAD7', '#98FB98'] as const, chipBg: '#F0FFF8', dot: '#6BCB77' },
  { bg: ['#C7CEEA', '#E2D1F9'] as const, chipBg: '#F5F0FF', dot: '#9B87F5' },
  { bg: ['#FFDAC1', '#FFB347'] as const, chipBg: '#FFF8F0', dot: '#FF9F43' },
  { bg: ['#B2E2F2', '#A1C4FD'] as const, chipBg: '#F0F8FF', dot: '#4D96FF' },
  { bg: ['#FFF9C4', '#FFF176'] as const, chipBg: '#FFFFF0', dot: '#F9CA24' },
];

export default function ParentHome() {
  const router = useRouter();
  const [parentId, setParentId] = useState<string | null>(null);
  const [parentName, setParentName] = useState("");
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [childStars, setChildStars] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Child Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildId, setNewChildId] = useState("");
  const [newChildPin, setNewChildPin] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Edit Child Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editChildName, setEditChildName] = useState("");
  const [editChildPin, setEditChildPin] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const pid = await AsyncStorage.getItem("parentId");
        const pName = await AsyncStorage.getItem("parentName");
        if (pName) setParentName(pName);
        if (pid) {
          setParentId(pid);
          const kids = await childService.getChildrenByParent(pid);
          setChildren(kids);
          if (kids.length > 0) setSelectedChildId(kids[0].id);
        } else {
          router.replace("/login");
        }
      } catch (e) {
        console.log("Init error", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchMisc = async (childId: string) => {
    try {
      const s = await rewardService.getRewards(childId);
      setChildStars(s);
      
      // Subscribe to real-time alerts
      const unsubscribe = alertService.subscribeToAlerts(childId, (newAlerts) => {
        setAlerts(newAlerts);
      });
      
      return unsubscribe;
    } catch (e) {
      console.log("Misc fetch error", e);
    }
  };

  useEffect(() => {
    let unsubscribe: any;
    if (selectedChildId) {
      fetchMisc(selectedChildId).then((unsub) => {
        unsubscribe = unsub;
      });
    }
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedChildId]);

  const handleAddChild = async () => {
    if (!newChildName.trim() || newChildPin.length !== 4) {
      Alert.alert("Missing Info", "Please enter a name and a 4-digit PIN.");
      return;
    }
    if (!parentId) return;
    setIsAdding(true);
    try {
      const child = await childService.createChild(
        parentId,
        newChildName.trim(),
        newChildPin,
        newChildId.trim(),
      );
      setChildren((prev) => [...prev, child]);
      setSelectedChildId(child.id);
      setModalVisible(false);
      setNewChildName("");
      setNewChildId("");
      setNewChildPin("");
      Alert.alert(
        "🎉 Child Account Created!",
        `Share these credentials with your child:\n\n📋 Child Login ID:\n${child.id}\n\n🔒 PIN: ${child.pin}\n\nSave this somewhere safe!`,
        [{ text: "Got it!", style: "default" }],
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not add child.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditChild = async () => {
    if (!editChildName.trim() || editChildPin.length !== 4) {
      Alert.alert("Missing Info", "Please enter a name and a 4-digit PIN.");
      return;
    }
    if (!selectedChildId) return;
    setIsEditing(true);
    try {
      await childService.updateChild(selectedChildId, {
        name: editChildName.trim(),
        pin: editChildPin,
      });
      setChildren((prev) =>
        prev.map((c) =>
          c.id === selectedChildId
            ? { ...c, name: editChildName.trim(), pin: editChildPin }
            : c,
        ),
      );
      setEditModalVisible(false);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not update child.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteChild = () => {
    Alert.alert(
      "Delete Child Profile",
      "Are you sure you want to permanently delete this child's profile? This action will remove their login access.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!selectedChildId) return;
            try {
              await childService.deleteChild(selectedChildId);
              const remaining = children.filter(
                (c) => c.id !== selectedChildId,
              );
              setChildren(remaining);
              if (remaining.length > 0) {
                setSelectedChildId(remaining[0].id);
              } else {
                setSelectedChildId(null);
                setChildStars(0);
                setAlerts([]);
              }
            } catch (e: any) {
              Alert.alert("Error", e.message || "Could not delete child.");
            }
          },
        },
      ],
    );
  };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  if (loading) {
    return (
      <LinearGradient
        colors={["#4C1D95", "#7C3AED", "#A78BFA"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#FFF" />
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F3FF" }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Premium Header Gradient */}
        <LinearGradient
          colors={["#3B0764", "#5B21B6", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerGreeting}>Good morning 👋</Text>
              <Text style={styles.headerName}>{parentName || "Parent"}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={async () => {
                await authService.logout('parent');
                router.replace("/login");
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color="rgba(255,255,255,0.8)"
              />
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <Animated.View entering={ZoomIn.delay(100)} style={styles.statCard}>
              <Text style={styles.statNumber}>{children.length}</Text>
              <Text style={styles.statLabel}>Children</Text>
            </Animated.View>
            <Animated.View entering={ZoomIn.delay(200)} style={styles.statCard}>
              <Text style={styles.statNumber}>{childStars}</Text>
              <Text style={styles.statLabel}>Stars ⭐</Text>
            </Animated.View>
            <Animated.View entering={ZoomIn.delay(300)} style={styles.statCard}>
              <Text style={styles.statNumber}>{alerts.length}</Text>
              <Text style={styles.statLabel}>Alerts 🔔</Text>
            </Animated.View>
          </View>
        </LinearGradient>

        {/* Child Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Children</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {children.map((c, i) => {
              const palette = CHILD_PALETTES[i % CHILD_PALETTES.length];
              const isActive = selectedChildId === c.id;
              return (
                <Animated.View key={c.id} entering={FadeInUp.delay(i * 80)}>
                  <TouchableOpacity
                    style={[
                      styles.childChip,
                      { backgroundColor: isActive ? palette.chipBg : '#FFF', borderColor: isActive ? palette.dot : '#E5E7EB', borderWidth: 2 },
                    ]}
                    onPress={() => setSelectedChildId(c.id)}
                  >
                    <LinearGradient colors={palette.bg} style={styles.childAvatar}>
                      <Text style={styles.childAvatarText}>
                        {c.name?.[0]?.toUpperCase() || "?"}
                      </Text>
                    </LinearGradient>
                    <Text style={[styles.childChipText, isActive && { color: palette.dot, fontWeight: '900' }]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
            <TouchableOpacity
              style={styles.addChildChip}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={22} color="#7C3AED" />
              <Text style={styles.addChildText}>Add Child</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Selected Child Card */}
        {selectedChild ? (
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={styles.section}
          >
            <LinearGradient
              colors={CHILD_PALETTES[children.findIndex(c => c.id === selectedChildId) % CHILD_PALETTES.length]?.bg ?? ["#7C3AED", "#A78BFA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.childCard}
            >
              <View style={styles.childCardAvatar}>
                <Text style={styles.childCardAvatarText}>
                  {selectedChild.name?.[0]?.toUpperCase()}
                </Text>
              </View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={styles.childCardName}>{selectedChild.name}</Text>
                <Text style={styles.childCardSub}>
                  ⭐ {childStars} stars earned
                </Text>
                <View style={styles.credentialsBox}>
                  <Text style={styles.credLabel}>
                    Login ID:{" "}
                    <Text style={styles.credText} selectable={true}>{selectedChild.id}</Text>
                  </Text>
                  <Text style={styles.credLabel}>
                    PIN:{" "}
                    <Text style={styles.credText} selectable={true}>{selectedChild.pin}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.childCardRight}>
                <View style={styles.actionBtnRow}>
                  <TouchableOpacity
                    style={styles.smIconBtn}
                    onPress={() => {
                      setEditChildName(selectedChild.name);
                      setEditChildPin(selectedChild.pin);
                      setEditModalVisible(true);
                    }}
                  >
                    <Ionicons name="pencil" size={16} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.smIconBtn,
                      { backgroundColor: "rgba(239,68,68,0.9)" },
                    ]}
                    onPress={handleDeleteChild}
                  >
                    <Ionicons name="trash" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => router.push("/(parent)/(tabs)/tasks")}
                >
                  <Text style={styles.viewBtnText}>Assign Tasks</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown}
            style={[styles.section, styles.emptyBox]}
          >
            <Ionicons name="people" size={52} color="#DDD6FE" />
            <Text style={styles.emptyTitle}>No children yet</Text>
            <Text style={styles.emptySub}>{'Tap "Add Child" to get started!'}</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyBtnText}>+ Add Your First Child</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Two-Way Communication & Activity Log */}
        {selectedChildId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Two-Way Communication Hub 💬</Text>
            <View style={styles.hubCard}>
              {alerts.length === 0 ? (
                <View style={styles.emptyHub}>
                  <Ionicons name="chatbubbles-outline" size={40} color="#A78BFA" />
                  <Text style={styles.emptyHubTxt}>No direct interactions logged yet.</Text>
                </View>
              ) : (
                <View style={{ padding: 15 }}>
                  {alerts.map((al, index) => (
                    <Animated.View 
                       key={al.id || index} 
                       entering={FadeInUp.delay(index * 80)} 
                       style={[styles.messageRow, al.type === 'danger' && styles.messageRowDanger]}
                    >
                      <View style={[styles.messageIconWrap, { backgroundColor: al.type === 'danger' ? '#FEE2E2' : '#F5F3FF' }]}>
                        <Ionicons 
                           name={al.type === 'danger' ? "warning" : "mail"} 
                           size={20} 
                           color={al.type === 'danger' ? "#EF4444" : "#7C3AED"} 
                        />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.messageTextContent, al.type === 'danger' && { color: '#B91C1C', fontWeight: '800' }]}>{al.message}</Text>
                        <Text style={styles.messageTime}>Child Update</Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              {
                label: "Chat with Child",
                icon: "chatbubbles-outline",
                color: "#EC4899",
                bg: "#FDF2F8",
                route: `/(parent)/chat?childId=${selectedChildId}&childName=${selectedChild?.name || 'Child'}`,
              },
              {
                label: "Assign Tasks",
                icon: "list",
                color: "#7C3AED",
                bg: "#EDE9FE",
                route: "/(parent)/(tabs)/tasks",
              },
              {
                label: "Live Location",
                icon: "location-outline",
                color: "#10B981",
                bg: "#D1FAE5",
                route: "/(parent)/location",
              },
              {
                label: "AI Assistant",
                icon: "chatbubble-ellipses-outline",
                color: "#8B5CF6",
                bg: "#F5F3FF",
                route: "/(parent)/ai-assistant",
              },
              {
                label: "View Activity",
                icon: "time-outline",
                color: "#F59E0B",
                bg: "#FEF3C7",
                route: "/(parent)/(tabs)/activity",
              },
              {
                label: "Safety Alerts",
                icon: "shield-checkmark-outline",
                color: "#EF4444",
                bg: "#FEE2E2",
                route: "/(parent)/(tabs)/alerts",
              },
            ].map((item, i) => (
              <Animated.View
                key={item.label}
                entering={FadeInDown.delay(i * 80)}
                style={{ width: "48%" }}
              >
                <TouchableOpacity
                  style={[styles.actionCard, { backgroundColor: item.bg }]}
                  onPress={() => router.push(item.route as any)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={32}
                    color={item.color}
                  />
                  <Text style={[styles.actionLabel, { color: item.color }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {alerts.slice(0, 2).map((al, i) => (
              <Animated.View
                key={al.id || i}
                entering={FadeInDown.delay(i * 100)}
                style={styles.alertRow}
              >
                <View
                  style={[
                    styles.alertDot,
                    {
                      backgroundColor:
                        al.type === "danger" ? "#EF4444" : "#F59E0B",
                    },
                  ]}
                />
                <Text style={styles.alertText}>{al.message}</Text>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Child Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.overlay}>
          <Animated.View
            entering={ZoomIn.duration(300)}
            style={styles.modalBox}
          >
            <LinearGradient
              colors={["#5B21B6", "#7C3AED"]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Add a New Child 👧👦</Text>
              <Text style={styles.modalSub}>
                Create login credentials for your child
              </Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>{"Child's Name *"}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Alex"
                placeholderTextColor="#9CA3AF"
                value={newChildName}
                onChangeText={setNewChildName}
              />

              <Text style={styles.inputLabel}>Custom Login ID (optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. alex001 (leave blank to auto-generate)"
                placeholderTextColor="#9CA3AF"
                value={newChildId}
                onChangeText={setNewChildId}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.inputLabel}>4-Digit PIN *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 1234"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={4}
                value={newChildPin}
                onChangeText={setNewChildPin}
              />

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddChild}
                  disabled={isAdding}
                  style={{ flex: 1.5 }}
                >
                  <LinearGradient
                    colors={["#7C3AED", "#A78BFA"]}
                    style={styles.createBtn}
                  >
                    {isAdding ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.createTxt}>Create Child Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Edit Child Modal */}
      <Modal transparent visible={editModalVisible} animationType="fade">
        <View style={styles.overlay}>
          <Animated.View
            entering={ZoomIn.duration(300)}
            style={styles.modalBox}
          >
            <LinearGradient
              colors={["#F59E0B", "#D97706"]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Edit Child Profile 📝</Text>
              <Text style={styles.modalSub}>
                Update {selectedChild?.name}{"'s details"}
              </Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>{"Child's Name *"}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Alex"
                placeholderTextColor="#9CA3AF"
                value={editChildName}
                onChangeText={setEditChildName}
              />

              <Text style={styles.inputLabel}>Child Login ID (Fixed)</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: "#E5E7EB", color: "#6B7280" },
                ]}
                value={selectedChild?.id}
                editable={false}
              />

              <Text style={styles.inputLabel}>4-Digit PIN *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 1234"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={4}
                value={editChildPin}
                onChangeText={setEditChildPin}
              />

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.cancelTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleEditChild}
                  disabled={isEditing}
                  style={{ flex: 1.5 }}
                >
                  <LinearGradient
                    colors={["#F59E0B", "#D97706"]}
                    style={styles.createBtn}
                  >
                    {isEditing ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.createTxt}>Save Changes</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerGradient: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  headerGreeting: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  headerName: { fontSize: 28, fontWeight: "900", color: "#FFF", marginTop: 2 },
  logoutBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: { fontSize: 28, fontWeight: "900", color: "#FFF" },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
    fontWeight: "600",
  },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 14,
  },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  childChipActive: { borderColor: "#7C3AED", backgroundColor: "#F5F3FF" },
  childAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DDD6FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  childAvatarText: { fontSize: 14, fontWeight: "900", color: "#7C3AED" },
  childChipText: { fontSize: 14, fontWeight: "700", color: "#6B7280" },
  childChipTextActive: { color: "#7C3AED" },
  addChildChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#DDD6FE",
    borderStyle: "dashed",
  },
  addChildText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#7C3AED",
    marginLeft: 6,
  },
  childCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  childCardAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  childCardAvatarText: { fontSize: 22, fontWeight: "900", color: "#FFF" },
  childCardName: { fontSize: 20, fontWeight: "900", color: "#FFF" },
  childCardSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  viewBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  viewBtnText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
  emptyBox: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 36,
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 20,
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: { color: "#FFF", fontWeight: "800", fontSize: 15 },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 1,
  },
  alertDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  alertText: { flex: 1, fontSize: 14, color: "#374151", fontWeight: "500" },
  credentialsBox: {
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.15)",
    padding: 10,
    borderRadius: 12,
  },
  credLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  credText: { color: "#FFF", fontWeight: "900", fontSize: 13 },
  childCardRight: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    alignSelf: "stretch",
  },
  actionBtnRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  smIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 28,
    overflow: "hidden",
    elevation: 20,
  },
  modalHeader: { padding: 24, paddingTop: 28 },
  modalTitle: { fontSize: 22, fontWeight: "900", color: "#FFF" },
  modalSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  modalBody: { padding: 24 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: "#1F2937",
  },
  modalBtnRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelTxt: { fontSize: 15, fontWeight: "700", color: "#6B7280" },
  createBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  createTxt: { fontSize: 15, fontWeight: "800", color: "#FFF" },

  hubCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 8, elevation: 3, shadowOpacity: 0.05, shadowRadius: 10, marginBottom: 20 },
  emptyHub: { alignItems: 'center', padding: 32 },
  emptyHubTxt: { fontSize: 14, color: '#9CA3AF', marginTop: 10, fontWeight: '600' },
  messageRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: '#FAF5FF', marginBottom: 10 },
  messageRowDanger: { backgroundColor: '#FEE2E2' },
  messageIconWrap: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  messageTextContent: { fontSize: 14, color: '#374151', fontWeight: '700', lineHeight: 20 },
  messageTime: { fontSize: 11, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
});
