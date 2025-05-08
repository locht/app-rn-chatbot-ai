<!-- @format -->

# Hướng dẫn sử dụng chức năng dịch thuật đa nền tảng

## Giới thiệu

Chức năng dịch thuật đa nền tảng được thiết kế để hoạt động trên cả React Native (mobile) và Web. Hệ thống sẽ tự động phát hiện nền tảng hiện tại và sử dụng phương thức dịch phù hợp.

## Cấu trúc

1. **TranslatorWrapper**: Component React để xử lý dịch thuật trên cả hai nền tảng

    - Trên mobile: Sử dụng thư viện `react-native-translator`
    - Trên web: Sử dụng API dịch thuật thông qua `fetch`

2. **translator.ts**: Chứa logic dịch thuật cho web

3. **languageCode.ts**: Danh sách mã ngôn ngữ hỗ trợ

## Cách sử dụng

```jsx
// Import component
import TranslatorWrapper from './components/TranslatorWrapper';

// Sử dụng trong component của bạn
<TranslatorWrapper from="vi" to="en" value={inputText} onTranslated={(translatedText) => setTranslateText(translatedText)} />;
```

## Lưu ý

-   Trên web, component không hiển thị gì cả, nó chỉ xử lý dịch thuật và gọi callback `onTranslated`
-   Trên mobile, component sẽ được ẩn đi (opacity: 0) nhưng vẫn hoạt động
-   API dịch thuật web sử dụng MyMemory Translation API, có thể thay đổi sang API khác nếu cần
