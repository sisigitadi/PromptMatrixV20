import React, { useState } from "react";
import { Button, Card, ListGroup, Collapse } from "react-bootstrap";
import { Framework } from "../data/frameworks";

interface PromptActionsProps {
  currentFrameworkDetails: Framework | null;
  formData: { [key: string]: any };
  customInputs: { [key: string]: string };
  selectedFramework: string | null;
  selectedCategory: string | null;
  naturalLanguageOutput: string;
  jsonOutput: string;
  savedPrompts: any[];
  onSavePrompt: (promptData: any) => void;
  onLoadPrompt: (promptData: any) => void;
  onDeletePrompt: (id: number) => void;
  onExportPrompts: (prompts: any[]) => void;
  onImportPrompts: (prompts: any[]) => void;
}

const PromptActions: React.FC<PromptActionsProps> = ({
  currentFrameworkDetails,
  formData,
  customInputs,
  selectedFramework,
  selectedCategory,
  naturalLanguageOutput,
  jsonOutput,
  savedPrompts,
  onSavePrompt,
  onLoadPrompt,
  onDeletePrompt,
  onExportPrompts,
  onImportPrompts,
}) => {
  const [openSavedPrompts, setOpenSavedPrompts] = useState(false);

  const handleSave = () => {
    if (!currentFrameworkDetails || !selectedFramework || !selectedCategory)
      return;

    const promptData = {
      id: Date.now(), // Simple unique ID
      timestamp: new Date().toISOString(),
      category: selectedCategory,
      frameworkName: selectedFramework,
      frameworkDetails: currentFrameworkDetails,
      formData: formData,
      customInputs: customInputs,
      naturalLanguageOutput: naturalLanguageOutput,
      jsonOutput: jsonOutput,
    };
    onSavePrompt(promptData);
  };

  const handleExport = () => {
    onExportPrompts(savedPrompts);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json"; // Only accept JSON files for now
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            onImportPrompts(importedData);
          } catch (error) {
            console.error("Error parsing imported file:", error);
            alert(
              "Gagal mengimpor prompt. Pastikan file adalah JSON yang valid.",
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-grow-1 me-2 glow-on-hover"
            aria-label="Simpan Prompt Saat Ini"
          >
            💾 Simpan Prompt
          </Button>
          <Button
            variant="success"
            onClick={handleExport}
            className="flex-grow-1 me-2 glow-on-hover"
            aria-label="Ekspor Semua Prompt Tersimpan"
          >
            📤 Ekspor Prompt
          </Button>
          <Button
            variant="info"
            onClick={handleImport}
            className="flex-grow-1 me-2 glow-on-hover"
            aria-label="Impor Prompt dari File"
          >
            📥 Impor Prompt
          </Button>
          <Button
            onClick={() => setOpenSavedPrompts(!openSavedPrompts)}
            aria-controls="saved-prompts-collapse-text"
            aria-expanded={openSavedPrompts}
            variant="warning"
            className="flex-grow-1 glow-on-hover"
          >
            📚 Prompt Tersimpan ({savedPrompts.length})
          </Button>
        </div>
        <Collapse in={openSavedPrompts}>
          <div
            id="saved-prompts-collapse-text"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {savedPrompts.length === 0 ? (
              <p className="mb-0 small">Belum ada prompt yang disimpan.</p>
            ) : (
              <ListGroup variant="flush">
                {savedPrompts.map((prompt) => (
                  <ListGroup.Item
                    key={prompt.id}
                    className="d-flex justify-content-between align-items-start py-2 px-1"
                  >
                    <div className="flex-grow-1 me-2">
                      <strong
                        className="d-block text-truncate"
                        style={{ maxWidth: "calc(100% - 140px)" }}
                      >
                        {prompt.frameworkName}
                      </strong>
                      <small className="d-block">
                        {new Date(prompt.timestamp).toLocaleString()}
                      </small>
                      <small className="d-block">
                        {prompt.naturalLanguageOutput.substring(0, 50)}...
                      </small>
                    </div>
                    <div
                      className="d-flex flex-column"
                      style={{ width: "120px" }}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mb-1"
                        onClick={() => onLoadPrompt(prompt)}
                      >
                        Muat
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDeletePrompt(prompt.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default PromptActions;
