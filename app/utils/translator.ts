import { Platform } from 'react-native';

interface TranslatorOptions {
  from: string;
  to: string;
  value: string;
  onTranslated: (translatedText: string) => void;
}

// Hàm dịch cho web sử dụng các API dịch thuật
const webTranslate = async (options: TranslatorOptions) => {
//   console.log('webTranslate options:', options);
  const { from, to, value, onTranslated } = options;
  
  if (!value.trim()) {
    onTranslated('');
    return;
  }
  
  try {
    // Sử dụng Google Translate API không chính thức
    // Với MyMemory API như một phương án dự phòng
    let translatedText = '';
    
    try {
      // Sử dụng API Google Translate không chính thức
      // API này có thể thay đổi hoặc bị chặn, nên cần có phương án dự phòng
      const googleApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(value)}`;
      
      const response = await fetch(googleApiUrl);
      
      if (response.ok) {
        const data = await response.json();
        // Kết quả trả về có cấu trúc phức tạp, phần dịch nằm ở data[0][0][0]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          translatedText = data[0][0][0];
        //   console.log('Google Translate result:', translatedText);
        }
      }
    } catch (googleError) {
      console.log('Google Translate error, falling back to MyMemory:', googleError);
      // Nếu Google Translate không hoạt động, sử dụng MyMemory API
      const myMemoryResponse = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(value)}&langpair=${from}|${to}`);
      const myMemoryData = await myMemoryResponse.json();
      
      if (myMemoryData && myMemoryData.responseData) {
        translatedText = myMemoryData.responseData.translatedText;
        console.log('MyMemory result:', translatedText);
      }
    }
    
    if (translatedText) {
      onTranslated(translatedText);
    } else {
      // Fallback nếu không thể dịch
      onTranslated(value);
    }
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback nếu có lỗi
    onTranslated(value);
  }
};

// Hàm dịch đa nền tảng
const translate = (options: TranslatorOptions) => {
  // Kiểm tra nền tảng hiện tại
  if (Platform.OS === 'web' || Platform.OS === 'windows' || Platform.OS === 'macos') {
    // Sử dụng phương thức dịch cho web
    webTranslate(options);
  } else {
    // Đối với React Native, chúng ta sẽ sử dụng component Translator hiện có
    // Component này sẽ được sử dụng trực tiếp trong JSX
    // Không cần thực hiện gì ở đây vì component sẽ xử lý việc dịch
  }
};

export default translate;