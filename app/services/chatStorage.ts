import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_ROOMS_KEY = '@ChatRooms';
const CURRENT_ROOM_KEY = '@CurrentRoom';

const saveChatRoom = async (roomId: string, messages: any[]) => {
  try {
    const rooms = await getChatRooms();
    const updatedRooms = {
      ...rooms,
      [roomId]: messages
    };
    await AsyncStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(updatedRooms));
  } catch (error) {
    console.error('Error saving chat room:', error);
  }
};

const getChatRoom = async (roomId: string) => {
  try {
    const rooms = await getChatRooms();
    return rooms[roomId] || [];
  } catch (error) {
    console.error('Error getting chat room:', error);
    return [];
  }
};

const getChatRooms = async () => {
  try {
    const rooms = await AsyncStorage.getItem(CHAT_ROOMS_KEY);
    return rooms ? JSON.parse(rooms) : {};
  } catch (error) {
    console.error('Error getting chat rooms:', error);
    return {};
  }
};

const setCurrentRoom = async (roomId: string) => {
  try {
    await AsyncStorage.setItem(CURRENT_ROOM_KEY, roomId);
  } catch (error) {
    console.error('Error setting current room:', error);
  }
};

const getCurrentRoom = async () => {
  try {
    return await AsyncStorage.getItem(CURRENT_ROOM_KEY);
  } catch (error) {
    console.error('Error getting current room:', error);
    return null;
  }
};

export {
    CHAT_ROOMS_KEY, getChatRoom,
    getChatRooms, getCurrentRoom, saveChatRoom, setCurrentRoom
};
