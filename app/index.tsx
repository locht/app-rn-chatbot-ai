import { Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { fetchGeminiAPI } from "../config/api";
import TranslatorWrapper from "./components/TranslatorWrapper";
import {
  CHAT_ROOMS_KEY,
  getChatRooms,
  saveChatRoom,
  setCurrentRoom,
} from "./services/chatStorage";
const chatStorage = { getChatRooms, saveChatRoom, setCurrentRoom };

// Mock data for sidebar items
const sidebarItems = [
  { id: "1", name: "ChatAI", icon: "chatbubbles-outline" },
  { id: "2", name: "New Chat", icon: "add-outline" },
  // { id: "3", name: "Library", icon: "library-outline" },
  // { id: "4", name: "History", icon: "time-outline" },
];

export default function HomeScreen() {
  const [messages, setMessages] = useState<any>([]);
  const [inputText, setInputText] = useState("");
  const [translateText, setTranslateText] = useState("");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<"vi" | "en">("vi");

  const [chatHistory, setChatHistory] = useState([]);

  React.useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const history = await chatStorage.getChatRooms();
      setChatHistory(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    }
  };

  const deleteChatRoom = async (roomId: string) => {
    try {
      const rooms = await chatStorage.getChatRooms();
      const { [roomId]: _, ...remainingRooms } = rooms;
      await AsyncStorage.setItem(
        CHAT_ROOMS_KEY,
        JSON.stringify(remainingRooms)
      );

      // Update chatHistory state immediately
      setChatHistory(remainingRooms);
      fetchChatHistory();
    } catch (error) {
      console.error("Error deleting chat room:", error);
    }
  };

  const handleNewChat = async () => {
    // Save current messages to current room if exists
    if (currentRoom && messages.length > 0) {
      await chatStorage.saveChatRoom(currentRoom, messages);
    }

    const newRoomId = Date.now().toString();
    await chatStorage.setCurrentRoom(newRoomId);
    setCurrentRoom(newRoomId);
    setMessages([]);
    setInputText("");
    // Refresh chat history
    fetchChatHistory();
  };

  const handleSend = async () => {
    // console.log('inputText', inputText)
    // console.log('translateText', translateText)
    if (inputText.trim()) {
      // Check if current room exists, if not create new one
      let roomId = currentRoom;
      if (!roomId) {
        roomId = Date.now().toString();
        await chatStorage.setCurrentRoom(roomId);
        setCurrentRoom(roomId);
      }

      // Translate text if language is English
      const newMessage = {
        id: String(messages.length + 1),
        sender: "User",
        text: translateText || inputText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev: any) => [newMessage, ...prev]);
      setInputText("");
      try {
        const responseContent = await fetchGeminiAPI(inputText);
        // console.log("responseContent", responseContent);
        const botResponse = {
          id: String(messages.length + 2),
          sender: "OpenRouter",
          text: responseContent,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev: any) => [botResponse, ...prev]);

        // Save messages to current room
        await chatStorage.saveChatRoom(roomId, messages);
      } catch (error: any) {
        console.error("Error calling OpenRouter API:", error);
        let errorMessage;
        if (error.message.includes("Insufficient Balance")) {
          errorMessage =
            "Your API key has insufficient balance. Please check your account.";
        } else if (error.message.includes("404")) {
          errorMessage =
            "API endpoint not found. Please check the configuration.";
        }

        if (errorMessage) {
          setMessages((prev: any) => [
            ...prev,
            {
              id: String(prev.length + 1),
              sender: "System",
              text: errorMessage,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      }
    }
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "User" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      {item.sender === "User" && currentLanguage === "en" && (
        <Text style={styles.translatedText}>(Translated from Vietnamese)</Text>
      )}
      {/* <Text style={styles.timestamp}>{item.timestamp}</Text> */}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Sidebar */}
        <View style={[styles.sidebar, !isSidebarOpen && { display: "none" }]}>
          <ScrollView>
            {sidebarItems.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.sidebarItem}
                onPress={item.id === "2" ? handleNewChat : undefined}
              >
                <Ionicons name={item.icon} size={20} color="#ccc" />
                <Text style={styles.sidebarText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.divider} />
            <View>
              <Text style={styles.historyTitle}>Lịch sử chat</Text>
              {Object.entries(chatHistory).map(([roomId, messages]: any) => {
                const firstMessage = messages[0]?.text || "New Chat";
                return (
                  <View
                    key={roomId}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.historyItem}
                      onPress={() => {
                        setCurrentRoom(roomId);
                        setMessages(messages);
                      }}
                    >
                      <Text style={styles.historyText}>
                        {firstMessage.length > 20
                          ? firstMessage.substring(0, 20) + "..."
                          : firstMessage}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteChatRoom(roomId)}
                      style={{ padding: 8 }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ccc" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          {/* <View style={styles.sidebarFooter}>
            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="cloud-upload-outline" size={20} color="#ccc" />
              <Text style={styles.sidebarText}>Upgrade plan</Text>
            </TouchableOpacity>
            <Text style={styles.sidebarFooterText}>
              More access to the best models
            </Text>
          </View> */}
        </View>

        {/* Main Chat Area */}
        <View style={styles.chatArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Octicons
                name={!isSidebarOpen ? "sidebar-collapse" : "sidebar-expand"}
                size={20}
                color="#ccc"
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chat</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity>
                <Ionicons
                  name="share-outline"
                  size={24}
                  color="#ccc"
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#ccc"
                  style={styles.headerIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <View style={styles.messagesContainer}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              inverted
            />
          </View>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TranslatorWrapper
              from="vi"
              to="en"
              value={inputText}
              onTranslated={(t) => setTranslateText(t)}
            />
            <TextInput
              style={styles.input}
              placeholder="Bạn đang cần hỗ trợ điều gì?"
              placeholderTextColor="#888"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              // multiline
            />
            {/* <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="add-circle-outline" size={24} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="search-outline" size={20} color="#ccc" />
              <Text style={styles.inputButtonText}>Tìm kiếm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="bulb-outline" size={20} color="#ccc" />
              <Text style={styles.inputButtonText}>Ý tưởng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="scan-outline" size={20} color="#ccc" />
              <Text style={styles.inputButtonText}>Chuyên sâu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputButton}>
              <Ionicons name="image-outline" size={20} color="#ccc" />
              <Text style={styles.inputButtonText}>Hình ảnh</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.inputButton}
              onPress={() =>
                setCurrentLanguage(currentLanguage === "vi" ? "en" : "vi")
              }
            >
              <Ionicons name="language-outline" size={20} color="#ccc" />
              <Text style={styles.inputButtonText}>Ngôn ngữ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="send-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#212121", // Dark background
  },
  sidebar: {
    width: 260,
    backgroundColor: "#171717", // Slightly darker sidebar
    paddingTop: 40, // Adjust as needed for status bar
    paddingBottom: 10,
    borderRightWidth: 1,
    borderRightColor: "#333",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sidebarText: {
    color: "#ccc",
    marginLeft: 15,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 15,
    marginHorizontal: 15,
  },
  historyTitle: {
    color: "#888",
    fontSize: 12,
    paddingHorizontal: 15,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  historyItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 2,
  },
  selectedHistoryItem: {
    backgroundColor: "#333",
  },
  historyText: {
    color: "#ccc",
    fontSize: 14,
  },
  selectedHistoryText: {
    color: "#fff",
    fontWeight: "500",
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 15,
  },
  sidebarFooterText: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 35, // Align with text of the item above
  },
  chatArea: {
    flex: 1,
    backgroundColor: "#212121",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#171717", // Match sidebar header
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 15,
  },
  messageList: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20, // Add padding to avoid overlap with input
  },
  messagesContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0b93f6", // Example user message color
    borderBottomRightRadius: 0,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#3a3a3c", // Example bot message color
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  translatedText: {
    fontSize: 12,
    color: "#aaa",
    fontStyle: "italic",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#aaa",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#171717", // Match sidebar/header
  },
  input: {
    flex: 1,
    backgroundColor: "#3a3a3c",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 15,
    marginHorizontal: 5,
    maxHeight: 100, // Limit input height for multiline
  },
  inputButton: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  inputButtonText: {
    color: "#ccc",
    fontSize: 10,
    marginTop: 2,
  },
  sendButton: {
    // backgroundColor: "#555", // Darker button
    borderRadius: 15, // Circular
    padding: 8,
    marginLeft: 5,
  },
});
