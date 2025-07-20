import React from "react";
import { Card, Button, Collapse, Spinner, Row, Col } from "react-bootstrap";
import { PromptFrameworksType } from "../data/frameworks";
import SearchBar from "./SearchBar";

interface NavigationPaneProps {
  selectedCategory: string | null;
  searchQuery: string;
  debouncedSearchQuery: string;
  filteredFrameworks: PromptFrameworksType;
  openSubcategories: { [key: string]: boolean };
  manualOpenSubcategories: { [key: string]: boolean };
  handleCategorySelect: (category: string) => void;
  handleBackToCategories: () => void;
  handleFrameworkSelect: (
    frameworkName: string,
    categoryName?: string,
    subcategoryName?: string,
  ) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubcategoryToggle: (subcategoryName: string) => void;
  toolTypeFilter: string;
  handleToolTypeFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isLoading: boolean; // Added isLoading prop
}

const NavigationPane: React.FC<NavigationPaneProps> = ({
  selectedCategory,
  searchQuery,
  debouncedSearchQuery,
  filteredFrameworks,
  openSubcategories,
  manualOpenSubcategories,
  handleCategorySelect,
  handleBackToCategories,
  handleFrameworkSelect,
  handleSearchChange,
  handleSubcategoryToggle,
  toolTypeFilter,
  handleToolTypeFilterChange,

  isLoading,
}) => {
  return (
    <Card className="flex-grow-1 h-100">
      <Card.Body className="d-flex flex-column p-4">
        <h2 className="h5 pb-3 mb-3 border-bottom">
          1. Pilih Kategori / Cari Kerangka Kerja:
        </h2>
        <Row className="mb-3 g-2">
          <Col xs={12} md={6}>
            <Button
              key={"Gambar & Desain"}
              variant={
                selectedCategory === "Gambar & Desain" ? "primary" : "secondary"
              }
              onClick={() => handleCategorySelect("Gambar & Desain")}
              className={`category-toggle-button w-100 ${selectedCategory === "Gambar & Desain" ? "active" : ""}`}
              aria-pressed={selectedCategory === "Gambar & Desain"}
            >
              🎨 Gambar & Desain
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button
              key={"Audio & Musik"}
              variant={
                selectedCategory === "Audio & Musik" ? "primary" : "secondary"
              }
              onClick={() => handleCategorySelect("Audio & Musik")}
              className={`category-toggle-button w-100 ${selectedCategory === "Audio & Musik" ? "active" : ""}`}
              aria-pressed={selectedCategory === "Audio & Musik"}
            >
              🎵 Audio & Musik
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button
              key={"Prompt Ringkas"}
              variant={
                selectedCategory === "Prompt Ringkas" ? "primary" : "secondary"
              }
              onClick={() => handleCategorySelect("Prompt Ringkas")}
              className={`category-toggle-button w-100 ${selectedCategory === "Prompt Ringkas" ? "active" : ""}`}
              aria-pressed={selectedCategory === "Prompt Ringkas"}
            >
              ✨ Prompt Ringkas
            </Button>
          </Col>
          <Col xs={12} md={6}>
            <Button
              key={"Prompt Proyek"}
              variant={
                selectedCategory === "Prompt Proyek" ? "primary" : "secondary"
              }
              onClick={() => handleCategorySelect("Prompt Proyek")}
              className={`category-toggle-button w-100 ${selectedCategory === "Prompt Proyek" ? "active" : ""}`}
              aria-pressed={selectedCategory === "Prompt Proyek"}
            >
              🚀 Prompt Proyek
            </Button>
          </Col>
          <Col xs={12} md={6} className="mx-auto">
            {" "}
            {/* Center on larger screens */}
            <Button
              key={"Teks & Konten"}
              variant={
                selectedCategory === "Teks & Konten" ? "primary" : "secondary"
              }
              onClick={() => handleCategorySelect("Teks & Konten")}
              className={`category-toggle-button w-100 ${selectedCategory === "Teks & Konten" ? "active" : ""}`}
              aria-pressed={selectedCategory === "Teks & Konten"}
            >
              ✍️ Teks & Konten
            </Button>
          </Col>
        </Row>
        <SearchBar
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          toolTypeFilter={toolTypeFilter}
          handleToolTypeFilterChange={handleToolTypeFilterChange}
        />

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div className="navigation-section flex-grow-1 d-flex flex-column">
            <h2 className="h5 pb-3 mb-3 border-bottom">
              2. Pilih Sub-Kategori & Kerangka Kerja:
            </h2>

            {Object.keys(filteredFrameworks || {}).length > 0 ? (
              <div className="framework-list flex-grow-1">
                {Object.entries(filteredFrameworks || {})
                  .sort((a, b) => a[0].localeCompare(b[0])) // Sort categories alphabetically
                  .map(([categoryName, subcategories]) => (
                    <div key={categoryName}>
                      {(selectedCategory ||
                        debouncedSearchQuery ||
                        toolTypeFilter) && (
                        <h3 className="h6 pb-2 mt-3 mb-2 border-bottom">
                          {categoryName}
                        </h3>
                      )}
                      {Object.entries(subcategories || {})
                        .sort((a, b) => a[0].localeCompare(b[0])) // Sort subcategories alphabetically
                        .map(([subcategoryName, frameworks]) => (
                          <div key={subcategoryName}>
                            <Button
                              variant="link"
                              className="subcategory-header w-100 text-start d-flex justify-content-between align-items-center"
                              onClick={() =>
                                handleSubcategoryToggle(subcategoryName)
                              }
                              aria-expanded={
                                openSubcategories[subcategoryName] ||
                                manualOpenSubcategories[subcategoryName]
                              }
                            >
                              {subcategoryName}{" "}
                              <span
                                className={`subcategory-icon ${openSubcategories[subcategoryName] || manualOpenSubcategories[subcategoryName] ? "open" : ""}`}
                              >
                                ▼
                              </span>
                            </Button>
                            <Collapse
                              in={
                                openSubcategories[subcategoryName] ||
                                manualOpenSubcategories[subcategoryName]
                              }
                            >
                              <div className="category-grid">
                                {Object.entries(frameworks || {})
                                  .sort((a, b) => a[0].localeCompare(b[0]))
                                  .map(([name, details]) => (
                                    <Button
                                      key={name}
                                      variant="link"
                                      className="category-card w-100 text-start"
                                      onClick={() =>
                                        handleFrameworkSelect(
                                          name,
                                          categoryName,
                                          subcategoryName,
                                        )
                                      }
                                    >
                                      <strong>📄 {name}</strong>
                                    </Button>
                                  ))}
                              </div>
                            </Collapse>
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted mt-4">
                {debouncedSearchQuery || toolTypeFilter
                  ? "Tidak ada kerangka kerja yang cocok dengan filter Anda."
                  : "Pilih kategori di atas untuk melihat kerangka kerja."}
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default NavigationPane;
