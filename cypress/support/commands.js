// cypress/support/commands.js

// ── Comandos personalizados (Custom Commands) ─────────────────
// Patrón: encapsular acciones repetitivas en comandos reutilizables

/**
 * Login rápido vía sesión directa
 * Evita repetir el flujo de login en cada test (más rápido)
 */
Cypress.Commands.add('loginAs', (username, password) => {
  cy.visit('/web/index.php/auth/login')
  cy.get('[name="username"]').type(username)
  cy.get('[name="password"]').type(password)
  cy.get('[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

/**
 * Espera a que desaparezca el spinner de carga
 */
Cypress.Commands.add('waitForLoader', () => {
  cy.get('.oxd-loading-spinner', { timeout: 10000 }).should('not.exist')
})

/**
 * Selecciona una opción en el dropdown custom de OrangeHRM
 */
Cypress.Commands.add('selectOxdOption', (dropdownIndex, optionText) => {
  cy.get('.oxd-select-text').eq(dropdownIndex).click()
  cy.get('.oxd-select-dropdown').contains(optionText).click()
})

/**
 * Toma screenshot con nombre descriptivo
 */
Cypress.Commands.add('captureStep', (stepName) => {
  cy.screenshot(`step_${stepName}`)
})
