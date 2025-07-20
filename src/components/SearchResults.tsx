import React from "react";
import { ListGroup } from "react-bootstrap";
import { PromptFrameworksType } from "../data/frameworks";

interface SearchResultsProps {
  filteredFrameworks: PromptFrameworksType;
  handleFrameworkSelect: (
    frameworkName: string,
    categoryName?: string,
    subcategoryName?: string,
  ) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  filteredFrameworks,
  handleFrameworkSelect,
}) => {
  return (
    <div className="framework-list flex-grow-1">
      {Object.entries(filteredFrameworks).flatMap(
        ([categoryName, subcategories]) =>
          Object.entries(subcategories).map(([subcategoryName, frameworks]) => (
            <div key={`${categoryName}-${subcategoryName}`}>
              <h5>
                {subcategoryName} ({categoryName})
              </h5>
              <ListGroup>
                {Object.entries(frameworks).map(([name, details]) => (
                  <ListGroup.Item
                    key={name}
                    action
                    onClick={() =>
                      handleFrameworkSelect(name, categoryName, subcategoryName)
                    }
                    role="button"
                    aria-label={`Pilih kerangka kerja ${name} dalam subkategori ${subcategoryName} dari kategori ${categoryName}`}
                  >
                    {name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )),
      )}
    </div>
  );
};

export default SearchResults;
