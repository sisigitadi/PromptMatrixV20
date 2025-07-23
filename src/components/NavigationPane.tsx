import React from "react";
import { Card, Button, Collapse, Spinner, Row, Col } from "react-bootstrap";
import { PromptFrameworksType, CATEGORY_ORDER } from "../data/frameworks";
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

import { categoryCssNameMap } from "../utils/categoryUtils";

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
          {CATEGORY_ORDER.map((categoryName, index) => (
            <Col xs={12} md={6} key={categoryName}>
              <Button
                onClick={() => handleCategorySelect(categoryName)}
                className={`btn w-100 category-button-dynamic ${categoryCssNameMap[categoryName]}${selectedCategory === categoryName ? " active" : ""}`}
                aria-pressed={selectedCategory === categoryName}
                style={{
                  background: `var(--category-${categoryCssNameMap[categoryName]}-static)`,
                  borderColor: `var(--category-${categoryCssNameMap[categoryName]}-static)`,
                }}
              >
                {categoryName}
              </Button>
            </Col>
          ))}
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
                              className={`subcategory-header w-100 text-start d-flex justify-content-between align-items-center category-button-dynamic ${categoryCssNameMap[categoryName]}`}
                              onClick={() =>
                                handleSubcategoryToggle(subcategoryName)
                              }
                              aria-expanded={
                                openSubcategories[subcategoryName] ||
                                manualOpenSubcategories[subcategoryName]
                              }
                              style={{
                                background: `var(--category-${categoryCssNameMap[categoryName]}-static)`,
                                borderColor: `var(--category-${categoryCssNameMap[categoryName]}-static)`,
                              }}
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
                                      className={`category-card w-100 text-start p-3 category-button-dynamic ${categoryCssNameMap[categoryName]}`}
                                      onClick={() =>
                                        handleFrameworkSelect(
                                          name,
                                          categoryName,
                                          subcategoryName,
                                        )
                                      }
                                      style={{
                                        background: `var(--category-${categoryName.toLowerCase().replace(/ /g, "-").replace(/&/g, "and")}-static)`,
                                        borderColor: `var(--category-${categoryName.toLowerCase().replace(/ /g, "-").replace(/&/g, "and")}-static)`,
                                      }}
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
