describe('Prompt Matrix App', () => {
  it('should load the main page', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('PromptMatrix 2.0');
  });

  it('should display the framework pane placeholder', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('Pilih Kerangka Kerja');
  });
});
