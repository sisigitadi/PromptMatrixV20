import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaRobot } from "react-icons/fa";

interface AiResponseModalProps {
  show: boolean;
  onHide: () => void;
  aiResponse: string | null;
  aiError: string | null;
  isGenerating: boolean;
}

const AiResponseModal: React.FC<AiResponseModalProps> = ({
  show,
  onHide,
  aiResponse,
  aiError,
  isGenerating,
}) => {
  const handleCopy = () => {
    const textToCopy = aiResponse.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    navigator.clipboard.writeText(textToCopy);
    // Optionally, add a visual feedback like a tooltip or temporary text change
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      dialogClassName="modal-themed"
      animation={true}
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>
          <FaRobot className="me-2" /> Respons AI
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed">
        <div aria-live="polite">
          {isGenerating ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">AI sedang berpikir...</span>
              </Spinner>
              <p className="mt-2">AI sedang berpikir...</p>
            </div>
          ) : aiError ? (
            <div
              className="mt-3 p-3 border rounded text-danger"
              style={{
                backgroundColor: "rgba(220, 53, 69, 0.1)",
                borderColor: "var(--danger-color)",
              }}
            >
              <strong>Error:</strong> {aiError}
            </div>
          ) : aiResponse ? (
            <>
              <div
                className="p-3 border rounded ai-response-container"
                style={{
                  backgroundColor: "var(--panel-card-color)",
                  color: "var(--text-color)",
                  maxHeight: "60vh",
                  overflowY: "auto",
                }}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={dracula}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    blockquote({ node, children, ...props }) {
                      return (
                        <blockquote
                          style={{
                            borderLeft: "4px solid #ccc",
                            margin: "1.5em 10px",
                            padding: "0.5em 10px",
                            color: "#666",
                          }}
                          {...props}
                        >
                          {children}
                        </blockquote>
                      );
                    },
                    // Handle images (URLs)
                    img({ node, ...props }) {
                      // Check if the src is a data URL (Base64) or a regular URL
                      const isBase64 =
                        props.src && props.src.startsWith("data:");
                      return (
                        <div style={{ textAlign: "center", margin: "10px 0" }}>
                          <img
                            {...props}
                            style={{ maxWidth: "100%", height: "auto" }}
                          />
                          {/* Add download button for regular URLs */}
                          {!isBase64 && props.src && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="mt-2"
                              href={props.src}
                              download
                            >
                              Download Image
                            </Button>
                          )}
                        </div>
                      );
                    },
                    // Handle audio
                    audio({ node, ...props }) {
                      return (
                        <div style={{ margin: "10px 0" }}>
                          <audio controls {...props} style={{ width: "100%" }}>
                            Your browser does not support the audio element.
                          </audio>
                          {props.src && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="mt-2"
                              href={props.src}
                              download
                            >
                              Download Audio
                            </Button>
                          )}
                        </div>
                      );
                    },
                    // Handle video
                    video({ node, ...props }) {
                      return (
                        <div style={{ margin: "10px 0" }}>
                          <video controls {...props} style={{ width: "100%" }}>
                            Your browser does not support the video tag.
                          </video>
                          {props.src && (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="mt-2"
                              href={props.src}
                              download
                            >
                              Download Video
                            </Button>
                          )}
                        </div>
                      );
                    },
                  }}
                >
                  {aiResponse}
                </ReactMarkdown>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" onClick={handleCopy}>
                  <FaCopy className="me-2" /> Copy Response
                </Button>
              </div>
            </>
          ) : (
            <p>No AI response to display yet.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-themed">
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AiResponseModal;
