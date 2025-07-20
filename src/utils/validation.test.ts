import { validateInput } from "./validation";

describe("validateInput", () => {
  it("should return an empty string for valid optional empty input", () => {
    const details = { optional: true, description: "Test Field", type: "text" };
    expect(validateInput("testField", "", details)).toBe("");
  });

  it("should return an error for invalid empty non-optional input", () => {
    const details = {
      optional: false,
      description: "Test Field",
      type: "text",
    };
    expect(validateInput("testField", "", details)).toBe(
      "Bidang 'testField' tidak boleh kosong.",
    );
  });

  it("should return an error for text exceeding max_length", () => {
    const details = {
      type: "text",
      validation: { max_length: 5 },
      description: "Test Field",
    };
    expect(validateInput("testField", "123456", details)).toBe(
      "Bidang 'testField' tidak boleh lebih dari 5 karakter.",
    );
  });

  it("should return an error for text below min_length", () => {
    const details = {
      type: "text",
      validation: { min_length: 5 },
      description: "Test Field",
    };
    expect(validateInput("test", "", details)).toBe(
      "Input ini membutuhkan minimal 5 karakter.",
    );
  });

  it("should return an error for number below min_value", () => {
    const details = {
      type: "number",
      validation: { min_value: 10 },
      description: "Test Number",
    };
    expect(validateInput("testNumber", 5, details)).toBe(
      "Nilai minimal yang diizinkan adalah 10.",
    );
  });

  it("should return an error for number above max_value", () => {
    const details = {
      type: "number",
      validation: { max_value: 100 },
      description: "Test Number",
    };
    expect(validateInput("testNumber", 105, details)).toBe(
      "Nilai maksimal yang diizinkan adalah 100.",
    );
  });

  it("should return an error for invalid regex pattern", () => {
    const details = {
      type: "text",
      validation: { regex: "^\\d+$" },
      description: "Test Regex",
    };
    expect(validateInput("testRegex", "abc", details)).toBe(
      "Format input tidak valid. Mohon periksa kembali.",
    );
  });

  it("should return an error for date before min_date", () => {
    const details = {
      type: "date",
      validation: { min_date: "2023-01-01" },
      description: "Test Date",
    };
    expect(validateInput("testDate", "2022-12-31", details)).toBe(
      "Tanggal untuk bidang 'testDate' tidak boleh sebelum 2023-01-01.",
    );
  });

  it("should return an error for date after max_date", () => {
    const details = {
      type: "date",
      validation: { max_date: "2023-12-31" },
      description: "Test Date",
    };
    expect(validateInput("testDate", "2024-01-01", details)).toBe(
      "Tanggal untuk bidang 'testDate' tidak boleh setelah 2023-12-31.",
    );
  });

  it("should return an empty string for valid input", () => {
    const details = {
      type: "text",
      validation: { min_length: 3, max_length: 10 },
      description: "Valid Text",
    };
    expect(validateInput("valid", "test", details)).toBe("");
  });

  it("should return an empty string for valid optional empty input with validation rules", () => {
    const details = {
      optional: true,
      type: "text",
      validation: { min_length: 5 },
      description: "Optional Text",
    };
    expect(validateInput("optionalText", "", details)).toBe("");
  });
});
