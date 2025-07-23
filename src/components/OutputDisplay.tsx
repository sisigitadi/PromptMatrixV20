import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Card,
  ButtonGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { callGeminiApi } from "../utils/api"; // Import the API function
import { FaCog, FaRocket } from "react-icons/fa"; // Import FaCog and FaRocket icons
import DevModeSettingsModal from "./DevModeSettingsModal"; // Import DevModeSettingsModal
import AiResponseModal from "./AiResponseModal"; // Import AiResponseModal

import { Framework } from "../data/frameworks";

interface OutputDisplayProps {
  naturalLanguageOutput: string;
  jsonOutput: string;
  previewNaturalLanguageOutput: string;
  previewJsonOutput: string;
  currentFrameworkDetails: Framework | null;
  formData: { [key: string]: any };
  customInputs: { [key: string]: string };
  selectedFramework: string | null;
  selectedCategory: string | null;
  onUseAsInput: (outputContent: string) => void;
  onShowSavedPrompts: () => void;
  showDevMode: boolean;
  onSavePrompt: (promptData: any) => void;
  apiKey: string; // Added
  setApiKey: (key: string) => void; // Added
  selectedModel: string; // Added
  onModelSelect: (model: string) => void; // Added
  isApiKeyEnabled: boolean; // Added
  handleInputChangeWithValidation: (
    name: string,
    value: string | number,
    inputDetails: any,
  ) => void; // New prop
  validationErrors: { [key: string]: string }; // New prop
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  naturalLanguageOutput,
  jsonOutput,
  previewNaturalLanguageOutput,
  previewJsonOutput,
  currentFrameworkDetails,
  formData,
  customInputs,
  selectedFramework,
  selectedCategory,
  onUseAsInput,
  onShowSavedPrompts,
  showDevMode,
  onSavePrompt,
  apiKey,
  setApiKey,
  selectedModel,
  onModelSelect,
  isApiKeyEnabled,
  handleInputChangeWithValidation,
  validationErrors,
}) => {
  const [outputType, setOutputType] = useState<"natural" | "json">("natural");
  const [copyButtonText, setCopyButtonText] = useState("Salin");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showDevModeSettingsModal, setShowDevModeSettingsModal] =
    useState(false); // New state for modal visibility
  const [showAiResponseModal, setShowAiResponseModal] = useState(false); // New state for AI Response Modal

  const showPreview = !naturalLanguageOutput && !jsonOutput;

  const currentOutput =
    outputType === "natural"
      ? showPreview
        ? previewNaturalLanguageOutput
        : naturalLanguageOutput
      : showPreview
        ? previewJsonOutput
        : jsonOutput;

  const [editableOutput, setEditableOutput] = useState<string>(currentOutput);
  const [isEditable, setIsEditable] = useState<boolean>(false); // New state for edit mode
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for the textarea

  useEffect(() => {
    setEditableOutput(currentOutput);
    setIsEditable(false); // Reset edit mode on new output
  }, [currentOutput]);

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditable]);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = editableOutput
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText("Tersalin!");
      setTimeout(() => setCopyButtonText("Salin"), 2000);
    });
  };

  const handleGenerateClick = async () => {
    console.log("handleGenerateClick - API Key Check:", {
      apiKey,
      isApiKeyEnabled,
      selectedModel,
    });
    setIsGenerating(true);
    setAiResponse(null);
    setAiError(null);
    setShowAiResponseModal(true); // Show modal immediately when generation starts

    const generationConfig = {
      temperature: formData.temperature
        ? parseFloat(formData.temperature)
        : undefined,
      topP: formData.top_p ? parseFloat(formData.top_p) : undefined,
      topK: formData.top_k ? parseInt(formData.top_k) : undefined,
    };

    try {
      const apiResult = await callGeminiApi(
        apiKey,
        editableOutput,
        selectedModel,
        generationConfig,
      );

      if (apiResult.error) {
        setAiError(apiResult.error);
        setAiResponse(null);
      } else {
        setAiResponse(apiResult);
        setAiError(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        setAiError(error.message);
      } else {
        setAiError("An unknown error occurred.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!currentFrameworkDetails || !selectedFramework || !selectedCategory) {
      setSaveModalMessage(
        "Tidak dapat menyimpan prompt: Detail framework atau kategori tidak lengkap.",
      );
      setShowSaveModal(true);
      return;
    }

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
    setSaveModalMessage("Prompt berhasil disimpan!");
    setShowSaveModal(true);
  };

  return (
    <>
      <Card className="flex-grow-1 h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          4. Pratinjau Prompt:
          <ButtonGroup aria-label="Output Type">
            <Button
              variant={outputType === "natural" ? "primary" : "outline-primary"}
              onClick={() => setOutputType("natural")}
            >
              📝 Natural
            </Button>
            <Button
              variant={outputType === "json" ? "primary" : "outline-primary"}
              onClick={() => setOutputType("json")}
            >
              📄 JSON
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body className="d-flex flex-column text-start">
          {/* Output Display Section (approx 75%) */}
          <div
            style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Form.Control
              as="textarea"
              ref={textareaRef}
              value={editableOutput}
              onChange={(e) => setEditableOutput(e.target.value)}
              rows={Math.max(10, (editableOutput || "").split("\n").length + 1)}
              className={`flex-grow-1 mb-3 output-textarea ${isEditable ? "editable" : ""}`}
              placeholder="Prompt Anda yang terstruktur lengkap akan disusun dan ditampilkan di sini..."
              aria-label="Output Prompt"
              readOnly={!isEditable} // Control editability
              style={{
                padding: "clamp(1rem, 2vw, 1.5rem)",
                fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                maxHeight: "60vh", // Add a max height
                overflowY: "auto", // Add scroll if content exceeds max height
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            />
            {outputType === "natural" && (
              <div className="d-flex justify-content-end small mb-2">
                <span>Karakter: {editableOutput.length}</span>
                <span className="ms-3">
                  Kata:{" "}
                  {editableOutput.trim().split(/\s+/).filter(Boolean).length}
                </span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-3">
              <Button
                variant="success"
                onClick={handleCopy}
                className="flex-grow-1 me-2"
              >
                📋 {copyButtonText}
              </Button>
              <Button
                variant="info"
                onClick={toggleEdit}
                className="flex-grow-1 me-2"
              >
                {isEditable ? "Selesai Edit" : "✏️ Edit"}
              </Button>
              <Button
                variant="warning"
                onClick={() => onUseAsInput(currentOutput)}
                className="flex-grow-1 me-2"
              >
                ➡️ Output &rarr; Input
              </Button>
            </div>

            {showDevMode && (
              <div className="d-flex justify-content-between mb-3">
                <Button
                  variant="info"
                  onClick={handleGenerateClick}
                  className="flex-grow-1 me-2"
                  disabled={isGenerating} // Disable button when generating
                >
                  {isGenerating ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaRocket /> Generate AI Response
                    </>
                  )}
                </Button>

                <Button
                  variant="outline-info"
                  onClick={() => setShowDevModeSettingsModal(true)}
                  className="flex-grow-0"
                  title="Pengaturan Mode Pengembang"
                  aria-label="Pengaturan Mode Pengembang"
                >
                  <FaCog />
                </Button>
              </div>
            )}
          </div>

          {/* Save Prompt Section (approx 25%) */}
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <Card.Title className="mb-3">5. Simpan Prompt:</Card.Title>
            <div className="d-flex justify-content-between">
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex-grow-1 me-2"
              >
                💾 Simpan Prompt
              </Button>
              <Button
                variant="info"
                onClick={onShowSavedPrompts}
                className="flex-grow-1"
              >
                📚 Prompt Tersimpan
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Save Confirmation Modal */}
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        centered
        dialogClassName="modal-themed"
      >
        <Modal.Header closeButton className="modal-header-themed">
          <Modal.Title>Notifikasi Penyimpanan</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-themed">
          <p>{saveModalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer-themed">
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {showDevMode && (
        <DevModeSettingsModal
          show={showDevModeSettingsModal}
          onHide={() => setShowDevModeSettingsModal(false)}
          selectedModel={selectedModel}
          onModelSelect={onModelSelect}
          apiKey={apiKey}
          setApiKey={setApiKey}
          formData={formData}
          handleInputChangeWithValidation={handleInputChangeWithValidation}
          validationErrors={validationErrors}
        />
      )}

      <AiResponseModal
        show={showAiResponseModal}
        onHide={() => setShowAiResponseModal(false)}
        aiResponse={aiResponse}
        aiError={aiError}
        isGenerating={isGenerating}
      />
    </>
  );
};

export default OutputDisplay;
