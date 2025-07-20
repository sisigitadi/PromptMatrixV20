import { Framework } from "../data/frameworks";
import { SPECIAL_FRAMEWORKS } from "../config";
export const generateNaturalLanguagePrompt = (
  framework: Framework,
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
) => {
  let promptContent = "";

  if (framework.ai_logic_description) {
    promptContent += `AI Logic: ${framework.ai_logic_description}

`;
  }

  const allComponents = [...(framework.components || [])];
  if (framework.dynamicSubcomponents) {
    const triggerValue = params[framework.dynamicSubcomponents.trigger];
    if (triggerValue && framework.dynamicSubcomponents.options[triggerValue]) {
      allComponents.push(
        ...framework.dynamicSubcomponents.options[triggerValue],
      );
    }
  }

  // Calculate max label length for alignment
  let maxLabelLength = 0;
  allComponents.forEach((comp) => {
    const value = params[comp.name];
    const isOptional = comp.optional || false;
    if (value || !isOptional) {
      const displayValue =
        value === "Lainnya..." ? customInputs[comp.name] || "" : value;
      if (displayValue || !isOptional) {
        if (comp.label.length > maxLabelLength) {
          maxLabelLength = comp.label.length;
        }
      }
    }
  });

  allComponents.forEach((comp) => {
    const value = params[comp.name];
    const isOptional = comp.optional || false;
    if (value || !isOptional) {
      const displayValue =
        value === "Lainnya..." ? customInputs[comp.name] || "" : value;
      if (displayValue || !isOptional) {
        const paddedLabel = comp.label.padEnd(maxLabelLength, " ");
        promptContent += `${paddedLabel}: ${displayValue || "[Tidak diisi]"}
`;
      }
    }
  });

  return promptContent.trim();
};
export const generateJsonPrompt = (
  framework: Framework,
  frameworkName: string,
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
): string => {
  const jsonOutput: { [key: string]: any } = {
    id_kerangka: framework.id_kerangka || "",
    nama_kerangka: framework.nama_kerangka_json || frameworkName,
    perspektif_user:
      framework.perspektif_user_json || framework.description || "",
    logika_ai: framework.logika_ai_json || framework.ai_logic_description || "",
    komponen_prompt: {
      PERAN: framework.komponen_prompt_json?.PERAN || "",
      KONTEKS: framework.komponen_prompt_json?.KONTEKS || "",
      TUGAS: framework.komponen_prompt_json?.TUGAS || "",
      "VARIABEL INPUT": {},
      "FORMAT OUTPUT": framework.komponen_prompt_json?.["FORMAT OUTPUT"] || "",
    },
    konteks_tambahan_instruksi_khusus:
      framework.konteks_tambahan_instruksi_khusus_json || "",
    contoh_kalimat: framework.contoh_kalimat_json || "",
    output: framework.output_json || "natural_language_prompt or json_prompt",
  };

  const allComponents = [...framework.components];
  if (framework.dynamicSubcomponents) {
    const triggerValue = params[framework.dynamicSubcomponents.trigger];
    if (triggerValue && framework.dynamicSubcomponents.options[triggerValue]) {
      allComponents.push(
        ...framework.dynamicSubcomponents.options[triggerValue],
      );
    }
  }

  allComponents.forEach((comp) => {
    const value = params[comp.name];
    const isOptional = comp.optional || false;
    if (value || !isOptional) {
      const displayValue =
        value === "Lainnya..." ? customInputs[comp.name] || "" : value;
      if (displayValue || !isOptional) {
        jsonOutput.komponen_prompt["VARIABEL INPUT"][comp.name] =
          displayValue || "";
      }
    }
  });

  if (params.additionalContext) {
    jsonOutput.konteks_tambahan_instruksi_khusus = params.additionalContext;
  }

  return JSON.stringify(jsonOutput, null, 2);
};
export const generateFinalPrompt = (
  framework: Framework,
  frameworkName: string,
  params: { [key: string]: any },
  customInputs: { [key: string]: string },
): string => {
  if (frameworkName === SPECIAL_FRAMEWORKS.MIDJOURNEY) {
    const subject = params.subject || "";
    const style = params.style || "";
    const parameters = framework.components
      .map((comp) => {
        const value = params[comp.name];
        if (!value || comp.name === "subject" || comp.name === "style")
          return null;
        const displayValue =
          value === "Lainnya..." ? customInputs[comp.name] || "" : value;
        if (!displayValue) return null;
        const match = comp.label.match(/--([\w\d.-]+)/);
        if (match && match[1]) {
          return `--${match[1]} ${displayValue}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(" ");
    return `${subject} ${style} ${parameters}`.replace(/\s+/g, " ").trim();
  }
  if (frameworkName === SPECIAL_FRAMEWORKS.STABLE_DIFFUSION) {
    const positive = params.positivePrompt || "";
    const negative = params.negativePrompt || "";
    const techParams = params.technicalParameters || "";
    let output = `Positive Prompt:
${positive}

`;
    if (negative) {
      output += `Negative Prompt:
${negative}

`;
    }
    if (techParams) {
      output += `Parameters: ${techParams}`;
    }
    return output.trim();
  }
  if (SPECIAL_FRAMEWORKS.GENERIC_IMAGE_VIDEO.includes(frameworkName)) {
    const parts: string[] = [];
    framework.components.forEach((comp) => {
      const value = params[comp.name];
      if (value) {
        const displayValue =
          value === "Lainnya..." ? customInputs[comp.name] || "" : value;
        if (displayValue) {
          parts.push(
            `${comp.label.replace(/\(.+\)/, "").trim()}: ${displayValue}`,
          );
        }
      }
    });
    return `A ${framework.toolType} of ${params.subject || frameworkName}. ${parts.join(", ")}.`;
  }
  return generateNaturalLanguagePrompt(framework, params, customInputs);
};
