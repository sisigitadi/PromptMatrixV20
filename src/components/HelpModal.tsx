import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

interface HelpModalProps {
  show: boolean;
  onHide: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ show, onHide }) => {
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string | null>(null);

  const loadMarkdown = async (filePath: string, title: string) => {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setMarkdownContent(text);
      setDocumentTitle(title);
    } catch (error) {
      console.error("Failed to load markdown file:", error);
      setMarkdownContent(
        `Failed to load content. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      setDocumentTitle("Error");
    }
  };

  const handleBackToHelp = () => {
    setMarkdownContent(null);
    setDocumentTitle(null);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      dialogClassName="modal-themed"
    >
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>
          {documentTitle || "Prompt Matrix 2.0 - Bantuan"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-themed">
        {markdownContent ? (
          <>
            <Button
              variant="secondary"
              onClick={handleBackToHelp}
              className="mb-3"
            >
              Kembali ke Bantuan
            </Button>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </>
        ) : (
          <>
            <h5>Selamat Datang di Prompt Matrix 2.0!</h5>
            <div className="d-flex flex-wrap justify-content-around gap-3 mb-4">
              <Button
                variant="primary"
                size="lg"
                className="help-doc-button"
                onClick={() =>
                  loadMarkdown(
                    "/PromptMatrixV20/docs/PanduanPenggunaanInteraktif.md",
                    "Panduan Penggunaan Interaktif",
                  )
                }
                aria-label="Baca Panduan Penggunaan Interaktif"
              >
                <i className="bi bi-book me-2"></i>
                <span>Panduan</span>
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="help-doc-button"
                onClick={() => loadMarkdown("/PromptMatrixV20/docs/FAQ.md", "FAQ")}
                aria-label="Baca FAQ"
              >
                <i className="bi bi-question-circle me-2"></i>
                <span>FAQ</span>
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="help-doc-button"
                onClick={() =>
                  loadMarkdown(
                    "docs/DaftarKerangkaKerja.md",
                    "Daftar Kerangka Kerja",
                  )
                }
                aria-label="Lihat Daftar Kerangka Kerja"
              >
                <i className="bi bi-list-columns-reverse me-2"></i>
                <span>Kerangka Kerja</span>
              </Button>
            </div>
            <p>
              Aplikasi ini dirancang untuk membantu Anda membuat prompt AI yang
              terstruktur dan efektif.
            </p>
            <h6>Alur Kerja Dasar:</h6>
            <ol>
              <li>
                <strong>Pilih Kategori:</strong> Jelajahi kategori prompt di
                panel navigasi kiri.
              </li>
              <li>
                <strong>Pilih Kerangka Kerja:</strong> Pilih kerangka kerja
                spesifik yang sesuai dengan kebutuhan Anda.
              </li>
              <li>
                <strong>Isi Formulir:</strong> Lengkapi semua input yang
                diperlukan di panel tengah. Perhatikan ikon dan tooltip untuk
                panduan.
              </li>
              <li>
                <strong>Pratinjau & Hasilkan:</strong> Lihat pratinjau prompt
                Anda di panel kanan. Anda bisa menyalinnya.
              </li>
            </ol>
            <h6>Fitur Tambahan:</h6>
            <ul>
              <li>
                <strong>Prompt Tersimpan:</strong> Simpan, muat, ekspor, dan
                impor prompt Anda untuk penggunaan di masa mendatang.
              </li>
              <li>
                <strong>Output &rarr; Input:</strong> Gunakan output dari satu
                prompt sebagai input untuk prompt lainnya.
              </li>
            </ul>
            <h6>Prinsip Kualitas Prompt:</h6>
            <p>
              Setiap kerangka kerja di Prompt Matrix 2.0 dirancang untuk menjadi
              Komprehensif, Dinamis, Relevan, Detail, memiliki Logika AI, dan
              Perspektif Pengguna.
            </p>
            <p className="mt-3">
              Untuk informasi lebih lanjut, silakan email ke{" "}
              <strong>
                <a href="mailto:si.sigitadi@gmail.com">si.sigitadi@gmail.com</a>
              </strong>
              .
            </p>
            <hr />
            <div className="d-flex flex-wrap justify-content-around"></div>
          </>
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

export default HelpModal;
