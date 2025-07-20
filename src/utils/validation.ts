interface ValidationRules {
  min_length?: number;
  max_length?: number;
  regex?: string;
  min_value?: number;
  max_value?: number;
  min_date?: string;
  max_date?: string;
}

interface InputDetails {
  optional?: boolean;
  validation?: ValidationRules;
  label?: string;
  name?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  info?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const validateInput = (
  name: string,
  value: string | number,
  details: InputDetails,
): string => {
  const validationRules = details.validation;
  const isValueEmpty =
    value === "" ||
    value === null ||
    (typeof value === "string" && value.trim() === "");

  // 1. Handle optional empty fields first
  if (details.optional && isValueEmpty) {
    return ""; // No error for optional empty fields
  }

  // 2. Handle non-optional empty fields
  if (!details.optional && isValueEmpty) {
    // If it's empty and non-optional, check min_length first if applicable
    if (
      validationRules &&
      typeof value === "string" &&
      validationRules.min_length &&
      value.length < validationRules.min_length
    ) {
      return `Input ini membutuhkan minimal ${validationRules.min_length} karakter.`;
    }
    // If no specific min_length error, then it's just a generic "tidak boleh kosong" error
    return `Bidang '${details.label || details.name || name}' tidak boleh kosong.`;
  }

  // 3. Handle other validation rules for non-empty values
  if (validationRules) {
    if (
      validationRules.min_length &&
      typeof value === "string" &&
      value.length < validationRules.min_length
    ) {
      return `Input ini membutuhkan minimal ${validationRules.min_length} karakter.`;
    }
    if (
      validationRules.max_length &&
      typeof value === "string" &&
      value.length > validationRules.max_length
    ) {
      return `Bidang '${details.label || details.name || name}' tidak boleh lebih dari ${validationRules.max_length} karakter.`;
    }
    if (
      validationRules.regex &&
      typeof value === "string" &&
      !new RegExp(validationRules.regex).test(value)
    ) {
      return `Format input tidak valid. Mohon periksa kembali.`;
    }
    if (
      validationRules.min_value &&
      typeof value === "number" &&
      value < validationRules.min_value
    ) {
      return `Nilai minimal yang diizinkan adalah ${validationRules.min_value}.`;
    }
    if (
      validationRules.max_value &&
      typeof value === "number" &&
      value > validationRules.max_value
    ) {
      return `Nilai maksimal yang diizinkan adalah ${validationRules.max_value}.`;
    }
    if (
      validationRules.min_date &&
      new Date(value as string) < new Date(validationRules.min_date)
    ) {
      return `Tanggal untuk bidang '${details.label || details.name || name}' tidak boleh sebelum ${validationRules.min_date}.`;
    }
    if (
      validationRules.max_date &&
      new Date(value as string) > new Date(validationRules.max_date)
    ) {
      return `Tanggal untuk bidang '${details.label || details.name || name}' tidak boleh setelah ${validationRules.max_date}.`;
    }
  }

  return ""; // No errors
};
