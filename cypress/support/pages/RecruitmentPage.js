// cypress/support/pages/RecruitmentPage.js

class RecruitmentPage {
  // ── Acciones comunes ─────────────────────────────────────────
  visit() {
    cy.get('.oxd-main-menu-item').contains('Recruitment').click()
    cy.url().should('include', 'recruitment')
  }

  clickAddButton() {
    cy.get('button').contains('Add').click()
  }

  clickSave() {
    cy.get('[type="submit"]').click()
  }

  verifySuccessToast() {
    cy.get('.oxd-toast--success').should('be.visible')
  }

  // ── Dropdowns custom de OrangeHRM ────────────────────────────
  selectDropdownByIndex(index, optionText) {
    cy.get('.oxd-select-text').eq(index).click()
    cy.get('.oxd-select-dropdown').contains(optionText).click()
  }

  // Autocomplete custom (ej. Job Title)
  typeAutocomplete(placeholder, value) {
    cy.get(`[placeholder="${placeholder}"]`).clear().type(value)
    cy.get('.oxd-autocomplete-option').first().click()
  }

  // ── Candidatos ───────────────────────────────────────────────

  /**
   * Navega a la sección de Candidates
   */
  goToCandidates() {
    cy.get('.oxd-topbar-body-nav-tab').contains('Candidates').click()
    cy.url().should('include', 'addCandidate').or('include', 'candidates')
  }

  /**
   * Llena el formulario de nuevo candidato
   */
  fillCandidateForm(data) {
    // Nombre
    cy.get('[name="firstName"]').clear().type(data.firstName)
    cy.get('[name="lastName"]').clear().type(data.lastName)

    // Email
    cy.get('[placeholder="Type here"]').eq(0).clear().type(data.email)

    // Teléfono
    cy.get('[placeholder="Type here"]').eq(1).clear().type(data.contactNumber)

    // Keywords
    cy.get('[placeholder="Type here"]').eq(2).clear().type(data.keywords)

    // Notes
    cy.get('textarea').clear().type(data.notes)

    // Consentimiento de datos
    cy.get('[type="checkbox"]').check({ force: true })
  }

  /**
   * Sube el CV del candidato
   */
  uploadResume(fileName) {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true })
  }

  // ── Vacantes ─────────────────────────────────────────────────

  /**
   * Navega a la sección de Vacancies
   */
  goToVacancies() {
    cy.get('.oxd-topbar-body-nav-tab').contains('Vacancies').click()
    cy.url().should('include', 'vacancies')
  }

  /**
   * Llena el formulario de nueva vacante
   */
  fillVacancyForm(data) {
    // Nombre de la vacante
    cy.get('[placeholder="Type here"]').first().clear().type(data.name)

    // Job Title (autocomplete)
    this.typeAutocomplete('Type for hints...', data.jobTitle)

    // Número de posiciones
    cy.get('[placeholder="No. of Positions"]').clear().type(data.numPositions)

    // Descripción
    cy.get('textarea').clear().type(data.description)

    // Status
    this.selectDropdownByIndex(0, data.status)
  }
}

module.exports = new RecruitmentPage()
