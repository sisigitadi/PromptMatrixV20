import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

interface DevModeSettingsModalProps {
  show: boolean;
  onHide: () => void;
  selectedModel: string;
  onModelSelect: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeyEnabled: boolean;

  formData: { [key: string]: any };
  handleInputChangeWithValidation: (
    name: string,
    value: string | number,
    inputDetails?: any,
  ) => void;
  validationErrors: { [key: string]: string };
}

const DevModeSettingsModal: React.FC<DevModeSettingsModalProps> = ({
  show,
  onHide,
  selectedModel,
  onModelSelect,
  apiKey,
  setApiKey,
  isApiKeyEnabled,

  formData,
  handleInputChangeWithValidation,
  validationErrors,
}) => {
  const [showApiKey, setShowApiKey] = useState(false); // State for toggling API Key visibility

  return (
    <Modal show={show} onHide={onHide} centered dialogClassName="modal-themed">
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>Pengaturan Mode Pengembang</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed text-start">
        <Form.Group className="mb-3" controlId="geminiModelSelect">
          <Form.Label
            className="small mb-1"
            style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
          >
            Pilih Model Gemini:
          </Form.Label>
          <Form.Select
            name="geminiModel"
            value={selectedModel}
            onChange={(e) => onModelSelect(e.target.value)}
            className="form-select"
            style={{
              padding: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
            }}
          >
            <option value="gemini-2.5-pro">gemini-2.5-pro</option>
            <option value="gemini-2.5-flash">gemini-2.5-flash</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="apiKeyInput">
          <Form.Label
            className="small mb-1"
            style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
          >
            API Key Gemini:
          </Form.Label>
          <InputGroup>
            <Form.Control
              type={showApiKey ? "text" : "password"}
              placeholder="Masukkan API Key Anda"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                padding: "clamp(0.5rem, 1vw, 0.75rem)",
                fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
              }}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowApiKey((prev) => !prev)}
              aria-label={
                showApiKey ? "Sembunyikan API Key" : "Tampilkan API Key"
              }
            >
              {showApiKey ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="temperatureInput">
          <Form.Label
            className="small mb-1"
            style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
          >
            Temperature (0-1):
          </Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            max="1"
            placeholder="0.7"
            value={formData.temperature || ""}
            onChange={(e) =>
              handleInputChangeWithValidation(
                "temperature",
                parseFloat(e.target.value),
                { validation: { min_value: 0, max_value: 1 } },
              )
            }
            isInvalid={!!validationErrors.temperature}
            style={{
              padding: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
            }}
          />
          {validationErrors.temperature && (
            <Form.Control.Feedback type="invalid">
              {validationErrors.temperature}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="topPInput">
          <Form.Label
            className="small mb-1"
            style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
          >
            Top P (0-1):
          </Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            max="1"
            placeholder="0.9"
            value={formData.top_p || ""}
            onChange={(e) =>
              handleInputChangeWithValidation(
                "top_p",
                parseFloat(e.target.value),
                { validation: { min_value: 0, max_value: 1 } },
              )
            }
            isInvalid={!!validationErrors.top_p}
            style={{
              padding: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
            }}
          />
          {validationErrors.top_p && (
            <Form.Control.Feedback type="invalid">
              {validationErrors.top_p}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="topKInput">
          <Form.Label
            className="small mb-1"
            style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
          >
            Top K (&gt;=1):
          </Form.Label>
          <Form.Control
            type="number"
            min="1"
            placeholder="40"
            value={formData.top_k || ""}
            onChange={(e) =>
              handleInputChangeWithValidation(
                "top_k",
                parseInt(e.target.value),
                { validation: { min_value: 1 } },
              )
            }
            isInvalid={!!validationErrors.top_k}
            style={{
              padding: "clamp(0.5rem, 1vw, 0.75rem)",
              fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
            }}
          />
          {validationErrors.top_k && (
            <Form.Control.Feedback type="invalid">
              {validationErrors.top_k}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="modal-footer-themed">
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DevModeSettingsModal;
