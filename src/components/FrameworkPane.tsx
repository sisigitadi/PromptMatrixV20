import React, { useState } from "react";
import {
  Card,
  Form,
  Button,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Spinner,
} from "react-bootstrap";
import { Framework, FrameworkComponent } from "../data/frameworks";
import {
  FaKeyboard,
  FaHashtag,
  FaCalendarAlt,
  FaPalette,
  FaToggleOn,
  FaMousePointer,
  FaCode,
  FaSlidersH,
  FaBan,
  FaMagic,
  FaTimesCircle,
  FaInfoCircle,
  FaImage,
  FaFileAlt,
} from "react-icons/fa";

import { callGeminiApi } from "../utils/api"; // Import API functions

interface FrameworkPaneProps {
  currentFrameworkDetails: Framework | null;
  selectedFramework: string | null;
  formData: { [key: string]: any };
  customInputs: { [key: string]: string };
  dynamicComponentsToRender: FrameworkComponent[];

  onModelSelect: (model: string) => void; // New prop for model selection
  selectedModel: string; // New prop to hold the selected model
  showDevMode: boolean; // New prop to control API-related features

  apiKey: string;
  setApiKey: (key: string) => void;
  handleInputChangeWithValidation: (
    name: string,
    value: string | number,
    inputDetails: any,
  ) => void; // New prop
  handleCustomInputChangeWithValidation: (
    name: string,
    value: string,
    inputDetails: any,
  ) => void; // New prop
  validationErrors: { [key: string]: string }; // New prop
  touchedFields: { [key: string]: boolean }; // New prop
}

