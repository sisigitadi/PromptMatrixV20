import { useState, useMemo, useEffect, useCallback } from "react";
import {
  PROMPT_FRAMEWORKS,
  Framework,
  PromptFrameworksType,
} from "../data/frameworks";

export function useFrameworkNavigation(dispatch: (action: any) => void) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null,
  );
  const [openSubcategories, setOpenSubcategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [manualOpenSubcategories, setManualOpenSubcategories] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [toolTypeFilter, setToolTypeFilter] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const allFrameworksFlattened = useMemo(() => {
    const flattened: (Framework & {
      category: string;
      subcategory: string;
      name: string;
    })[] = [];
    Object.entries(PROMPT_FRAMEWORKS).forEach(
      ([categoryName, subcategories]) => {
        if (subcategories) {
          Object.entries(subcategories).forEach(
            ([subcategoryName, frameworks]) => {
              if (frameworks) {
                Object.entries(frameworks).forEach(
                  ([frameworkName, framework]) => {
                    flattened.push({
                      ...framework,
                      category: categoryName,
                      subcategory: subcategoryName,
                      name: frameworkName,
                    });
                  },
                );
              }
            },
          );
        }
      },
    );
    return flattened;
  }, []);

  const filteredFrameworks = useMemo(() => {
    setIsLoading(true); // Start loading
    const result: PromptFrameworksType = {};

    // If no category is selected and no search/filter is active, return empty results
    if (!selectedCategory && !debouncedSearchQuery && !toolTypeFilter) {
      setIsLoading(false);
      return {};
    }

    const filtered = allFrameworksFlattened.filter((framework) => {
      const searchTerm = debouncedSearchQuery.toLowerCase();
      const searchMatch =
        framework.name.toLowerCase().includes(searchTerm) ||
        (framework.id_kerangka &&
          framework.id_kerangka.toLowerCase().includes(searchTerm)) ||
        (framework.nama_kerangka &&
          framework.nama_kerangka.toLowerCase().includes(searchTerm)) ||
        framework.description.toLowerCase().includes(searchTerm) ||
        (framework.perspektif_user &&
          framework.perspektif_user.toLowerCase().includes(searchTerm)) ||
        (framework.logika_ai &&
          framework.logika_ai.toLowerCase().includes(searchTerm)) ||
        (framework.components &&
          framework.components.some(
            (component) =>
              (component.name &&
                component.name.toLowerCase().includes(searchTerm)) ||
              (component.label &&
                component.label.toLowerCase().includes(searchTerm)) ||
              (component.placeholder &&
                component.placeholder.toLowerCase().includes(searchTerm)) ||
              (component.info &&
                component.info.toLowerCase().includes(searchTerm)) ||
              (component.options &&
                component.options.some((option) =>
                  option.toLowerCase().includes(searchTerm),
                )),
          )) ||
        (framework.komponen_prompt &&
          framework.komponen_prompt.VARIABEL_INPUT &&
          Object.values(framework.komponen_prompt.VARIABEL_INPUT).some(
            (input) =>
              (input.name && input.name.toLowerCase().includes(searchTerm)) ||
              (input.label && input.label.toLowerCase().includes(searchTerm)) ||
              (input.placeholder &&
                input.placeholder.toLowerCase().includes(searchTerm)) ||
              (input.info && input.info.toLowerCase().includes(searchTerm)) ||
              (input.options &&
                input.options.some((option) =>
                  option.toLowerCase().includes(searchTerm),
                )),
          )) ||
        (framework.dynamicSubcomponents &&
          Object.values(framework.dynamicSubcomponents.options).some(
            (subcomponentsArray) =>
              subcomponentsArray.some(
                (component) =>
                  (component.name &&
                    component.name.toLowerCase().includes(searchTerm)) ||
                  (component.label &&
                    component.label.toLowerCase().includes(searchTerm)) ||
                  (component.placeholder &&
                    component.placeholder.toLowerCase().includes(searchTerm)) ||
                  (component.info &&
                    component.info.toLowerCase().includes(searchTerm)) ||
                  (component.options &&
                    component.options.some((option) =>
                      option.toLowerCase().includes(searchTerm),
                    )),
              ),
          ));

      const toolTypeMatch =
        !toolTypeFilter || framework.toolType === toolTypeFilter;
      const categoryMatch =
        !selectedCategory || framework.category === selectedCategory;

      return searchMatch && toolTypeMatch && categoryMatch;
    });

    console.log(
      "filteredFrameworks useMemo - filtered array length:",
      filtered.length,
    );

    filtered.forEach((framework) => {
      if (!result[framework.category]) result[framework.category] = {};
      if (!result[framework.category][framework.subcategory])
        result[framework.category][framework.subcategory] = {};
      result[framework.category][framework.subcategory][framework.name] =
        framework;
    });

    setIsLoading(false); // Stop loading after filtering is done
    return result;
  }, [
    debouncedSearchQuery,
    toolTypeFilter,
    allFrameworksFlattened,
    selectedCategory,
  ]);

  useEffect(() => {
    const subcategoriesToOpen: { [key: string]: boolean } = {};
    if (debouncedSearchQuery || toolTypeFilter) {
      Object.values(filteredFrameworks).forEach((categoryObj) => {
        Object.keys(categoryObj).forEach((subcategoryName) => {
          subcategoriesToOpen[subcategoryName] = true;
        });
      });
    }
    setOpenSubcategories(subcategoriesToOpen);
  }, [filteredFrameworks, debouncedSearchQuery, toolTypeFilter]);

  const findFramework = (
    categoryName: string,
    frameworkName: string,
  ): { framework: Framework; category: string; subcategory: string } | null => {
    const found = allFrameworksFlattened.find(
      (f) => f.category === categoryName && f.name === frameworkName,
    );
    if (found) {
      const { category, subcategory, ...framework } = found;
      return { framework: framework as Framework, category, subcategory };
    }
    return null;
  };

  const findFrameworkInAllCategories = useCallback(
    (
      frameworkName: string,
    ): {
      framework: Framework;
      category: string;
      subcategory: string;
    } | null => {
      const found = allFrameworksFlattened.find(
        (f) => f.name === frameworkName,
      );
      if (found) {
        const { category, subcategory, ...framework } = found;
        return { framework: framework as Framework, category, subcategory };
      }
      return null;
    },
    [allFrameworksFlattened],
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedFramework(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setToolTypeFilter("");
  };

  const handleFrameworkSelect = (
    frameworkName: string,
    categoryNameFromSearch?: string,
    subcategoryNameFromSearch?: string,
  ) => {
    console.log("handleFrameworkSelect called with:", {
      frameworkName,
      categoryNameFromSearch,
      subcategoryNameFromSearch,
    });
    let frameworkDetails: {
      framework: Framework;
      category: string;
      subcategory: string;
    } | null = null;

    if (categoryNameFromSearch && subcategoryNameFromSearch) {
      frameworkDetails = {
        framework:
          PROMPT_FRAMEWORKS[categoryNameFromSearch][subcategoryNameFromSearch][
            frameworkName
          ],
        category: categoryNameFromSearch,
        subcategory: subcategoryNameFromSearch,
      };
    } else if (selectedCategory) {
      frameworkDetails = findFramework(selectedCategory, frameworkName);
    }

    if (!frameworkDetails) return;

    setSelectedCategory(frameworkDetails.category);
    setSelectedFramework(frameworkName);
    setToolTypeFilter(frameworkDetails.framework.toolType || "");

    // Reset search and toolTypeFilter to ensure only the selected subcategory is open
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setToolTypeFilter("");

    // Explicitly open only the selected subcategory
    setManualOpenSubcategories({
      [frameworkDetails.subcategory]: true,
    });

    const initialFormData: { [key: string]: any } = {};
    // Logic to handle both old and new framework structures
    const inputs = frameworkDetails.framework.komponen_prompt?.VARIABEL_INPUT
      ? Object.entries(
          frameworkDetails.framework.komponen_prompt.VARIABEL_INPUT,
        )
      : frameworkDetails.framework.components.map((c) => [c.name, c]);

    for (const [name, details] of inputs) {
      if (details.type === "select" && details.options?.length) {
        // If the first option is a placeholder, select the second option as default
        if (
          details.options[0].startsWith("Pilih") ||
          details.options[0].startsWith("Select")
        ) {
          initialFormData[name] = details.options[1] || ""; // Use the second option, or empty if only one option
        } else {
          initialFormData[name] = details.options[0];
        }
      } else {
        initialFormData[name] = details.default ?? "";
      }
    }

    dispatch({ type: "SET_FORM_DATA", payload: { formData: initialFormData } });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedCategory(null); // Reset selected category when searching
    setManualOpenSubcategories({}); // Clear manual toggles when searching
  };

  const handleToolTypeFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setToolTypeFilter(e.target.value);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedCategory(null); // Reset selected category when filtering by tool type
    setManualOpenSubcategories({}); // Clear manual toggles when filtering
  };

  const handleSubcategoryToggle = (subcategoryName: string) => {
    setManualOpenSubcategories((prev) => {
      const isOpen = prev[subcategoryName];
      if (isOpen) {
        // If currently open, close it
        return { [subcategoryName]: false };
      } else {
        // If currently closed, open it and close all others
        return { [subcategoryName]: true };
      }
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedFramework(null);

    setSearchQuery("");
    setDebouncedSearchQuery("");
    setToolTypeFilter("");
  };

  const currentFrameworkDetails = useMemo(() => {
    const details = selectedFramework
      ? findFrameworkInAllCategories(selectedFramework)
      : null;
    console.log("currentFrameworkDetails useMemo result:", details);
    return details;
  }, [selectedFramework, findFrameworkInAllCategories]);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedFramework,
    setSelectedFramework,
    openSubcategories,
    manualOpenSubcategories,
    searchQuery,
    debouncedSearchQuery, // Expose debouncedSearchQuery
    toolTypeFilter,
    handleToolTypeFilterChange,
    filteredFrameworks,
    currentFrameworkDetails,
    handleCategorySelect,
    handleFrameworkSelect,
    handleSearchChange,
    handleSubcategoryToggle,
    handleBackToCategories,
    findFrameworkInAllCategories,
    isLoading,
  };
}
