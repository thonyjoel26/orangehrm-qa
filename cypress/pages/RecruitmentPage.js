

class RecruitmentPage {

  

  visitCandidates() {
    cy.visit('/web/index.php/recruitment/viewCandidates')
    cy.wait(2000)
  }

  visitVacancies() {
    cy.visit('/web/index.php/recruitment/viewJobVacancy')
    cy.wait(2000)
  }

  clickAdd() {
    cy.contains('button', 'Add').click()
    cy.wait(2000)
  }

  
  fillCandidateForm(firstName, lastName, email, phone) {
    
    cy.get('input[name="firstName"]').clear().type(firstName)
    cy.get('input[name="lastName"]').clear().type(lastName)

    
    cy.get('.oxd-select-wrapper').first().click()
    cy.get('.oxd-select-option').first().click()
    cy.wait(500)

    
    cy.get('.oxd-form-row').contains('Email').parent().find('input').clear().type(email)

    
    cy.get('.oxd-form-row').contains('Contact Number').parent().find('input').clear().type(phone)
  }

  saveCandidateAndVerify() {
    cy.get('button[type="submit"]').click()
    cy.wait(3000)
    
    cy.get('.oxd-toast').should('be.visible')
  }


  fillVacancyForm(name, description) {
    
    cy.get('.oxd-input').eq(1).clear().type(name)

    
    cy.get('.oxd-select-wrapper').first().click()
    cy.get('.oxd-select-option').eq(1).click()
    cy.wait(500)

    
    cy.get('textarea').clear().type(description)
  }

  saveVacancy() {
    cy.get('button[type="submit"]').click()
    cy.wait(3000)
  }

  verifyVacancySaved() {
    
    cy.url().should('include', 'viewJobVacancy').or('include', 'editJobVacancy')
      .then(() => {
 
      })
    
    
    cy.get('.oxd-toast', { timeout: 5000 }).should('be.visible')
  }
}

module.exports = new RecruitmentPage()
