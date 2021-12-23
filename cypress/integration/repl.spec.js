describe('Lua REPL', () => {
    it('Evalutes submitted Lua expression and prints result', () => {
        cy.visit('/');

        cy.waitForWelcomeMessage();

        cy.submitLine('3 + 3');

        cy.lastOutputLine().contains('6');
    });

    it('Evalutes submitted Lua statement', () => {
        cy.visit('/');

        cy.waitForWelcomeMessage();

        cy.submitLine('x = 5');

        cy.submitLine('x');

        cy.lastOutputLine().contains('5');
    });
});
