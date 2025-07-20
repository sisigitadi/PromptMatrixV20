import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export function useSavedPrompts() {
  const [savedPrompts, setSavedPrompts] = useState<any[]>(() => {
    const localData = localStorage.getItem("savedPrompts");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleSavePrompt = (promptData: any) => {
    setSavedPrompts((prev) => [...prev, promptData]);
    toast.success("Prompt berhasil disimpan!");
  };

  const handleExportPrompts = (prompts: any[]) => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "saved_prompts.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast.info("Prompt berhasil diekspor!");
  };

  const handleImportPrompts = (importedPrompts: any[]) => {
    if (
      !Array.isArray(importedPrompts) ||
      !importedPrompts.every(
        (p) => typeof p === "object" && p !== null && "id" in p,
      )
    ) {
      toast.error(
        "Format file impor tidak valid. Pastikan berisi array prompt yang benar.",
      );
      return;
    }

    const existingPromptIds = new Set(savedPrompts.map((p) => p.id));
    const newPrompts = importedPrompts.filter(
      (p) => !existingPromptIds.has(p.id),
    );

    setSavedPrompts((prev) => [...prev, ...newPrompts]);
    toast.success(`${newPrompts.length} prompt berhasil diimpor!`);
    if (importedPrompts.length > newPrompts.length) {
      toast.warn(
        `${importedPrompts.length - newPrompts.length} prompt duplikat tidak diimpor.`,
      );
    }
  };

  const handleDeletePrompt = (id: number) => {
    setSavedPrompts((prev) => prev.filter((prompt) => prompt.id !== id));
    toast.info("Prompt berhasil dihapus!");
  };

  return {
    savedPrompts,
    handleSavePrompt,
    handleExportPrompts,
    handleImportPrompts,
    handleDeletePrompt,
  };
}
