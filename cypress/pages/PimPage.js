

class PimPage {

  visitEmployeeList() {
    cy.visit('/web/index.php/pim/viewEmployeeList')
    cy.wait(2000)
  }

  clickAddEmployee() {
    cy.contains('Add Employee').click()
    cy.wait(2000)
  }

  fillBasicInfo(firstName, middleName, lastName) {
    cy.get('input[name="firstName"]').clear().type(firstName)
    cy.get('input[name="middleName"]').clear().type(middleName)
    cy.get('input[name="lastName"]').clear().type(lastName)
  }

  uploadPhoto(fileName) {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true })
    cy.wait(1000)
  }

  saveEmployee() {
    cy.get('button[type="submit"]').first().click()
    cy.wait(3000)
  }

  verifyEmployeeCreated() {
    cy.url().should('include', '/pim/viewPersonalDetails')
  }

  searchEmployee(name) {
    cy.get('input[placeholder="Type for hints..."]').first().type(name)
    cy.wait(1500)
    cy.get('button[type="submit"]').click()
    cy.wait(2000)
  }

  
  clickFirstResult() {
   
    cy.get('.oxd-table-body').should('be.visible')

    
    cy.get('.oxd-table-row').not('.oxd-table-header-row').first()
      .find('.oxd-icon-button').first().click()

    cy.wait(2000)
  }

  fillPersonalDetails(license, dob) {
    
    cy.get('input[name="licenseNo"]').clear().type(license)

    /
    cy.get('.oxd-date-input input').clear().type(dob)

    
    cy.get('.oxd-radio-input').first().check({ force: true })
  }

  savePersonalDetails() {
    cy.get('button[type="submit"]').first().click()
    cy.wait(2000)
  }

  verifySuccessToast() {
    cy.get('.oxd-toast').should('be.visible')
  }
}

module.exports = new PimPage()
