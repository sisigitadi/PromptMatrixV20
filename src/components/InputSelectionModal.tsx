import React, { useState, useMemo } from "react";
import { FaTimesCircle } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Accordion,
  InputGroup,
} from "react-bootstrap";
import { PROMPT_FRAMEWORKS, Framework } from "../data/frameworks";

interface InputSelectionModalProps {
  show: boolean;
  onHide: () => void;
  outputToChain: string;
  onSelectInput: (
    frameworkName: string,
    inputName: string,
    inputValue: string,
  ) => void;
}

interface FlatFramework {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  details: Framework;
}

const InputSelectionModal: React.FC<InputSelectionModalProps> = ({
  show,
  onHide,
  outputToChain,
  onSelectInput,
}) => {
  const [selectedFrameworkName, setSelectedFrameworkName] = useState<
    string | null
  >(null);
  const [selectedInputName, setSelectedInputName] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleFrameworkSelect = (frameworkName: string) => {
    setSelectedFrameworkName(frameworkName);
    setSelectedInputName(null);
  };

  const handleInputSelect = (inputName: string) => {
    setSelectedInputName(inputName);
  };

  const handleConfirm = () => {
    if (selectedFrameworkName && selectedInputName) {
      onSelectInput(selectedFrameworkName, selectedInputName, outputToChain);
      onHide();
    }
  };

  const flatFrameworks = useMemo(() => {
    const allFrameworks: FlatFramework[] = [];
    Object.entries(PROMPT_FRAMEWORKS).forEach(
      ([categoryName, subcategories]) => {
        Object.entries(subcategories).forEach(
          ([subcategoryName, frameworks]) => {
            Object.entries(frameworks).forEach(
              ([frameworkName, frameworkDetails]) => {
                allFrameworks.push({
                  name: frameworkName,
                  description: frameworkDetails.description,
                  category: categoryName,
                  subcategory: subcategoryName,
                  details: frameworkDetails,
                });
              },
            );
          },
        );
      },
    );
    return allFrameworks;
  }, []);

  const searchResults = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    if (!searchTerm) {
      return [];
    }
    return flatFrameworks.filter(
      (fw) =>
        fw.name.toLowerCase().includes(searchTerm) ||
        fw.description.toLowerCase().includes(searchTerm) ||
        fw.category.toLowerCase().includes(searchTerm) ||
        fw.subcategory.toLowerCase().includes(searchTerm) ||
        fw.details.components?.some(
          (comp) =>
            comp.name.toLowerCase().includes(searchTerm) ||
            comp.label.toLowerCase().includes(searchTerm),
        ) ||
        (fw.details.komponen_prompt?.["VARIABEL INPUT"] &&
          Object.values(fw.details.komponen_prompt["VARIABEL INPUT"]).some(
            (input) =>
              input.name.toLowerCase().includes(searchTerm) ||
              input.label.toLowerCase().includes(searchTerm),
          )) ||
        (fw.details.dynamicSubcomponents &&
          Object.values(fw.details.dynamicSubcomponents.options).some(
            (subcomps) =>
              subcomps.some(
                (comp) =>
                  comp.name.toLowerCase().includes(searchTerm) ||
                  comp.label.toLowerCase().includes(searchTerm),
              ),
          )),
    );
  }, [searchQuery, flatFrameworks]);

  const getFrameworkDetails = (name: string): Framework | undefined => {
    return flatFrameworks.find((fw) => fw.name === name)?.details;
  };

  const currentFrameworkDetails = selectedFrameworkName
    ? getFrameworkDetails(selectedFrameworkName)
    : undefined;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>Gunakan Output sebagai Input</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed">
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Cari kerangka kerja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari kerangka kerja target"
          />
          {searchQuery && (
            <Button
              variant="outline-secondary"
              onClick={() => setSearchQuery("")}
              title="Hapus Pencarian"
            >
              <FaTimesCircle />
            </Button>
          )}
        </InputGroup>

        <div className="d-flex" style={{ height: "60vh" }}>
          <div className="flex-grow-1 overflow-auto pe-3">
            <h5>Pilih Kerangka Kerja Target:</h5>
            {searchQuery.length > 0 ? (
              <ListGroup>
                {searchResults.map((fw) => (
                  <ListGroup.Item
                    key={fw.name}
                    action
                    active={selectedFrameworkName === fw.name}
                    onClick={() => handleFrameworkSelect(fw.name)}
                    className="ms-3 list-group-item-themed"
                    role="button"
                    aria-current={
                      selectedFrameworkName === fw.name ? "true" : undefined
                    }
                  >
                    <strong>{fw.name}</strong>
                    <br />
                    <small>
                      {fw.category} &gt; {fw.subcategory}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Accordion alwaysOpen>
                {Object.entries(PROMPT_FRAMEWORKS)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([categoryName, subcategories]) => (
                    <Accordion.Item eventKey={categoryName} key={categoryName}>
                      <Accordion.Header className="accordion-header-themed">
                        {categoryName}
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        <ListGroup variant="flush">
                          {Object.entries(subcategories)
                            .sort((a, b) => a[0].localeCompare(b[0]))
                            .map(([subcategoryName, frameworks]) => (
                              <div key={subcategoryName}>
                                <ListGroup.Item className="subcategory-header list-group-item-themed">
                                  {subcategoryName}
                                </ListGroup.Item>
                                {Object.entries(frameworks)
                                  .sort((a, b) => a[0].localeCompare(b[0]))
                                  .map(([frameworkName, details]) => (
                                    <ListGroup.Item
                                      key={frameworkName}
                                      action
                                      active={
                                        selectedFrameworkName === frameworkName
                                      }
                                      onClick={() =>
                                        handleFrameworkSelect(frameworkName)
                                      }
                                      className="ms-3 list-group-item-themed"
                                      role="button"
                                      aria-current={
                                        selectedFrameworkName === frameworkName
                                          ? "true"
                                          : undefined
                                      }
                                    >
                                      {frameworkName}
                                    </ListGroup.Item>
                                  ))}
                              </div>
                            ))}
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
              </Accordion>
            )}
          </div>

          {selectedFrameworkName && currentFrameworkDetails && (
            <div className="flex-grow-1 overflow-auto ps-3">
              <h5>Pilih Input untuk {selectedFrameworkName}:</h5>
              <ListGroup>
                {currentFrameworkDetails.components
                  ?.sort((a, b) => a.label.localeCompare(b.label))
                  .map((comp) => (
                    <ListGroup.Item
                      key={comp.name}
                      action
                      active={selectedInputName === comp.name}
                      onClick={() => handleInputSelect(comp.name)}
                      className="list-group-item-themed"
                      role="button"
                      aria-current={
                        selectedInputName === comp.name ? "true" : undefined
                      }
                    >
                      {comp.label} ({comp.type})
                    </ListGroup.Item>
                  ))}
                {currentFrameworkDetails.komponen_prompt?.["VARIABEL INPUT"] &&
                  Object.entries(
                    currentFrameworkDetails.komponen_prompt["VARIABEL INPUT"],
                  )
                    .sort(([, a], [, b]) => a.label.localeCompare(b.label))
                    .map(([name, details]) => (
                      <ListGroup.Item
                        key={name}
                        action
                        active={selectedInputName === name}
                        onClick={() => handleInputSelect(name)}
                        className="list-group-item-themed"
                        role="button"
                        aria-current={
                          selectedInputName === name ? "true" : undefined
                        }
                      >
                        {details.label || name} ({details.type})
                      </ListGroup.Item>
                    ))}
                {currentFrameworkDetails.dynamicSubcomponents &&
                  Object.values(
                    currentFrameworkDetails.dynamicSubcomponents.options,
                  ).flatMap((comps) =>
                    comps
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((comp) => (
                        <ListGroup.Item
                          key={comp.name}
                          action
                          active={selectedInputName === comp.name}
                          onClick={() => handleInputSelect(comp.name)}
                          className="list-group-item-themed"
                          role="button"
                          aria-current={
                            selectedInputName === comp.name ? "true" : undefined
                          }
                        >
                          {comp.label} ({comp.type}) (Dynamic)
                        </ListGroup.Item>
                      )),
                  )}
              </ListGroup>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-themed">
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!selectedFrameworkName || !selectedInputName}
        >
          Konfirmasi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InputSelectionModal;
