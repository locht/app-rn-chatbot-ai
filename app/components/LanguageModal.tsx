import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Language, languages } from '../utils/languageCode';
import FlagIcon from './FlagIcon';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: Language) => void;
  position: {
    top: number;
    right: number;
  };
  mode: 'from' | 'to';
  currentLanguage?: Language;
}

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: Language) => void;
  position: {
    top: number;
    right: number;
  };
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose, onSelectLanguage, position, mode, currentLanguage }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return languages.filter(language =>
      language.name.toLowerCase().includes(query) ||
      language.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const sortedLanguages = useMemo(() => {
    if (!currentLanguage) return filteredLanguages;
    
    return [
      currentLanguage,
      ...filteredLanguages.filter(lang => lang.code !== currentLanguage.code)
    ];
  }, [currentLanguage, filteredLanguages]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { top: position.top, right: position.right }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn ngôn ngữ</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm ngôn ngữ"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          
          <ScrollView style={styles.languageList}>
            {sortedLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[styles.languageItem, currentLanguage?.code === language.code && styles.selectedLanguageItem]}
                onPress={() => {
                  onSelectLanguage(language);
                  onClose();
                }}
              >
                <View style={styles.languageItemContent}>
                  <FlagIcon countryCode={language.flag} size={20} />
                  <Text style={[styles.languageName, currentLanguage?.code === language.code && styles.selectedLanguageName]}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage?.code === language.code && (
                  <Ionicons name="checkmark" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    marginLeft: 10,
    padding: 2,
  },
  selectedLanguageItem: {
    backgroundColor: '#2a2a2a',
  },
  selectedLanguageName: {
    color: '#4CAF50',
  },
  languageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  modalContainer: {
    position: 'absolute',
    width: 300,
    maxHeight: 300,
    backgroundColor: '#212121',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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