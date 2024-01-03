export default class DashboardPage {

    public displays(): void {
        cy.url().should('include', '/dashboard');
        // TODO: add more check points
    }
}
