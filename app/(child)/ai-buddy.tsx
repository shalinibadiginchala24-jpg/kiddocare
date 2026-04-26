import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ChildAIBuddy() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'buddy', text: 'Hey there, superstar! 🌟 How is your day going?' },
    { id: 2, role: 'buddy', text: 'Ready for some fun missions or need help with something? I am here for you! 🤖' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const newMessage = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Friendly contextual responses with "intelligence"
    setTimeout(() => {
      let buddyText = "";
      const lower = userText.toLowerCase().trim();

      const mathMatch = userText.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      if (mathMatch) {
        const num1 = parseInt(mathMatch[1]);
        const op = mathMatch[2];
        const num2 = parseInt(mathMatch[3]);
        let res = 0;
        if (op === '+') res = num1 + num2;
        if (op === '-') res = num1 - num2;
        if (op === '*') res = num1 * num2;
        if (op === '/') res = num2 !== 0 ? num1 / num2 : 0;
        buddyText = `That's a fun puzzle! 🧮 ${num1} ${op} ${num2} equals **${res}**! You are super smart! 🧠✨`;
      }
      else if (lower.includes('hello') || lower.includes('hi ') || lower === 'hi' || lower.includes('hey')) {
        buddyText = "Hi there, buddy! 🤖 I was just thinking of something awesome to do. How can I brighten your day today? ☀️";
      }
      else if (lower.includes('your name') || lower.includes('who are you')) {
        buddyText = "I'm your official AI Buddy! 🤖 I am a digital companion created to help you learn, play, and explore safely! What should I call you? 🌟";
      }
      else if (lower.includes('sad') || lower.includes('upset') || lower.includes('lonely') || lower.includes('cry')) {
        buddyText = "Oh no, big virtual hug coming your way! 🤗 Remember, it's totally okay to feel that way sometimes. Let's do some slow breathing, or would you like a joke to cheer you up? 🌈";
      }
      else if (lower.includes('happy') || lower.includes('excited') || lower.includes('good') || lower.includes('great')) {
        buddyText = "Woohoo! 🎉 Your positive energy makes the app light up! I'm so glad to hear you're having an awesome time!";
      }
      else if (lower.includes('game') || lower.includes('play')) {
        buddyText = "Playing is the best way to learn! 🎮 Check out the Games module on your dashboard. What is your high score?";
      }
      else if (lower.includes('story') || lower.includes('read')) {
        buddyText = "Stories take us to magical places! 📚 Grab a comfy spot and browse your book tabs for a fun adventure!";
      }
      else if (lower.includes('joke')) {
        const jokes = [
          "Why did the math book look sad? Because it had too many problems! 😂",
          "What do you call a bear with no teeth? A gummy bear! 🐻🍬",
          "How do you make a tissue dance? Put a little boogie in it! 💃",
          "What do you call a sleeping dinosaur? A dino-snore! 💤🦖"
        ];
        buddyText = jokes[Math.floor(Math.random() * jokes.length)];
      }
      else if (lower.includes('why') || lower.includes('what is') || lower.includes('how do')) {
        buddyText = `That is an excellent question! 🕵️‍♂️ "${userText}" makes me want to look it up in the explorer archives. Let's learn more about it together!`;
      }
      else {
        if (lower.split(' ').length > 2) {
          buddyText = `Wow! You explained that so well. Let me think about "${userText}" for a second... 🤔 It sounds like you are curious about cool stuff. Tell me more!`;
        } else {
          buddyText = "Tell me more about that? 💬 I love chatting with my favorite explorer!";
        }
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'buddy', 
        text: buddyText 
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
        colors={['#A855F7', '#8B5CF6']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
            <Animated.View entering={ZoomIn} style={styles.buddyAvatarSmall}>
                <Text style={{ fontSize: 20 }}>🤖</Text>
            </Animated.View>
            <Text style={styles.title}>My AI Buddy</Text>
        </View>
        <View style={{ width: 44 }} /> 
      </LinearGradient>

      <ScrollView 
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <Animated.View 
            key={msg.id}
            entering={msg.role === 'buddy' ? FadeInUp.delay(100) : FadeInDown}
            style={[
              styles.messageBubble,
              msg.role === 'buddy' ? styles.buddyBubble : styles.userBubble
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.role === 'buddy' ? styles.buddyText : styles.userText
            ]}>
              {msg.text}
            </Text>
            <Text style={[styles.timeTxt, msg.role === 'user' && { color: 'rgba(255,255,255,0.6)' }]}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Animated.View>
        ))}
      </ScrollView>

      <View style={styles.bottomSection}>
          <Animated.View entering={FadeInUp.delay(300)} style={styles.quickActions}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                  <TouchableOpacity style={styles.quickBtn} onPress={() => { setInput('Tell me a joke!'); }}>
                      <Text style={styles.quickTxt}>😂 Joke</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickBtn} onPress={() => { setInput('Help me with math'); }}>
                      <Text style={styles.quickTxt}>🧮 Math Help</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickBtn} onPress={() => { setInput('Tell me something good!'); }}>
                      <Text style={styles.quickTxt}>⭐ Motivation</Text>
                  </TouchableOpacity>
              </ScrollView>
          </Animated.View>

          <View style={styles.inputArea}>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                    placeholderTextColor="#A855F7"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Ionicons name="sparkles" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
          </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5FF' },
  header: { 
      paddingTop: 60, 
      paddingBottom: 24, 
      paddingHorizontal: 20, 
      flexDirection: 'row', 
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 5,
      shadowColor: '#A855F7',
      shadowOpacity: 0.2,
      shadowRadius: 15
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitleContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buddyAvatarSmall: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  title: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  chatArea: { flex: 1 },
  chatContent: { padding: 20, paddingBottom: 40 },
  messageBubble: { 
      padding: 16, 
      borderRadius: 20, 
      maxWidth: '85%', 
      marginBottom: 16,
      elevation: 2,
      shadowOpacity: 0.05,
      shadowRadius: 5
  },
  buddyBubble: { 
      backgroundColor: '#FFF', 
      alignSelf: 'flex-start',
      borderTopLeftRadius: 4,
      borderColor: '#F3E8FF',
      borderWidth: 1
  },
  userBubble: { 
      backgroundColor: '#A855F7', 
      alignSelf: 'flex-end',
      borderTopRightRadius: 4
  },
  messageText: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  buddyText: { color: '#581C87' },
  userText: { color: '#FFF' },
  timeTxt: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'right' },
  bottomSection: { backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3E8FF', paddingVertical: 15 },
  quickActions: { marginBottom: 15 },
  quickBtn: { backgroundColor: '#F3E8FF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 15, marginRight: 10, borderWidth: 1, borderColor: '#E9D5FF' },
  quickTxt: { fontSize: 13, fontWeight: '800', color: '#7E22CE' },
  inputArea: { 
      paddingHorizontal: 20, 
      paddingBottom: Platform.OS === 'ios' ? 20 : 5
  },
  inputWrapper: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: '#FAF5FF', 
      borderRadius: 20, 
      paddingLeft: 20,
      paddingRight: 6,
      borderWidth: 1,
      borderColor: '#E9D5FF',
      height: 54
  },
  input: { flex: 1, fontSize: 16, color: '#581C87', fontWeight: '600' },
  sendButton: { 
      width: 42, 
      height: 42, 
      borderRadius: 14, 
      backgroundColor: '#A855F7', 
      justifyContent: 'center', 
      alignItems: 'center' 
  }
});
