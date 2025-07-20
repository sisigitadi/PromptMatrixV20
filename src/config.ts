export const COMMON_FIELDS = ["additionalContext"];

export const SPECIAL_FRAMEWORKS = {
  MIDJOURNEY: "Midjourney",
  STABLE_DIFFUSION: "Stable Diffusion",
  GENERIC_IMAGE_VIDEO: [
    "DALL-E 3",
    "Sora (OpenAI)",
    "Pika",
    "Runway",
    "Google VEO",
  ],
};

export const HUGGING_FACE_MODELS = [
  {
    value: "HuggingFaceH4/zephyr-7b-beta",
    label: "HuggingFaceH4/zephyr-7b-beta",
  },
  {
    value: "mistralai/Mistral-7B-Instruct-v0.2",
    label: "mistralai/Mistral-7B-Instruct-v0.2",
  },
  { value: "google/gemma-7b-it", label: "google/gemma-7b-it" },
];
