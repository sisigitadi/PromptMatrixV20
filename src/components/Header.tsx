import React from "react";
import { Container, Nav, Button } from "react-bootstrap";
import { FaSun, FaMoon, FaQuestionCircle } from "react-icons/fa";

interface HeaderProps {
  onShowSavedPrompts: () => void;
  onLogoClick: () => void;
  showDevMode: boolean;
  showNavigation: boolean;
  setShowNavigation: (show: boolean) => void;
  onShowHelp: () => void;
  isLightTheme: boolean;
  setIsLightTheme: (isLight: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  onShowSavedPrompts,
  onLogoClick,
  showDevMode,
  showNavigation,
  setShowNavigation,
  onShowHelp,
  isLightTheme,
  setIsLightTheme,
}) => {
  return (
    <header className="app-header py-3">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <div className="d-flex flex-column align-items-start">
          <div className="d-flex align-items-center">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwN0JGRiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iSW50ZXIsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPlBNPC90ZXh0Pgo8L3N2Zz4="
              alt="PromptMatrix 2.0 Logo"
              className="logo-glow"
              style={{
                height: "30px",
                marginRight: "10px",
                cursor: "pointer",
                position: "relative",
                zIndex: 9999,
              }}
              onClick={onLogoClick}
              role="button"
              tabIndex={0}
              aria-label="Beranda PromptMatrix 2.0"
            />
            <h1 className="h4 mb-0">PromptMatrix 2.0</h1>
          </div>
          <p className="subheading mb-0">
            Optimalkan AI Anda, Mulai dari Prompt
          </p>
        </div>
        <Nav className="ms-auto d-flex align-items-center">
          {/* <Nav.Link href="#about" className="text-white">Tentang</Nav.Link> */}
          {/* <Nav.Link href="#guide" className="text-white">Panduan</Nav.Link> */}

          <Button
            variant="outline-info"
            onClick={onShowHelp}
            className="ms-3"
            aria-label="Bantuan"
          >
            <FaQuestionCircle />
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setIsLightTheme(!isLightTheme)}
            className="ms-3"
            aria-label={
              isLightTheme ? "Beralih ke Mode Gelap" : "Beralih ke Mode Terang"
            }
          >
            {isLightTheme ? <FaMoon /> : <FaSun />}
          </Button>
        </Nav>
      </Container>
    </header>
  );
};

export default Header;
