export const OPENROUTER_API_CONFIG = {
  baseURL: 'https://openrouter.ai/api/v1',
  chatEndpoint: '/chat/completions',
  model: 'openrouter/auto',
  model_auto: 'deepseek/deepseek-prover-v2:free',
  temperature: 0.7,
  max_tokens: 2000,
  apiKey: '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',
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