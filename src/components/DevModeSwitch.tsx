import React from "react";
import { Form } from "react-bootstrap";

interface DevModeSwitchProps {
  showDevMode: boolean; // Controls visibility of the switch
  isApiKeyEnabled: boolean; // Controls the color of the switch
  onToggle: () => void; // Handler for when the switch is clicked
}

const DevModeSwitch: React.FC<DevModeSwitchProps> = ({
  showDevMode,
  isApiKeyEnabled,
  onToggle,
}) => {
  if (!showDevMode) {
    return null; // Hidden until showDevMode is true
  }

  const toggleClass = isApiKeyEnabled
    ? "dev-mode-enabled"
    : "dev-mode-disabled";

  return (
    <div className="dev-mode-switch-container">
      <Form.Check
        type="switch"
        id="dev-mode-toggle"
        label="Dev Mode"
        checked={isApiKeyEnabled} // Reflects API Key status
        onChange={onToggle} // This will trigger the logic in index.tsx
        className={`me-3 ${toggleClass}`}
      />
    </div>
  );
};

export default DevModeSwitch;
