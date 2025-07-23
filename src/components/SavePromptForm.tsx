import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Framework } from "../data/frameworks";

interface SavePromptFormProps {
  currentFrameworkDetails: Framework | null;
  formData: { [key: string]: any };
  customInputs: { [key: string]: string };
  selectedFramework: string | null;
  selectedCategory: string | null;
  naturalLanguageOutput: string;
  jsonOutput: string;
  onSavePrompt: (promptData: any) => void;
}

const SavePromptForm: React.FC<SavePromptFormProps> = ({
  currentFrameworkDetails,
  formData,
  customInputs,
  selectedFramework,
  selectedCategory,
  naturalLanguageOutput,
  jsonOutput,
  onSavePrompt,
}) => {
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

  return (
    <Card className="mt-3">
      <Card.Body className="text-start">
        <Card.Title>Simpan Prompt</Card.Title>
        <Form>
          <Button
            variant="primary"
            onClick={handleSave}
            className="w-100"
            aria-label="Simpan Prompt Saat Ini"
          >
            💾 Simpan Prompt
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SavePromptForm;
