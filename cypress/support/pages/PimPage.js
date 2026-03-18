// cypress/support/pages/PimPage.js

class PimPage {
  // ── Selectores ──────────────────────────────────────────────
  get addEmployeeButton()  { return cy.get('button').contains('Add Employee') }
  get firstNameInput()     { return cy.get('[name="firstName"]') }
  get middleNameInput()    { return cy.get('[name="middleName"]') }
  get lastNameInput()      { return cy.get('[name="lastName"]') }
  get employeeIdInput()    { return cy.get('.--name-grouped-field').find('[class="oxd-input oxd-input--active"]').eq(1) }
  get saveButton()         { return cy.get('[type="submit"]') }
  get successToast()       { return cy.get('.oxd-toast--success') }
  get profilePicInput()    { return cy.get('input[type="file"]') }

  // Campos de edición (Personal Details)
  get licenseInput()       { return cy.get('[name="licenseNo"]') }
  get dobInput()           { return cy.get('[placeholder="yyyy-dd-mm"]').eq(0) }

  // Dropdowns (OrangeHRM usa componentes custom)
  nationalityDropdown()    { return cy.get('.oxd-select-text').eq(0) }
  maritalDropdown()        { return cy.get('.oxd-select-text').eq(1) }
  genderRadio(gender)      { return cy.get('[type="radio"]').filter(`:contains("${gender}")`) }

  // ── Acciones ─────────────────────────────────────────────────

  /**
   * Navega al módulo PIM
   */
  visit() {
    cy.get('.oxd-main-menu-item').contains('PIM').click()
    cy.url().should('include', 'pim')
  }

  /**
   * Rellena los datos básicos del empleado en el formulario Add Employee
   */
  fillBasicInfo(firstName, middleName, lastName) {
    this.firstNameInput.clear().type(firstName)
    this.middleNameInput.clear().type(middleName)
    this.lastNameInput.clear().type(lastName)
  }

  /**
   * Sube una imagen de perfil desde fixtures
   * @param {string} imageName - nombre del archivo en cypress/fixtures/
   */
  uploadProfilePicture(imageName) {
    cy.get('.employee-image-wrapper').click()
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${imageName}`, { force: true })
    // Confirmar el cambio de imagen si hay modal
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-button--medium').length) {
        cy.get('.oxd-button--medium').contains('Save').click()
      }
    })
  }

  /**
   * Selecciona un item de un dropdown custom de OrangeHRM
   */
  selectDropdownOption(dropdownIndex, optionText) {
    cy.get('.oxd-select-text').eq(dropdownIndex).click()
    cy.get('.oxd-select-dropdown').contains(optionText).click()
  }

  /**
   * Rellena los detalles personales del empleado
   */
  fillPersonalDetails(data) {
    // Driver License
    this.licenseInput.clear().type(data.driverLicense)

    // Nationality dropdown
    this.selectDropdownOption(0, data.nationality)

    // Marital Status dropdown
    this.selectDropdownOption(1, data.maritalStatus)

    // Date of Birth
    cy.get('[placeholder="yyyy-dd-mm"]').first().clear().type(data.dateOfBirth)

    // Gender radio button
    cy.contains('.oxd-radio-wrapper', data.gender)
      .find('[type="radio"]')
      .check({ force: true })
  }

  clickSave() {
    this.saveButton.first().click()
  }

  verifySuccessToast() {
    this.successToast.should('be.visible')
  }

  /**
   * Busca un empleado por nombre en la lista
   */
  searchEmployee(name) {
    cy.get('[placeholder="Type for hints..."]').first().type(name)
    cy.get('[type="submit"]').click()
    cy.get('.oxd-loading-spinner').should('not.exist')
  }

  /**
   * Abre el primer resultado de búsqueda
   */
  openFirstResult() {
    cy.get('.oxd-table-row--clickable').first().click()
  }
}

module.exports = new PimPage()
