export const OPENROUTER_API_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  chatEndpoint: '/chat/completions',
  model: 'openrouter/auto',
  model_auto: 'deepseek/deepseek-prover-v2:free',
  temperature: 0.7,
  max_tokens: 2000,
  apiKey: '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',
};

export const GEMINI_API_CONFIG = {
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  model: 'gemini-2.0-flash',
  endpoint: '/generateContent',
  apiKey: 'AIzaSyB8izQ6V0KXuI5MIhD-dbcifI07zr0mIj4'
}

// Hàm gọi API OpenRouter
export const fetchOpenRouterAPI = async (inputText: string) => {
  try {
    const response = await fetch(
      `${OPENROUTER_API_CONFIG.baseURL}${OPENROUTER_API_CONFIG.chatEndpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENROUTER_API_CONFIG.model,
          messages: [{ role: 'user', content: inputText }],
          temperature: OPENROUTER_API_CONFIG.temperature,
          max_tokens: OPENROUTER_API_CONFIG.max_tokens,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    throw error;
  }
};

// Hàm gọi API Gemini
export const fetchGeminiAPI = async (inputText: string) => {
  try {
    const response = await fetch(
      `${GEMINI_API_CONFIG.baseURL}/models/${GEMINI_API_CONFIG.model}:generateContent?key=${GEMINI_API_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: inputText
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    throw error;
  }
};

export const SUPPORTED_LANGUAGES = [
  {
    id: 'vi-en',
    name: 'Việt Nam - Tiếng Anh',
    source: 'vi',
    target: 'en'
  },
  {
    id: 'en-vi',
    name: 'Tiếng Anh - Việt Nam',
    source: 'en',
    target: 'vi'
  },
  // Thêm các cặp ngôn ngữ khác ở đây
];

export const DEFAULT_LANGUAGE = 'vi-en';