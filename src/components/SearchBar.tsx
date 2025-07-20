import React from "react";
import { Form, Row, Col } from "react-bootstrap";

interface SearchBarProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toolTypeFilter: string;
  handleToolTypeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  handleSearchChange,
  toolTypeFilter,
  handleToolTypeFilterChange,
}) => {
  return (
    <div className="search-bar-container mb-3">
      <Row className="g-2">
        <Col md={9}>
          <Form.Control
            type="text"
            placeholder="Cari kerangka kerja berdasarkan nama atau kata kunci..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Cari kerangka kerja"
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={toolTypeFilter}
            onChange={handleToolTypeFilterChange}
            aria-label="Filter berdasarkan tipe alat"
          >
            <option value="">Semua Tipe</option>
            <option value="text">Teks</option>
            <option value="code">Kode</option>
            <option value="music-composition">Komposisi Musik</option>
            <option value="music-generation">Generasi Musik</option>
            <option value="audio-generation">Generasi Audio</option>
            <option value="image-generation">Generasi Gambar</option>
            <option value="image-editing">Pengeditan Gambar</option>
            <option value="planning">Perencanaan</option>
            <option value="video">Video</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
};

export default SearchBar;
