import { OPENROUTER_API_CONFIG } from '@/config/api';

interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface TranslationResponse {
  translatedText: string;
  error?: string;
}

export class TranslationService {
  private static apiKey: string = ''; // Thêm API key của bạn ở đây

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  static async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const prompt = `Translate the following text from ${request.sourceLanguage} to ${request.targetLanguage}:\n${request.text}`;

      const response = await fetch(`${OPENROUTER_API_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENROUTER_API_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Translate the text accurately while maintaining its original meaning and context.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: OPENROUTER_API_CONFIG.temperature,
          max_tokens: OPENROUTER_API_CONFIG.max_tokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return {
        translatedText: data.choices[0].message.content.trim(),
      };
    } catch (error) {
      return {
        translatedText: '',
        error: error instanceof Error ? error.message : 'Lỗi không xác định khi dịch văn bản',
      };
    }
  }
}