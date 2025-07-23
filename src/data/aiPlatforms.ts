export interface AiPlatformSetting {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "password"; // Add password type for API keys
  placeholder?: string;
  info?: string;
  options?: string[]; // For select types
  optional?: boolean;
  validation?: {
    min_length?: number;
    max_length?: number;
    min_value?: number;
    max_value?: number;
    regex?: string;
  };
}

export interface AiPlatformConfig {
  id: string;
  name: string;
  settings: AiPlatformSetting[];
  models: { id: string; name: string }[]; // List of models for this platform
}

export const AI_PLATFORMS: AiPlatformConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    settings: [
      {
        name: "apiKey",
        label: "API Key Gemini",
        type: "password",
        placeholder: "Masukkan API Key Anda",
        info: "Kunci API untuk mengakses layanan Google Gemini.",
        validation: { min_length: 10 }, // Example validation
      },
      {
        name: "selectedModel",
        label: "Pilih Model Gemini",
        type: "select",
        options: [],
        info: "Pilih model Gemini yang akan digunakan.",
      },
    ],
    models: [
      { id: "gemini-pro", name: "gemini-pro" },
      { id: "gemini-pro-vision", name: "gemini-pro-vision" },
      { id: "gemini-2.5-pro", name: "gemini-2.5-pro" },
      { id: "gemini-2.5-flash", name: "gemini-2.5-flash" },
      {
        id: "gemini-2.5-flash-lite-preview",
        name: "gemini-2.5-flash-lite-preview",
      },
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    settings: [
      {
        name: "hfApiKey",
        label: "API Key Hugging Face",
        type: "password",
        placeholder: "Masukkan API Key Hugging Face Anda",
        info: "Kunci API untuk mengakses layanan Hugging Face Inference API.",
        validation: { min_length: 10 }, // Example validation
      },
      {
        name: "selectedHfModel",
        label: "Pilih Model Hugging Face",
        type: "select",
        options: [],
        info: "Pilih model Hugging Face yang akan digunakan.",
      },
    ],
    models: [
      { id: "default", name: "Pilih Model" },
      {
        id: "HuggingFaceH4/zephyr-7b-beta",
        name: "HuggingFaceH4/zephyr-7b-beta",
      },
      {
        id: "mistralai/Mistral-7B-Instruct-v0.2",
        name: "mistralai/Mistral-7B-Instruct-v0.2",
      },
      { id: "google/gemma-7b-it", name: "google/gemma-7b-it" },
    ],
  },
  // Add more platforms here (e.g., OpenAI, Anthropic)
];
