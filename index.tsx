import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PROMPT_FRAMEWORKS, CATEGORY_ORDER, Framework, FrameworkComponent, PromptFrameworksType } from '@/data/frameworks';
import { COMMON_FIELDS } from '@/config';
import { generateNaturalLanguagePrompt, generateJsonPrompt } from '@/utils/promptGenerators';
import { callGeminiApi } from '@/utils/api';
import { validateInput } from '@/utils/validation';

const Header = React.lazy(() => import('@/components/Header'));
const NavigationPane = React.lazy(() => import('@/components/NavigationPane'));
const FrameworkPane = React.lazy(() => import('@/components/FrameworkPane'));
const OutputDisplay = React.lazy(() => import('@/components/OutputDisplay'));
const InputSelectionModal = React.lazy(() => import('@/components/InputSelectionModal'));
const SavedPromptsDisplay = React.lazy(() => import('@/components/SavedPromptsDisplay'));
const HelpModal = React.lazy(() => import('@/components/HelpModal'));
const ErrorBoundary = React.lazy(() => import('@/components/ErrorBoundary'));
const Footer = React.lazy(() => import('@/components/Footer'));


import { useFrameworkNavigation } from '@/hooks/useFrameworkNavigation';

const App = () => {
  const dispatch = (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case 'SET_FORM_DATA':
        setFormData(action.payload.formData);
        setCustomInputs({}); // Reset custom inputs when new framework is selected
        break;
      case 'RESET_FORM':
        setFormData({});
        setCustomInputs({});
        break;
      default:
        break;
    }
  };
  const {
    selectedCategory,
    setSelectedCategory,
    selectedFramework,
    setSelectedFramework,
    openSubcategories,
    searchQuery,
    debouncedSearchQuery,
    toolTypeFilter,
    handleToolTypeFilterChange,
    filteredFrameworks,
    manualOpenSubcategories,
    currentFrameworkDetails,
    handleCategorySelect,
    handleFrameworkSelect,
    handleSearchChange,
    handleSubcategoryToggle,
    handleBackToCategories,
    findFrameworkInAllCategories,
    isLoading: isNavigationLoading, // Destructure and rename isLoading
  } = useFrameworkNavigation(dispatch);


  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [customInputs, setCustomInputs] = useState<{ [key: string]: string }>({});

  const [commonFields, setCommonFields] = useState<{ [key: string]: any }>({});
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return sessionStorage.getItem('selectedModel') || 'gemini-1.0-pro';
  });
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showDevMode, setShowDevMode] = useState<boolean>(() => {
    return localStorage.getItem('showDevMode') === 'true';
  });
  const [isApiKeyEnabled, setIsApiKeyEnabled] = useState<boolean>(() => {
    return localStorage.getItem('isApiKeyEnabled') === 'true';
  });
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('apiKey') || '';
  });
  
  const [showSavedPrompts, setShowSavedPrompts] = useState(false); // State for showing saved prompts modal
  const [showNavigation, setShowNavigation] = useState(true); // State for showing/hiding navigation pane
  const [appBackgroundColor, setAppBackgroundColor] = useState('var(--background-color)');
  const [isLightTheme, setIsLightTheme] = useState(false); // New state for theme
  const [showInputSelectionModal, setShowInputSelectionModal] = useState(false);
  const [outputToChain, setOutputToChain] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);


  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = (name: string, value: string | number) => {
    if (COMMON_FIELDS.includes(name)) {
      setCommonFields(prev => ({ ...prev, [name]: value }));
    }
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      // Re-validate the input after change
      const inputDetails = currentFrameworkDetails?.framework.komponen_prompt?.['VARIABEL INPUT']?.[name] || currentFrameworkDetails?.framework.components?.find(comp => comp.name === name);
      if (inputDetails) {
        const error = validateInput(name, value, inputDetails);
        setValidationErrors(prevErrors => ({ ...prevErrors, [name]: error }));
      }
      return newFormData;
    });
  };

  const handleCustomInputChange = (name: string, value: string) => {
    setCustomInputs(prev => {
      const newCustomInputs = { ...prev, [name]: value };
      // Re-validate the input after change
      const inputDetails = currentFrameworkDetails?.framework.komponen_prompt?.['VARIABEL INPUT']?.[name] || currentFrameworkDetails?.framework.components?.find(comp => comp.name === name);
      if (inputDetails) {
        const error = validateInput(name, value, inputDetails);
        setValidationErrors(prevErrors => ({ ...prevErrors, [name]: error }));
      }
      return newCustomInputs;
    });
  };

  const handleInputChangeWithValidation = (name: string, value: string | number) => {
    setTouchedFields(prev => ({ ...prev, [name]: true })); // Mark as touched
    if (COMMON_FIELDS.includes(name)) {
      setCommonFields(prev => ({ ...prev, [name]: value }));
    }
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      return newFormData;
    });
  };

  const handleCustomInputChangeWithValidation = (name: string, value: string) => {
    setTouchedFields(prev => ({ ...prev, [name]: true })); // Mark as touched
    setCustomInputs(prev => {
      const newCustomInputs = { ...prev, [name]: value };
      return newCustomInputs;
    });
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };

  

  const handleLogoClick = () => {
    setLogoClickCount(prevCount => {
      const newCount = prevCount + 1;

      if (newCount >= 9) { // Changed to 9 clicks
        setShowDevMode(true);
        setIsApiKeyEnabled(true); // Set API Key to ENABLED when Dev Mode is activated
        setLogoClickCount(0); // Reset count after showing dev mode
        console.log('Dev Mode activated. showDevMode:', true, 'isApiKeyEnabled:', true);
      }
      return newCount;
    });
  };



  useEffect(() => {
    if (showDevMode) {
      setAppBackgroundColor('var(--dev-mode-active-background)'); // Use subtle dark grey for active Dev Mode
    } else {
      setAppBackgroundColor('var(--background-color)'); // Default color
    }
    localStorage.setItem('showDevMode', String(showDevMode));
  }, [showDevMode]);

  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightTheme]);



  

  

  useEffect(() => {
    sessionStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  

  useEffect(() => {
    localStorage.setItem('isApiKeyEnabled', String(isApiKeyEnabled));
  }, [isApiKeyEnabled]);

  const [savedPrompts, setSavedPrompts] = useState<any[]>(() => {
    const localData = localStorage.getItem('savedPrompts');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  // This useEffect is now responsible for generating the natural language and JSON prompts
  // based on the current framework details and form data.
  const [naturalLanguageOutput, setNaturalLanguageOutput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [previewNaturalLanguageOutput, setPreviewNaturalLanguageOutput] = useState('');
  const [previewJsonOutput, setPreviewJsonOutput] = useState('');

  const validateForm = (data: { [key: string]: any }, frameworkDetails: Framework | null) => {
    const errors: { [key: string]: string } = {};

    if (!frameworkDetails) return errors;

    const allInputs = {
      ...(frameworkDetails.komponen_prompt?.['VARIABEL INPUT'] || {}),
      ...(frameworkDetails.components ? Object.fromEntries(frameworkDetails.components.map(c => [c.name, c])) : {}),
    };

    // Basic field-level validation (re-run for all fields)
    for (const name in allInputs) {
      const details = allInputs[name];
      const value = data[name];
      const error = validateInput(name, value, details);
      if (error) {
        errors[name] = error;
      }
    }

    // Cross-field validation examples (add specific rules here)
    // Example: If 'toolType' is 'image-generation' and 'aspectRatio' is 'Lainnya...', then 'customAspectRatio' is required.
    if (data.toolType === 'image-generation' && data.aspectRatio === 'Lainnya...' && !data.customAspectRatio) {
      errors.customAspectRatio = 'Mohon masukkan rasio aspek kustom.';
    }

    // Example: If 'startDate' is after 'endDate'
    // if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    //   errors.endDate = 'Tanggal akhir tidak boleh sebelum tanggal mulai.';
    // }

    return errors;
  };

  useEffect(() => {
    if (currentFrameworkDetails && selectedFramework) {
      const naturalLang = generateNaturalLanguagePrompt(currentFrameworkDetails.framework, formData, customInputs);
      const json = generateJsonPrompt(currentFrameworkDetails.framework, selectedFramework, formData, customInputs);
      setNaturalLanguageOutput(naturalLang);
      setJsonOutput(json);
      setPreviewNaturalLanguageOutput(naturalLang); // Preview is the same as final output for now
      setPreviewJsonOutput(json); // Preview is the same as final output for now

      // Trigger full form validation whenever formData or currentFrameworkDetails changes
      const formValidationErrors = validateForm(formData, currentFrameworkDetails.framework);
      setValidationErrors(formValidationErrors);

      if (currentFrameworkDetails.framework.dynamicSubcomponents) {
        
      }

    } else {
      setNaturalLanguageOutput('');
      setJsonOutput('');
      setPreviewNaturalLanguageOutput('');
      setPreviewJsonOutput('');
      setValidationErrors({}); // Clear validation errors when no framework is selected
    }
  }, [currentFrameworkDetails, selectedFramework, formData, customInputs]);


  const handleSavePrompt = (promptData: any) => {
    setSavedPrompts(prev => [...prev, promptData]);
    toast.success('Prompt berhasil disimpan!');
  };

  const handleExportPrompts = (prompts: any[]) => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'saved_prompts.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.info('Prompt berhasil diekspor!');
  };

  const handleImportPrompts = (importedPrompts: any[]) => {
    // Basic validation: check if importedPrompts is an array and contains objects with 'id'
    if (!Array.isArray(importedPrompts) || !importedPrompts.every(p => typeof p === 'object' && p !== null && 'id' in p)) {
      toast.error('Format file impor tidak valid. Pastikan berisi array prompt yang benar.');
      return;
    }

    // Filter out duplicates based on ID, prioritizing imported prompts if IDs clash
    const existingPromptIds = new Set(savedPrompts.map(p => p.id));
    const newPrompts = importedPrompts.filter(p => !existingPromptIds.has(p.id));

    setSavedPrompts(prev => [...prev, ...newPrompts]);
    toast.success(`${newPrompts.length} prompt berhasil diimpor!`);
    if (importedPrompts.length > newPrompts.length) {
      toast.warn(`${importedPrompts.length - newPrompts.length} prompt duplikat tidak diimpor.`);
    }
  };

  const handleDeletePrompt = (id: number) => {
    setSavedPrompts(prev => prev.filter(prompt => prompt.id !== id));
    toast.info('Prompt berhasil dihapus!');
  };

  const handleRenamePrompt = (id: number, newName: string) => {
    setSavedPrompts(prev =>
      prev.map(prompt =>
        prompt.id === id ? { ...prompt, frameworkName: newName } : prompt
      )
    );
    toast.success('Prompt berhasil diganti nama!');
  };

  const handleLoadPrompt = (promptData: any) => {
    setSelectedCategory(promptData.category);
    setSelectedFramework(promptData.frameworkName);
    setFormData(promptData.formData);
    setCustomInputs(promptData.customInputs);
    // setNaturalLanguageOutput(promptData.naturalLanguageOutput); // This is now derived
    // setJsonOutput(promptData.jsonOutput); // This is now derived
  };

  const handleUseAsInput = (outputContent: string) => {
    setOutputToChain(outputContent);
    setShowInputSelectionModal(true);
  };

  const handleSelectInputForChaining = (targetFrameworkName: string, targetInputName: string, inputValue: string) => {
    const targetFrameworkDetails = findFrameworkInAllCategories(targetFrameworkName);

    if (targetFrameworkDetails) {
      setSelectedCategory(targetFrameworkDetails.category);
      setSelectedFramework(targetFrameworkName);
      setFormData(prev => ({
        ...prev,
        [targetInputName]: inputValue,
      }));
      setCustomInputs(prev => ({
        ...prev,
        [targetInputName]: inputValue,
      }));
    }
    setShowInputSelectionModal(false);
  };

  return (
    <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><Spinner animation="border" /></div>}>
      <Header
        onShowSavedPrompts={() => setShowSavedPrompts(true)}
        onLogoClick={handleLogoClick}
        showDevMode={showDevMode}
        showNavigation={showNavigation}
        setShowNavigation={setShowNavigation}
        onShowHelp={() => setShowHelpModal(true)}
        isLightTheme={isLightTheme}
        setIsLightTheme={setIsLightTheme}
      />
      <Container fluid className={`main-container p-4 ${showDevMode ? 'dev-mode-glow' : ''}`} style={{ backgroundColor: appBackgroundColor }}>
        <Row className="flex-grow-1 g-4">
          <Col xs={12} md={4} lg={4} className="navigation-pane h-100" id="navigation-pane">
            <NavigationPane
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              debouncedSearchQuery={debouncedSearchQuery}
              filteredFrameworks={filteredFrameworks}
              openSubcategories={openSubcategories}
              manualOpenSubcategories={manualOpenSubcategories}
              handleCategorySelect={handleCategorySelect}
              handleBackToCategories={handleBackToCategories}
              handleFrameworkSelect={handleFrameworkSelect}
              handleSearchChange={handleSearchChange}
              handleSubcategoryToggle={handleSubcategoryToggle}
              toolTypeFilter={toolTypeFilter}
              handleToolTypeFilterChange={handleToolTypeFilterChange}
              isLoading={isNavigationLoading}
            />
          </Col>

          <Col xs={12} md={4} lg={4} className="d-flex flex-column h-100">
            <FrameworkPane
              currentFrameworkDetails={currentFrameworkDetails}
              selectedFramework={selectedFramework}
              formData={formData}
              customInputs={customInputs}
              dynamicComponentsToRender={currentFrameworkDetails?.framework?.dynamicSubcomponents ? (currentFrameworkDetails.framework.dynamicSubcomponents.options[formData[currentFrameworkDetails.framework.dynamicSubcomponents.trigger]] || []) : []}
              handleInputChange={handleInputChange}
              handleCustomInputChange={handleCustomInputChange}

              onModelSelect={handleModelSelect}
              selectedModel={selectedModel}

              showDevMode={showDevMode}
              isApiKeyEnabled={isApiKeyEnabled}
              apiKey={apiKey}
              setApiKey={setApiKey}
              handleInputChangeWithValidation={handleInputChangeWithValidation}
              handleCustomInputChangeWithValidation={handleCustomInputChangeWithValidation}
              validationErrors={validationErrors}
              touchedFields={touchedFields}
              showToast={toast}
            />
          </Col>

          <Col xs={12} md={4} lg={4} className="d-flex flex-column h-100">
            <OutputDisplay
              naturalLanguageOutput={naturalLanguageOutput}
              jsonOutput={jsonOutput}
              previewNaturalLanguageOutput={previewNaturalLanguageOutput}
              previewJsonOutput={previewJsonOutput}
              currentFrameworkDetails={currentFrameworkDetails}
              formData={formData}
              customInputs={customInputs}
              selectedFramework={selectedFramework}
              selectedCategory={selectedCategory}
              onUseAsInput={handleUseAsInput}
              onShowSavedPrompts={() => setShowSavedPrompts(true)}
              showDevMode={showDevMode}
              onSavePrompt={handleSavePrompt}
              apiKey={apiKey}
              setApiKey={setApiKey}
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
              
              handleInputChangeWithValidation={handleInputChangeWithValidation}
              validationErrors={validationErrors}
              isApiKeyEnabled={isApiKeyEnabled}

            />
          </Col>
        </Row>
      </Container>
      <InputSelectionModal
        show={showInputSelectionModal}
        onHide={() => setShowInputSelectionModal(false)}
        outputToChain={outputToChain}
        onSelectInput={handleSelectInputForChaining}
      />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <SavedPromptsDisplay
        show={showSavedPrompts}
        onHide={() => setShowSavedPrompts(false)}
        savedPrompts={savedPrompts}
        onLoadPrompt={handleLoadPrompt}
        onDeletePrompt={handleDeletePrompt}
        onExportPrompts={handleExportPrompts}
        onImportPrompts={handleImportPrompts}
      onRenamePrompt={handleRenamePrompt}
      />
      <Footer
        showDevMode={showDevMode}
        isApiKeyEnabled={isApiKeyEnabled}
      />
      
      <HelpModal show={showHelpModal} onHide={() => setShowHelpModal(false)} />
    </Suspense>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
