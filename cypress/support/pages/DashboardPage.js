// cypress/support/pages/DashboardPage.js

class DashboardPage {
  // ── Selectores ──────────────────────────────────────────────
  get topBarUsername()  { return cy.get('.oxd-userdropdown-name') }
  get sidebarMenu()     { return cy.get('.oxd-sidepanel-body') }
  get dashboardTitle()  { return cy.get('.oxd-topbar-header-title') }

  // Menú lateral - items de navegación
  navItem(name) {
    return cy.get('.oxd-main-menu-item').contains(name)
  }

  // ── Aserciones ───────────────────────────────────────────────
  verifyUserLoggedIn() {
    this.topBarUsername.should('be.visible')
    this.sidebarMenu.should('be.visible')
  }

  verifyMenuItemExists(name) {
    this.navItem(name).should('be.visible')
  }

  // ── Acciones ─────────────────────────────────────────────────
  navigateTo(section) {
    this.navItem(section).click()
    cy.url().should('include', section.toLowerCase())
  }

  getUserName() {
    return this.topBarUsername.invoke('text')
  }
}

module.exports = new DashboardPage()
