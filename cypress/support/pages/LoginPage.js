// cypress/support/pages/LoginPage.js
// PATRÓN DE DISEÑO: Page Object Model (POM)
// Encapsula los selectores y acciones de la página de Login

class LoginPage {
  // ── Selectores ──────────────────────────────────────────────
  get usernameInput()   { return cy.get('[name="username"]') }
  get passwordInput()   { return cy.get('[name="password"]') }
  get loginButton()     { return cy.get('[type="submit"]') }
  get errorMessage()    { return cy.get('.oxd-alert-content-text') }
  get pageTitle()       { return cy.get('.orangehrm-login-title') }

  // ── Acciones ─────────────────────────────────────────────────
  visit() {
    cy.visit('/web/index.php/auth/login')
  }

  typeUsername(username) {
    this.usernameInput.clear().type(username)
  }

  typePassword(password) {
    this.passwordInput.clear().type(password)
  }

  clickLogin() {
    this.loginButton.click()
  }

  /**
   * Método principal: realiza el login completo
   * @param {string} username
   * @param {string} password
   */
  login(username, password) {
    this.visit()
    this.typeUsername(username)
    this.typePassword(password)
    this.clickLogin()
  }

  // ── Aserciones ───────────────────────────────────────────────
  verifyLoginPageVisible() {
    this.pageTitle.should('be.visible')
  }

  verifyErrorMessage(message) {
    this.errorMessage.should('be.visible').and('contain', message)
  }
}

module.exports = new LoginPage()
