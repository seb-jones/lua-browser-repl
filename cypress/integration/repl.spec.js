describe('Lua REPL', () => {
    it('Evalutes submitted Lua expression and prints result', () => {
        cy.visitREPL();

        cy.submitLine('3 + 3');

        cy.lastOutputLineEquals('6');
    });

    it('Evalutes submitted Lua statement', () => {
        cy.visitREPL();

        cy.submitLine('x = 5');

        cy.submitLine('x');

        cy.lastOutputLineEquals('5');
    });

    it('Allows incomplete chunks to be completed', () => {
        cy.visitREPL();

        cy.submitLine("print(");

        // Assert the printed input line starts with the > prompt
        cy.lastInputLine().contains(/^>\s/);

        cy.get('#terminal-input-prompt').should('have.text', '>>');

        cy.submitLine("'Test')");

        // Assert the printed input line starts with the >> prompt
        cy.lastInputLine().contains(/^>>\s/);

        cy.lastOutputLineEquals('Test');

        cy.get('#terminal-input-prompt').should('have.text', '>');
    });

    it('Prints an error when a chunk is invalid', () => {
        cy.visitREPL();

        cy.submitLine("3 +");

        cy.get('.terminal-error-line').last().should(
            'have.text', 
            `[string "3 +"]:1: unexpected symbol near '3'`
        );
    });

    it('Scrolls through history when up arrow is pressed', () => {
        cy.visitREPL();

        cy.submitLine("3 + 3");

        cy.submitLine("4 + 4");

        cy.get('#terminal-input')
          .type('{uparrow}')
          .should('have.value', '4 + 4')
          .type('{uparrow}')
          .should('have.value', '3 + 3')
          .type('{enter}')
          .should('have.value', '');

        cy.lastOutputLineEquals('6');
    });
});
