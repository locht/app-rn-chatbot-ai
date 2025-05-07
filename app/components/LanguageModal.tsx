import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LanguagePair {
  id: string;
  name: string;
  from: string;
  to: string;
}

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (from: string, to: string) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose, onSelectLanguage }) => {
  // Danh sách các cặp ngôn ngữ hỗ trợ
  const languagePairs: LanguagePair[] = [
    { id: '1', name: 'Tiếng Việt', from: 'vi', to: 'vi' },
    { id: '2', name: 'Tiếng Anh', from: 'en', to: 'en' },
    { id: '3', name: 'Việt → Anh', from: 'vi', to: 'en' },
    { id: '4', name: 'Anh → Việt', from: 'en', to: 'vi' },
    { id: '5', name: 'Pháp', from: 'fr', to: 'fr' },
    { id: '6', name: 'Việt → Pháp', from: 'vi', to: 'fr' },
    { id: '7', name: 'Pháp → Việt', from: 'fr', to: 'vi' },
    { id: '8', name: 'Trung Quốc', from: 'zh', to: 'zh' },
    { id: '9', name: 'Việt → Trung', from: 'vi', to: 'zh' },
    { id: '10', name: 'Trung → Việt', from: 'zh', to: 'vi' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn ngôn ngữ</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.languageList}>
            {languagePairs.map((pair) => (
              <TouchableOpacity
                key={pair.id}
                style={styles.languageItem}
                onPress={() => {
                  onSelectLanguage(pair.from, pair.to);
                  onClose();
                }}
              >
                <Text style={styles.languageName}>{pair.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#212121',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  closeButton: {
    padding: 5,
  },
  languageList: {
    paddingHorizontal: 10,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  languageName: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LanguageModal;