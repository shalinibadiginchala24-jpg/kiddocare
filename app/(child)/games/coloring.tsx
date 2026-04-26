import { activityService } from "@/services/activityService";
import { rewardService } from "@/services/rewardService";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  GestureResponderEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, { BounceIn, FadeInDown, ZoomIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CANVAS_SIZE = width - 40;

const PALETTE_GROUPS = [
  {
    label: "🌸 Pastels",
    colors: ["#FFD1DC", "#FFDAC1", "#FFFFD8", "#B5EAD7", "#B2E2F2", "#C7CEEA", "#E2D1F9", "#FFCCF9"],
  },
  {
    label: "🌟 Brights",
    colors: ["#FF2E63", "#FF9F43", "#FFEB3B", "#4CAF50", "#00BCD4", "#2196F3", "#9C27B0", "#E91E63"],
  },
  {
    label: "✨ Soft Tones",
    colors: ["#F3E5F5", "#E1F5FE", "#E8F5E9", "#FFFDE7", "#FBE9E7", "#EFEBE9", "#E5E5E5", "#4A4A4A"],
  },
];

const TEMPLATES = [
  { name: "Elephant", emoji: "🐘", image: require("../../../assets/images/coloring/elephant.png") },
  { name: "Happy Apple", emoji: "🍎", image: require("../../../assets/images/coloring/apple.png") },
  { name: "Fast Car", emoji: "🚗", image: require("../../../assets/images/coloring/car.png") },
  { name: "The Park", emoji: "🌳", image: require("../../../assets/images/coloring/park.png") },
];

interface DrawingPath {
  path: string;
  color: string;
  strokeWidth: number;
}

export default function ColoringBook() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(PALETTE_GROUPS[1].colors[0]); // start with bright red
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0]);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPathRef = useRef<string>('');
  const colorRef = useRef(selectedColor);
  const brushRef = useRef(brushSize);

  useEffect(() => { colorRef.current = selectedColor; }, [selectedColor]);
  useEffect(() => { brushRef.current = brushSize; }, [brushSize]);

  useEffect(() => {
    AsyncStorage.getItem("childId").then((id) => setChildId(id));
  }, []);

  // ── Touch Handlers (native responder — most reliable) ────────────────────
  const onTouchStart = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    currentPathRef.current = `M${locationX.toFixed(1)},${locationY.toFixed(1)}`;
    setIsDrawing(true);
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    if (!currentPathRef.current) return;
    const { locationX, locationY } = e.nativeEvent;
    currentPathRef.current += ` L${locationX.toFixed(1)},${locationY.toFixed(1)}`;
    // Force re-render by updating paths with live stroke
    setPaths(prev => {
      const withoutLive = prev.filter(p => !p.path.startsWith('__live__'));
      return [...withoutLive, { path: `__live__${currentPathRef.current}`, color: colorRef.current, strokeWidth: brushRef.current }];
    });
  };

  const onTouchEnd = () => {
    if (!currentPathRef.current) return;
    const finalPath = currentPathRef.current;
    setPaths(prev => {
      const withoutLive = prev.filter(p => !p.path.startsWith('__live__'));
      return [...withoutLive, { path: finalPath, color: colorRef.current, strokeWidth: brushRef.current }];
    });
    currentPathRef.current = '';
    setIsDrawing(false);
  };

  const undo = () => {
    setPaths(prev => prev.filter(p => !p.path.startsWith('__live__')).slice(0, -1));
  };

  const clearCanvas = () => {
    Alert.alert("Erase Everything?", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, Clear", onPress: () => { setPaths([]); currentPathRef.current = ''; } },
    ]);
  };

  const handleSave = async () => {
    if (childId) {
      await activityService.addActivity(`Colored a wonderful ${activeTemplate.name}! 🎨`, childId);
      await rewardService.updateRewards(childId, 10);
    }
    Alert.alert("🎨 Masterpiece Saved!", "You earned 10 STARS! ⭐", [
      { text: "Great! 🎉", onPress: () => router.back() },
    ]);
  };

  const realPaths = paths.filter(p => !p.path.startsWith('__live__'));
  const livePath = paths.find(p => p.path.startsWith('__live__'));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LinearGradient colors={["#FFE4E6", "#E0F2FE"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#5C4033" />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <Text style={styles.titleEmoji}>🎨</Text>
            <Text style={styles.title}>Magic Canvas</Text>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={handleSave}>
            <Text style={styles.doneTxt}>Save ⭐</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Color + Brush indicator bar */}
      <View style={styles.activeBar}>
        <View style={[styles.activeColorDot, { backgroundColor: selectedColor, borderColor: '#ccc' }]} />
        <Text style={styles.activeBarTxt}>Selected color • Brush size {brushSize}px</Text>
        <Text style={styles.hintTxt}>👆 Drag on canvas to draw</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDrawing}
      >
        {/* Template Picker */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Picture</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TEMPLATES.map((t, i) => (
              <Animated.View key={t.name} entering={BounceIn.delay(i * 100)} style={{ marginRight: 12 }}>
                <TouchableOpacity
                  style={[styles.templateBtn, activeTemplate.name === t.name && styles.activeTemplate]}
                  onPress={() => { setActiveTemplate(t); setPaths([]); currentPathRef.current = ''; }}
                >
                  <Text style={styles.templateEmoji}>{t.emoji}</Text>
                  <Text style={styles.templateName}>{t.name}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Canvas */}
        <Animated.View entering={ZoomIn.duration(600)} style={styles.canvasContainer}>
          <View
            style={styles.canvasWrapper}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={onTouchStart}
            onResponderMove={onTouchMove}
            onResponderRelease={onTouchEnd}
            onResponderTerminate={onTouchEnd}
          >
            {/* Template image behind */}
            <Image
              source={activeTemplate.image}
              style={styles.templateImage}
              resizeMode="contain"
            />
            {/* Drawing SVG on top */}
            <Svg style={StyleSheet.absoluteFill}>
              {realPaths.map((p, i) => (
                <Path key={i} d={p.path} stroke={p.color} strokeWidth={p.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ))}
              {livePath && (
                <Path d={livePath.path.replace('__live__', '')} stroke={livePath.color} strokeWidth={livePath.strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </Svg>
          </View>

          <View style={styles.canvasActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={undo} disabled={realPaths.length === 0}>
              <Ionicons name="arrow-undo" size={20} color={realPaths.length > 0 ? "#5C4033" : "#CBD5E1"} />
              <Text style={[styles.actionTxt, realPaths.length === 0 && { color: "#CBD5E1" }]}>Undo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={clearCanvas}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionTxt, { color: "#EF4444" }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Brush Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brush Size</Text>
          <View style={styles.brushRow}>
            {[4, 8, 14, 22].map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.brushBtn, brushSize === size && styles.activeBrush]}
                onPress={() => setBrushSize(size)}
              >
                <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: selectedColor }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Palette */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pick a Color, then draw!</Text>
          {PALETTE_GROUPS.map((group) => (
            <View key={group.label} style={styles.paletteGroup}>
              <Text style={styles.paletteLabel}>{group.label}</Text>
              <View style={styles.paletteRow}>
                {group.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorBtn,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={20} color={color === '#FFFFD8' || color === '#E5E5E5' ? '#333' : '#FFF'} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFB" },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },
  headerContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  titleEmoji: { fontSize: 26 },
  title: { fontSize: 20, fontWeight: "900", color: "#5C4033" },
  doneBtn: { backgroundColor: "#FFF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14, elevation: 2 },
  doneTxt: { color: "#FF6B9D", fontWeight: "900", fontSize: 14 },
  activeBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 8 },
  activeColorDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2 },
  activeBarTxt: { fontSize: 12, fontWeight: '700', color: '#4A4A4A', flex: 1 },
  hintTxt: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  scrollContent: { paddingBottom: 80 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "900", color: "#5C4033", marginBottom: 14 },
  templateBtn: { backgroundColor: "#FFF", padding: 14, borderRadius: 20, alignItems: "center", width: 90, borderWidth: 2, borderColor: '#FEE2E2', elevation: 2 },
  activeTemplate: { backgroundColor: "#FFE4E6", borderColor: "#FF6B9D" },
  templateEmoji: { fontSize: 30, marginBottom: 4 },
  templateName: { fontSize: 11, fontWeight: "800", color: "#8B7355", textAlign: 'center' },
  canvasContainer: { marginHorizontal: 20, marginTop: 16 },
  canvasWrapper: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: "#FFFFFFFF",
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 3,
    borderColor: '#FFE4E6',
    position: 'relative',
  },
  templateImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.9 },
  canvasActions: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 14 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, elevation: 2, borderWidth: 1, borderColor: '#FEE2E2', gap: 6 },
  actionTxt: { fontSize: 14, fontWeight: '800', color: '#5C4033' },
  paletteGroup: { marginBottom: 18 },
  paletteLabel: { fontSize: 13, fontWeight: "800", color: "#8B7355", marginBottom: 10, opacity: 0.8 },
  paletteRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", elevation: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  selectedColor: { borderWidth: 3, borderColor: "#333", transform: [{ scale: 1.18 }] },
  brushRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  brushBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FEE2E2', elevation: 2 },
  activeBrush: { borderColor: '#FF6B9D', backgroundColor: '#FFE4E6', transform: [{ scale: 1.1 }] },
});
