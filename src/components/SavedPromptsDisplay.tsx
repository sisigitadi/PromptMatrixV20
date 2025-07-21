import React, { useState } from "react";
import {
  Modal,
  Button,
  ListGroup,
  Form,
  InputGroup,
  Collapse,
} from "react-bootstrap";

interface SavedPromptsDisplayProps {
  show: boolean;
  onHide: () => void;
  savedPrompts: any[];
  onLoadPrompt: (promptData: any) => void;
  onDeletePrompt: (id: number) => void;
  onExportPrompts: (prompts: any[]) => void;
  onImportPrompts: (prompts: any[]) => void;
  onRenamePrompt: (id: number, newName: string) => void;
}

const SavedPromptsDisplay: React.FC<SavedPromptsDisplayProps> = ({
  show,
  onHide,
  savedPrompts,
  onLoadPrompt,
  onDeletePrompt,
  onExportPrompts,
  onImportPrompts,
  onRenamePrompt,
}) => {
  const [sortBy, setSortBy] = useState("dateDesc");
  const [promptToRename, setPromptToRename] = useState<any>(null);
  const [newPromptName, setNewPromptName] = useState("");
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);

  const handleToggleExpand = (promptId: string) => {
    setExpandedPromptId(expandedPromptId === promptId ? null : promptId);
  };

  const handleRenameClick = (prompt: any) => {
    setPromptToRename(prompt);
    setNewPromptName(prompt.frameworkName);
  };

  const handleSaveRename = () => {
    if (promptToRename && newPromptName.trim() !== "") {
      onRenamePrompt(promptToRename.id, newPromptName.trim());
      setPromptToRename(null);
      setNewPromptName("");
    }
  };

  const handleCancelRename = () => {
    setPromptToRename(null);
    setNewPromptName("");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
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

  const sortedPrompts = [...savedPrompts].sort((a, b) => {
    if (sortBy === "nameAsc") {
      return a.frameworkName.localeCompare(b.frameworkName);
    } else if (sortBy === "dateDesc") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>📚 Prompt Tersimpan</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Button
              variant="success"
              className="me-2"
              onClick={() => onExportPrompts(savedPrompts)}
              aria-label="Ekspor Semua Prompt Tersimpan"
            >
              📤 Ekspor
            </Button>
            <Button
              variant="info"
              onClick={handleImport}
              aria-label="Impor Prompt dari File"
            >
              📥 Impor
            </Button>
          </div>
          <Form.Group controlId="sortBySelect" className="mb-0">
            <Form.Select
              size="sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as string)}
              className="form-select-themed"
            >
              <option value="dateDesc">Urutkan: Terbaru</option>
              <option value="nameAsc">Urutkan: Nama (A-Z)</option>
            </Form.Select>
          </Form.Group>
        </div>
        {savedPrompts.length === 0 ? (
          <p className="text-center">Belum ada prompt yang disimpan.</p>
        ) : (
          <ListGroup className="saved-prompts-list">
            {sortedPrompts.map((prompt) => (
              <ListGroup.Item
                key={prompt.id}
                className="list-group-item-themed"
              >
                {promptToRename?.id === prompt.id ? (
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={newPromptName}
                      onChange={(e) => setNewPromptName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSaveRename()
                      }
                      autoFocus
                    />
                    <Button variant="success" onClick={handleSaveRename}>
                      Simpan
                    </Button>
                    <Button variant="secondary" onClick={handleCancelRename}>
                      Batal
                    </Button>
                  </InputGroup>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{prompt.frameworkName}</strong>
                      <br />
                      <small>
                        Disimpan: {""}
                        {new Date(
                          prompt.versions[prompt.versions.length - 1].timestamp,
                        ).toLocaleString()}
                      </small>
                    </div>
                    <div className="prompt-actions">
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleToggleExpand(prompt.id)}
                        title="Lihat Riwayat Versi"
                        aria-label="Lihat Riwayat Versi"
                      >
                        {expandedPromptId === prompt.id
                          ? "⬆️ Sembunyikan"
                          : "⬇️ Riwayat"}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          onLoadPrompt(
                            prompt.versions[prompt.versions.length - 1],
                          )
                        }
                        title="Muat Versi Terbaru"
                        aria-label="Muat Versi Terbaru"
                      >
                        📥
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleRenameClick(prompt)}
                        title="Ganti Nama"
                        aria-label="Ganti Nama Prompt"
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDeletePrompt(prompt.id)}
                        title="Hapus Prompt"
                        aria-label="Hapus Prompt"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                )}
                <Collapse in={expandedPromptId === prompt.id}>
                  <div className="mt-3 pt-2 border-top">
                    <h6>Riwayat Versi:</h6>
                    <ListGroup variant="flush">
                      {prompt.versions.map((version: any, index: number) => (
                        <ListGroup.Item
                          key={index}
                          className="d-flex justify-content-between align-items-center small list-group-item-themed"
                        >
                          <span>
                            Versi {index + 1} -{" "}
                            {new Date(version.timestamp).toLocaleString()}
                          </span>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onLoadPrompt(version)}
                            title="Muat Versi Ini"
                            aria-label={`Muat Versi ${index + 1}`}
                          >
                            Muat
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Collapse>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-themed">
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SavedPromptsDisplay;
