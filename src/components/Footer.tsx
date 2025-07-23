import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="app-footer d-flex justify-content-between align-items-center px-3">
      <p className="mb-0 small">Prompt Matrix © 2025</p>
      <div className="social-icons d-flex align-items-center">
        <a
          href="mailto:si.sigitadi@gmail.com"
          className="mx-2"
          aria-label="Email"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-envelope-fill"
            viewBox="0 0 16 16"
          >
            <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
          </svg>
        </a>
        <a
          href="https://github.com/sisigitadi"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2"
          aria-label="GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-github"
            viewBox="0 0 16 16"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg>
        </a>
        <a
          href="https://medium.com/@si.sigitadi"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2"
          aria-label="Medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-medium"
            viewBox="0 0 16 16"
          >
            <path d="M9.025 8c0 2.485-2.02 4.505-4.505 4.505S0 10.485 0 8 2.02 3.495 4.52 3.495c2.485 0 4.505 2.02 4.505 4.505M16 8c0 2.485-2.02 4.505-4.505 4.505S7 10.485 7 8s2.02-4.505 4.505-4.505S16 5.515 16 8M13.15 8c0 1.7-.97 3.09-2.17 3.09S8.81 9.7 8.81 8s.97-3.09 2.17-3.09 2.17.97 2.17 3.09" />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
