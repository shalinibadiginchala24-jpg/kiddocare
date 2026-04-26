import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming,
    interpolateColor,
    withSequence
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WaterTracker() {
    const [glasses, setGlasses] = useState(0);
    const waveY = useSharedValue(200);
    const bubbleScale = useSharedValue(0);

    const goal = 8;

    useEffect(() => {
        const percentage = Math.min(glasses / goal, 1);
        waveY.value = withSpring(200 - (percentage * 200), { damping: 12 });
    }, [glasses, waveY]);

    const handleAdd = () => {
        if (glasses < goal) {
            setGlasses(g => g + 1);
            bubbleScale.value = withSequence(
                withTiming(1.5, { duration: 100 }),
                withSpring(1)
            );
        }
    };

    const liquidStyle = useAnimatedStyle(() => ({
        top: waveY.value,
        backgroundColor: interpolateColor(
            waveY.value,
            [200, 0],
            ['#BAE6FD', '#0EA5E9']
        )
    }));

    return (
        <View style={styles.container}>
            <View style={styles.glassContainer}>
                <Animated.View style={[styles.liquid, liquidStyle]} />
                <View style={styles.info}>
                    <Text style={styles.amount}>{glasses}</Text>
                    <Text style={styles.label}>Glasses</Text>
                </View>
            </View>

            <TouchableOpacity 
                onPress={handleAdd} 
                style={styles.addButton}
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
                <Text style={styles.btnText}>I drank water!</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
    },
    glassContainer: {
        width: 140,
        height: 200,
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        borderWidth: 4,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    liquid: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    info: {
        alignItems: 'center',
    },
    amount: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1E293B',
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '700',
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
        width: width * 0.7,
        justifyContent: 'center',
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    btnText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    }
});
