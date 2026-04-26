import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { chatService } from '@/services/chatService';

export default function ChildChat() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let unsubscribe: any;
    AsyncStorage.getItem('childId').then(id => {
      if (id) {
        setChildId(id);
        unsubscribe = chatService.subscribeToChat(id, (msgs) => {
          setMessages(msgs);
        });
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !childId) return;
    try {
      await chatService.sendMessage(childId, 'child', inputText);
      setInputText('');
    } catch (e) {
      console.error(e);
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isChild = item.sender === 'child';
    
    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 50).springify()}
        style={[styles.msgWrapper, isChild ? styles.msgRight : styles.msgLeft]}
      >
        {!isChild && (
          <View style={styles.parentAvatar}>
            <Ionicons name="heart" size={16} color="#FF6B9D" />
          </View>
        )}
        <View style={[styles.msgBubble, isChild ? styles.childBubble : styles.parentBubble]}>
          <Text style={[styles.msgText, isChild ? styles.childMsgText : styles.parentMsgText]}>{item.text}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#FFD1DC', '#FECDD3']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#BE185D" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Chat with Parents</Text>
          <Text style={styles.subTitle}>Always here for you! 💜</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <Animated.View entering={ZoomIn.delay(300)} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F7' },
  header: { 
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, 
    flexDirection: 'row', alignItems: 'center', 
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    elevation: 4, shadowColor: '#FF6B9D', shadowOpacity: 0.2, shadowRadius: 10
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#BE185D' },
  subTitle: { fontSize: 13, color: '#9D174D', fontWeight: '600', marginTop: 2 },
  
  chatContent: { padding: 20, paddingBottom: 40 },
  msgWrapper: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  msgLeft: { justifyContent: 'flex-start' },
  msgRight: { justifyContent: 'flex-end' },
  parentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#FECDD3' },
  
  msgBubble: { maxWidth: '75%', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24 },
  childBubble: { backgroundColor: '#FF6B9D', borderBottomRightRadius: 6 },
  parentBubble: { backgroundColor: '#FFF', borderBottomLeftRadius: 6, borderWidth: 1, borderColor: '#FEE2E2', elevation: 1, shadowOpacity: 0.05, shadowRadius: 5 },
  
  msgText: { fontSize: 16, lineHeight: 22 },
  childMsgText: { color: '#FFF', fontWeight: '600' },
  parentMsgText: { color: '#4B5563', fontWeight: '500' },
  
  inputContainer: { 
    flexDirection: 'row', alignItems: 'flex-end', 
    padding: 16, paddingBottom: Platform.OS === 'ios' ? 30 : 16, 
    backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  input: { 
    flex: 1, backgroundColor: '#F9FAFB', 
    borderWidth: 1, borderColor: '#F3F4F6', 
    borderRadius: 24, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14, 
    fontSize: 16, color: '#1F2937', minHeight: 48, maxHeight: 120 
  },
  sendBtn: { 
    width: 48, height: 48, borderRadius: 24, 
    backgroundColor: '#FF6B9D', 
    justifyContent: 'center', alignItems: 'center', 
    marginLeft: 12, elevation: 2 
  }
});
