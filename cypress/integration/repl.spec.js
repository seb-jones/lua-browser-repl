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

    it('Scrolling to end of history sets input to empty string', () => {
        cy.visitREPL();

        cy.submitLine("7 + 3");

        cy.submitLine("2 + 9");

        cy.get('#terminal-input')
          .type('{uparrow}')
          .should('have.value', '2 + 9')
          .type('{uparrow}')
          .should('have.value', '7 + 3')
          .type('{uparrow}')
          .should('have.value', '');
    });

    it('Scrolls backwards through history when down arrow is pressed', () => {
        cy.visitREPL();

        cy.submitLine("10 + 3");

        cy.submitLine("2 + 15");

        cy.get('#terminal-input')
          .type('{downarrow}')
          .should('have.value', '10 + 3')
          .type('{downarrow}')
          .should('have.value', '2 + 15')
          .type('{enter}')
          .should('have.value', '');

        cy.lastOutputLineEquals('17');
    });

    it('Scrolls backwards to start of history sets input to empty string', () => {
        cy.visitREPL();

        cy.submitLine("10 + 9");

        cy.submitLine("10 + 15");

        cy.get('#terminal-input')
          .type('{downarrow}')
          .should('have.value', '10 + 9')
          .type('{downarrow}')
          .should('have.value', '10 + 15')
          .type('{downarrow}')
          .should('have.value', '');
    });

    it('Empty lines are ignored when scrolling through history', () => {
        cy.visitREPL();

        cy.submitLine("1 + 1");

        cy.get('#terminal-form').submit(); // Submit empty line

        cy.get('#terminal-input')
          .type('{uparrow}')
          .should('have.value', '1 + 1');
    });

    it('Empty lines in multiline inputs are ignored when scrolling through history', () => {
        cy.visitREPL();

        cy.submitLine("print(");

        cy.submitLine("3");

        cy.get('#terminal-form').submit(); // Submit empty line

        cy.submitLine(");");

        cy.get('#terminal-input')
          .type('{uparrow}')
          .should('have.value', ');')
          .type('{uparrow}')
          .should('have.value', '3')
          .type('{uparrow}')
          .should('have.value', 'print(');
    });
});
