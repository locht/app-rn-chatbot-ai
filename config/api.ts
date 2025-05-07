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