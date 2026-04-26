import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { chatService } from '@/services/chatService';

export default function ParentChat() {
  const router = useRouter();
  const { childId, childName } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let unsubscribe: any;
    if (childId) {
      unsubscribe = chatService.subscribeToChat(childId as string, (msgs) => {
        setMessages(msgs);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [childId]);

  const handleSend = async () => {
    if (!inputText.trim() || !childId) return;
    try {
      await chatService.sendMessage(childId as string, 'parent', inputText);
      setInputText('');
    } catch (e) {
      console.error(e);
    }
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isParent = item.sender === 'parent';
    
    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 50).springify()}
        style={[styles.msgWrapper, isParent ? styles.msgRight : styles.msgLeft]}
      >
        {!isParent && (
          <View style={styles.childAvatar}>
            <Text style={{ fontSize: 16 }}>🧒</Text>
          </View>
        )}
        <View style={[styles.msgBubble, isParent ? styles.parentBubble : styles.childBubble]}>
          <Text style={[styles.msgText, isParent ? styles.parentMsgText : styles.childMsgText]}>{item.text}</Text>
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
      <LinearGradient colors={['#8B5CF6', '#A78BFA']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Chat with {childName || 'Child'}</Text>
          <Text style={styles.subTitle}>Live Connection</Text>
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
  container: { flex: 1, backgroundColor: '#F5F3FF' },
  header: { 
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, 
    flexDirection: 'row', alignItems: 'center', 
    borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    elevation: 4, shadowColor: '#8B5CF6', shadowOpacity: 0.2, shadowRadius: 10
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  subTitle: { fontSize: 13, color: '#EDE9FE', fontWeight: '600', marginTop: 2 },
  
  chatContent: { padding: 20, paddingBottom: 40 },
  msgWrapper: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  msgLeft: { justifyContent: 'flex-start' },
  msgRight: { justifyContent: 'flex-end' },
  childAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 8, elevation: 1 },
  
  msgBubble: { maxWidth: '75%', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 24 },
  parentBubble: { backgroundColor: '#8B5CF6', borderBottomRightRadius: 6 },
  childBubble: { backgroundColor: '#FFF', borderBottomLeftRadius: 6, borderWidth: 1, borderColor: '#EDE9FE', elevation: 1, shadowOpacity: 0.05, shadowRadius: 5 },
  
  msgText: { fontSize: 16, lineHeight: 22 },
  parentMsgText: { color: '#FFF', fontWeight: '600' },
  childMsgText: { color: '#4B5563', fontWeight: '500' },
  
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
    backgroundColor: '#8B5CF6', 
    justifyContent: 'center', alignItems: 'center', 
    marginLeft: 12, elevation: 2 
  }
});
