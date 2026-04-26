import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AIAssistant() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I am your AI Parenting Assistant. How can I help you today?' },
    { id: 2, role: 'assistant', text: 'I noticed your child spent 20% more time on educational apps this week. Great job encouraging learning!' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simple mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        text: 'That is a great question. Based on child development best practices, I recommend setting a 30-minute quiet time before bed to help with transition.' 
      }]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#8B5CF6', '#6D28D9']}
        style={styles.header}
      >
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.headerContent}>
            <View style={styles.aiAvatar}>
                <MaterialCommunityIcons name="robot" size={32} color="#8B5CF6" />
            </View>
            <View style={{ marginLeft: 16 }}>
                <Text style={styles.aiName}>KiddoCare AI</Text>
                <Text style={styles.aiStatus}>Always here to help</Text>
            </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <Animated.View 
            key={msg.id}
            entering={msg.role === 'assistant' ? FadeInUp.delay(100) : FadeInDown}
            style={[
              styles.messageBubble,
              msg.role === 'assistant' ? styles.assistantBubble : styles.userBubble
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.role === 'assistant' ? styles.assistantText : styles.userText
            ]}>
              {msg.text}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                placeholder="Ask me anything about parenting..."
                value={input}
                onChangeText={setInput}
                placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    paddingTop: 60, 
    paddingBottom: 24, 
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  aiAvatar: { 
      width: 56, 
      height: 56, 
      borderRadius: 28, 
      backgroundColor: '#FFF', 
      justifyContent: 'center', 
      alignItems: 'center',
      elevation: 4,
      shadowOpacity: 0.1,
      shadowRadius: 10
  },
  aiName: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  aiStatus: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 2 },
  chatArea: { flex: 1 },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageBubble: { 
      padding: 16, 
      borderRadius: 20, 
      maxWidth: '85%', 
      marginBottom: 16,
      elevation: 1,
      shadowOpacity: 0.05,
      shadowRadius: 5
  },
  assistantBubble: { 
      backgroundColor: '#FFF', 
      alignSelf: 'flex-start',
      borderTopLeftRadius: 4,
      borderColor: '#F1F5F9',
      borderWidth: 1
  },
  userBubble: { 
      backgroundColor: '#7C3AED', 
      alignSelf: 'flex-end',
      borderTopRightRadius: 4
  },
  messageText: { fontSize: 15, lineHeight: 22 },
  assistantText: { color: '#334155', fontWeight: '500' },
  userText: { color: '#FFF', fontWeight: '600' },
  inputArea: { 
      padding: 20, 
      backgroundColor: '#FFF', 
      borderTopWidth: 1, 
      borderTopColor: '#F1F5F9',
      paddingBottom: Platform.OS === 'ios' ? 40 : 20
  },
  inputWrapper: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: '#F1F5F9', 
      borderRadius: 25, 
      paddingLeft: 20,
      paddingRight: 6
  },
  input: { flex: 1, height: 48, fontSize: 15, color: '#1E293B' },
  sendButton: { 
      width: 36, 
      height: 36, 
      borderRadius: 18, 
      backgroundColor: '#7C3AED', 
      justifyContent: 'center', 
      alignItems: 'center' 
  }
});