const FrameworkPane: React.FC<FrameworkPaneProps> = ({
  currentFrameworkDetails,
  selectedFramework,
  formData,
  customInputs,
  dynamicComponentsToRender,

  onModelSelect,
  selectedModel,
  showDevMode,

  apiKey,
  setApiKey,
  handleInputChangeWithValidation,
  handleCustomInputChangeWithValidation,
  validationErrors,
  touchedFields,
}) => {
  const [isAiAssisting, setIsAiAssisting] = useState<{
    [key: string]: boolean;
  }>({});

  const [hoveredField, setHoveredField] = useState<string | null>(null);

  // This function is a placeholder. In a real application, you'd implement
  // a proper toast notification system (e.g., using react-toastify).
  const showToast = (message: string, type: "success" | "error") => {
    console.log(`Toast (${type}): ${message}`);
    // For demonstration, we'll just use an alert for errors
    if (type === "error") {
      alert(message);
    }
  };

  // Placeholder for isApiKeyEnabled. In a real app, this would come from context or props.
  const isApiKeyEnabled = true; // Assuming API key is always enabled if present

  // Make renderFormComponent more generic to handle both old and new structures
  const renderFormComponent = (inputName: string, inputDetails: any) => {
    // Determine properties based on structure
    const compName = inputName;
    // Use 'label' for old components, 'description' for new VARIABEL_INPUT
    const compLabel =
      inputDetails.label || inputDetails.description || inputName;
    const compType = inputDetails.type;
    const compPlaceholder = inputDetails.placeholder;
    const compOptions = inputDetails.options;
    const compInfo = inputDetails.info; // 'info' is from old FrameworkComponent
    const isOptional = inputDetails.optional; // New property from SOP

    const handleAiAssist = async (
      name: string,
      value: string,
      details: any,
    ) => {
      console.log("handleAiAssist - API Key Check:", {
        apiKey,
        isApiKeyEnabled,
        selectedModel,
      });
      if (!apiKey) {
        alert(
          "API Key tidak ditemukan. Harap masukkan API Key di Pengaturan Mode Pengembang.",
        );
        return;
      }
      if (!isApiKeyEnabled) {
        alert(
          "API Key tidak diaktifkan. Harap aktifkan API Key di Pengaturan Mode Pengembang.",
        );
        return;
      }

      setIsAiAssisting((prev) => ({ ...prev, [name]: true }));

      const currentFramework = currentFrameworkDetails?.framework;
      const aiLogic = currentFramework?.logika_ai || "";
      const userPerspective = currentFramework?.perspektif_user || "";
      const role = currentFramework?.komponen_prompt?.PERAN || "";
      const context = currentFramework?.komponen_prompt?.KONTEKS || "";
      const task = currentFramework?.komponen_prompt?.TUGAS || "";

      const aiPrompt = `Anda adalah asisten prompt engineering. Tugas Anda adalah membantu pengguna mengisi atau menyempurnakan bagian dari prompt mereka.\n\nKerangka Kerja Saat Ini:\nNama: ${currentFramework?.nama_kerangka || "N/A"}\nDeskripsi: ${currentFramework?.description || "N/A"}\n\nKomponen yang sedang diisi:\nJudul Komponen: "${compLabel}"\nDeskripsi Variabel: "${details.description}"\nContoh/Placeholder: "${compPlaceholder || "N/A"}"\n\nIni adalah bagian dari kerangka kerja prompt dengan:\nPERAN: ${role}\nKONTEKS: ${context}\nTUGAS: ${task}\n\nLogika AI untuk kerangka kerja ini adalah: "${aiLogic}"\nPerspektif pengguna untuk kerangka kerja ini adalah: "${userPerspective}"\n\nTeks saat ini di bidang ini adalah: "${value}".\n\nInstruksi:\n- Fokuskan respons Anda secara strikt pada variabel "${details.description}" dan judul komponen "${compLabel}" dalam konteks kerangka kerja ini.\n- Jika teks saat ini kosong, hasilkan teks yang relevan dan sesuai dengan deskripsi variabel, judul komponen, dan konteks kerangka kerja.\n- Jika teks saat ini tidak kosong, perbaiki, perluas, atau sempurnakan teks ini agar lebih baik, lebih lengkap, dan sesuai dengan deskripsi variabel, judul komponen, dan konteks kerangka kerja.\n- Berikan hanya teks yang disarankan, tanpa penjelasan tambahan atau pembuka/penutup.\n- Pastikan output Anda langsung dapat digunakan sebagai nilai untuk bidang input ini.\n`;

      try {
        const response = await callGeminiApi(apiKey, aiPrompt, selectedModel);
        handleInputChangeWithValidation(name, response, details);
      } catch (error) {
        console.error("AI Assist Error:", error);
        showToast(
          `Gagal mendapatkan bantuan AI untuk ${compLabel}. Error: ${error instanceof Error ? error.message : String(error)}`,
          "error",
        );
      } finally {
        setIsAiAssisting((prev) => ({ ...prev, [name]: false }));
      }
    };

    const handleClearInput = (name: string, details: any) => {
      handleInputChangeWithValidation(name, "", details);
    };

    if (!compName) return null;

    const getIconForType = (type: string) => {
      switch (type) {
        case "text":
        case "textarea":
          return <FaKeyboard className="me-2" />;
        case "number":
          return <FaHashtag className="me-2" />;
        case "date":
        case "datetime":
          return <FaCalendarAlt className="me-2" />;
        case "color":
          return <FaPalette className="me-2" />;
        case "select":
        case "multiselect":
          return <FaMousePointer className="me-2" />;
        case "boolean":
          return <FaToggleOn className="me-2" />;
        case "code":
          return <FaCode className="me-2" />;
        case "slider":
          return <FaSlidersH className="me-2" />;
        case "negative_prompt":
          return <FaBan className="me-2" />;
        case "image":
          return <FaImage className="me-2" />;
        case "file":
          return <FaFileAlt className="me-2" />;
        default:
          return null;
      }
    };

    return (
      <Form.Group className="mb-3" controlId={compName} key={compName}>
        <Form.Label className="small mb-1 d-flex align-items-center">
          {getIconForType(compType)}
          {compLabel}

          {compInfo && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-${compName}`}>{compInfo}</Tooltip>}
            >
              <FaInfoCircle className="ms-2" style={{ cursor: "help" }} />
            </OverlayTrigger>
          )}
          {isOptional && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-optional-${compName}`}>
                  Bidang ini bersifat opsional dan dapat dibiarkan kosong.
                </Tooltip>
              }
            >
              <span className="ms-1" style={{ cursor: "help" }}>
                (Opsional)
              </span>
            </OverlayTrigger>
          )}
        </Form.Label>
        {compType === "text" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  type="text"
                  name={compName}
                  placeholder={compPlaceholder}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "number" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  type="number"
                  name={compName}
                  placeholder={compPlaceholder}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "textarea" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  as="textarea"
                  name={compName}
                  placeholder={compPlaceholder}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  rows={Math.max(
                    3,
                    (formData[compName] || "").split("\n").length + 1,
                  )}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "negative_prompt" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <Form.Control
                as="textarea"
                name={compName}
                placeholder={
                  compPlaceholder || "Masukkan hal-hal yang ingin dihindari..."
                }
                value={formData[compName] || ""}
                onChange={(e) =>
                  handleInputChangeWithValidation(
                    compName,
                    e.target.value,
                    inputDetails,
                  )
                }
                onMouseEnter={() => setHoveredField(compName)}
                onMouseLeave={() => setHoveredField(null)}
                rows={Math.max(
                  2,
                  (formData[compName] || "").split("\n").length + 1,
                )}
                isInvalid={
                  touchedFields[compName] && !!validationErrors[compName]
                }
                aria-invalid={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? "true"
                    : "false"
                }
                aria-describedby={
                  touchedFields[compName] && !!validationErrors[compName]
                    ? `validation-feedback-${compName}`
                    : undefined
                }
              />
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "color" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  type="color"
                  name={compName}
                  placeholder={compPlaceholder}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "date" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  type="date"
                  name={compName}
                  placeholder={compPlaceholder}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "slider" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Range
                  name={compName}
                  min={inputDetails.min || 0}
                  max={inputDetails.max || 100}
                  step={inputDetails.step || 1}
                  value={formData[compName] || inputDetails.min || 0}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "slider" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Range
                  name={compName}
                  min={inputDetails.min || 0}
                  max={inputDetails.max || 100}
                  step={inputDetails.step || 1}
                  value={formData[compName] || inputDetails.min || 0}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "select" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Select
                  name={compName}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                >
                  {compOptions?.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </OverlayTrigger>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        )}
        {compType === "boolean" && (
          <div className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              id={compName}
              name={compName}
              label={compLabel}
              checked={!!formData[compName]}
              onChange={(e) =>
                handleInputChangeWithValidation(
                  compName,
                  e.target.checked,
                  inputDetails,
                )
              }
              onMouseEnter={() => setHoveredField(compName)}
              onMouseLeave={() => setHoveredField(null)}
              isInvalid={
                touchedFields[compName] && !!validationErrors[compName]
              }
              aria-invalid={
                touchedFields[compName] && !!validationErrors[compName]
                  ? "true"
                  : "false"
              }
              aria-describedby={
                touchedFields[compName] && !!validationErrors[compName]
                  ? `validation-feedback-${compName}`
                  : undefined
              }
            />
            <Form.Control.Feedback
              type="invalid"
              id={`validation-feedback-${compName}`}
            >
              {validationErrors[compName]}
            </Form.Control.Feedback>
          </div>
        )}
        {compType === "code" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  as="textarea"
                  name={compName}
                  placeholder={compPlaceholder}
                  value={formData[compName] || ""}
                  onChange={(e) =>
                    handleInputChangeWithValidation(
                      compName,
                      e.target.value,
                      inputDetails,
                    )
                  }
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  rows={Math.max(
                    5,
                    (formData[compName] || "").split("\n").length + 1,
                  )}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              {formData[compName] && (
                <Button
                  variant="outline-secondary"
                  onClick={() => handleClearInput(compName, inputDetails)}
                  title="Hapus Input"
                >
                  <FaTimesCircle />
                </Button>
              )}
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
            {showDevMode && (
              <Button
                variant="outline-secondary"
                onClick={() =>
                  handleAiAssist(
                    compName,
                    formData[compName] || "",
                    inputDetails,
                  )
                }
                disabled={isAiAssisting[compName]}
                title="AI Assist"
                className="ms-2"
              >
                {isAiAssisting[compName] ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaMagic />
                )}
              </Button>
            )}
          </div>
        )}
        {compType === "multiselect" && (
          <div className="w-100">
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id={`tooltip-error-${compName}`}>
                  {validationErrors[compName]}
                </Tooltip>
              }
              show={
                (touchedFields[compName] && !!validationErrors[compName]) ||
                (hoveredField === compName && !!validationErrors[compName])
              }
            >
              <>
                <InputGroup>
                  <Form.Select
                    name={compName}
                    value={formData[compName] || []}
                    onChange={(e) =>
                      handleInputChangeWithValidation(
                        compName,
                        Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        ),
                        inputDetails,
                      )
                    }
                    onMouseEnter={() => setHoveredField(compName)}
                    onMouseLeave={() => setHoveredField(null)}
                    className="form-select"
                    multiple
                    isInvalid={
                      touchedFields[compName] && !!validationErrors[compName]
                    }
                    aria-invalid={
                      touchedFields[compName] && !!validationErrors[compName]
                        ? "true"
                        : "false"
                    }
                    aria-describedby={
                      touchedFields[compName] && !!validationErrors[compName]
                        ? `validation-feedback-${compName}`
                        : undefined
                    }
                  >
                    {compOptions?.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback
                    type="invalid"
                    id={`validation-feedback-${compName}`}
                  >
                    {validationErrors[compName]}
                  </Form.Control.Feedback>
                </InputGroup>
              </>
            </OverlayTrigger>
          </div>
        )}
        {compType === "image" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  type="file"
                  accept="image/*"
                  name={compName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handleInputChangeWithValidation(
                          compName,
                          event.target?.result as string,
                          inputDetails,
                        );
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        )}
        {compType === "file" && (
          <div className="d-flex align-items-center">
            <InputGroup className="flex-grow-1">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-error-${compName}`}>
                    {validationErrors[compName]}
                  </Tooltip>
                }
                show={touchedFields[compName] && !!validationErrors[compName]}
              >
                <Form.Control
                  type="file"
                  name={compName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        handleInputChangeWithValidation(
                          compName,
                          event.target?.result as string,
                          inputDetails,
                        );
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  onMouseEnter={() => setHoveredField(compName)}
                  onMouseLeave={() => setHoveredField(null)}
                  isInvalid={
                    touchedFields[compName] && !!validationErrors[compName]
                  }
                  aria-invalid={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    touchedFields[compName] && !!validationErrors[compName]
                      ? `validation-feedback-${compName}`
                      : undefined
                  }
                />
              </OverlayTrigger>
              <Form.Control.Feedback
                type="invalid"
                id={`validation-feedback-${compName}`}
              >
                {validationErrors[compName]}
              </Form.Control.Feedback>
            </InputGroup>
          </div>
        )}
      </Form.Group>
    );
  };

  return (
    <Card className="flex-grow-1 h-100">
      <Card.Body className="d-flex flex-column">
        <h2 className="h5 pb-3 mb-3 border-bottom">
          3. Komponen Kerangka Kerja:
        </h2>
        {!currentFrameworkDetails ? (
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center placeholder-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              className="bi bi-card-list mb-3 text-muted"
              viewBox="0 0 16 16"
            >
              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
              <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
            </svg>
            <h5 className="text-muted">Pilih Kerangka Kerja</h5>
            <p className="text-muted small text-center">
              Silakan pilih kategori dan kerangka kerja dari panel di sebelah
              kiri untuk melihat komponennya di sini.
            </p>
          </div>
        ) : (
          <>
            <h3 className="h5">{selectedFramework}</h3>
            <p className="small">
              {currentFrameworkDetails.framework.description}
            </p>
            <div className="flex-grow-1 overflow-auto pe-2">
              <Form>
                {currentFrameworkDetails.framework.components
                  ? currentFrameworkDetails.framework.components.map((comp) =>
                      renderFormComponent(comp.name, comp),
                    )
                  : currentFrameworkDetails.framework.komponen_prompt
                        ?.VARIABEL_INPUT
                    ? Object.entries(
                        currentFrameworkDetails.framework.komponen_prompt
                          .VARIABEL_INPUT,
                      ).map(([name, details]) =>
                        renderFormComponent(name, details),
                      )
                    : null}
                {dynamicComponentsToRender.length > 0 && (
                  <div
                    className="p-2 mb-3 rounded"
                    style={{ backgroundColor: "rgba(0, 255, 255, 0.1)" }}
                  >
                    <p className="small mb-0">
                      Bagian ini muncul berdasarkan pilihan Anda di atas. Ini
                      adalah bidang dinamis yang menyesuaikan dengan kebutuhan
                      spesifik Anda.
                    </p>
                  </div>
                )}
                {dynamicComponentsToRender.map((comp) =>
                  renderFormComponent(comp.name, comp),
                )}
              </Form>
              {currentFrameworkDetails.examples &&
                currentFrameworkDetails.examples.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h4 className="h6 mb-3">Contoh Few-Shot:</h4>
                    {currentFrameworkDetails.examples.map((example, index) => (
                      <div
                        key={index}
                        className="mb-3 p-3 border rounded"
                        style={{ backgroundColor: "var(--background-color)" }}
                      >
                        <p className="small mb-1">
                          <strong>Input Contoh:</strong>
                        </p>
                        <pre
                          className="small text-muted"
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {example.input}
                        </pre>
                        <p className="small mb-1">
                          <strong>Output Contoh:</strong>
                        </p>
                        <pre
                          className="small text-muted"
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {example.output}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default FrameworkPane;
