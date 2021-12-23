// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('submitLine', (line) => { 
    cy.get('#terminal-input').type(line);

    cy.get('#terminal-form').submit();

    cy.get('.terminal-input-line').last().contains(line);
});

Cypress.Commands.add('lastInputLine', (line) => cy.get('.terminal-input-line').last());

Cypress.Commands.add('lastOutputLineEquals', (line) => {
    cy.get('.terminal-output-line').last().should('have.text', line);
});

Cypress.Commands.add('visitREPL', () => {
    cy.visit('/');
    cy.contains('Welcome!');
});
