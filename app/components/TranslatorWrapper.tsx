import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import Translator from 'react-native-translator';
import translate from '../utils/translator';

interface TranslatorWrapperProps {
  from: string;
  to: string;
  value: string;
  onTranslated: (translatedText: string) => void;
}

const TranslatorWrapper: React.FC<TranslatorWrapperProps> = ({
  from,
  to,
  value,
  onTranslated,
}) => {
  // State để theo dõi giá trị đầu vào trước đó
  const [prevValue, setPrevValue] = useState('');

  useEffect(() => {
    // Chỉ dịch khi giá trị đầu vào thay đổi
    if (value !== prevValue && (Platform.OS === 'web' || Platform.OS === 'windows' || Platform.OS === 'macos')) {
      setPrevValue(value);
      translate({ from, to, value, onTranslated });
    }
  }, [from, to, value, onTranslated, prevValue]);

  // Đối với React Native, sử dụng component Translator
  if (Platform.OS !== 'web') {
    return (
      <View style={{ opacity: 0, width: 0, height: 0 }}>
        <Translator
          from={from}
          to={to}
          value={value}
          onTranslated={onTranslated}
        />
      </View>
    );
  }

  // Đối với web, không cần render gì cả vì dịch được xử lý trong useEffect
  return null;
};

export default TranslatorWrapper;