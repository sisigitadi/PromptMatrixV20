import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

interface SavedPromptsInlineProps {
  savedPrompts: any[];
  onLoadPrompt: (promptData: any) => void;
  onDeletePrompt: (id: number) => void;
}

const SavedPromptsInline: React.FC<SavedPromptsInlineProps> = ({
  savedPrompts,
  onLoadPrompt,
  onDeletePrompt,
}) => {
  return (
    <Card className="mt-3">
      <Card.Header>Prompt Tersimpan</Card.Header>
      <Card.Body className="p-2 text-start">
        {savedPrompts.length === 0 ? (
          <p className="mb-0 text-muted small">
            Belum ada prompt yang disimpan.
          </p>
        ) : (
          <ListGroup variant="flush">
            {savedPrompts.map((prompt) => (
              <ListGroup.Item
                key={prompt.id}
                className="d-flex justify-content-between align-items-center py-2 px-1"
              >
                <div className="flex-grow-1 me-2">
                  <strong className="d-block">{prompt.frameworkName}</strong>
                  <small className="d-block">
                    {new Date(prompt.timestamp).toLocaleString()}
                  </small>
                  <small
                    className="d-block text-truncate"
                    style={{ maxWidth: "200px" }}
                  >
                    {prompt.naturalLanguageOutput.substring(0, 50)}...
                  </small>
                </div>
                <div className="d-flex flex-column">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mb-1"
                    onClick={() => onLoadPrompt(prompt)}
                    aria-label="Muat Prompt"
                  >
                    Muat
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeletePrompt(prompt.id)}
                    aria-label="Hapus Prompt"
                  >
                    Hapus
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default SavedPromptsInline;
