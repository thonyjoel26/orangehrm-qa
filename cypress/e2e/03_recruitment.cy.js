describe('Recruitment - Candidatos y Vacantes', () => {

  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.get('[name="username"]').clear().type('Admin')
    cy.get('[name="password"]').clear().type('admin123')
    cy.get('button[type="submit"]').click()
    cy.wait(3000)
  })

  it('Debe crear un nuevo candidato', () => {

    cy.visit('/web/index.php/recruitment/viewCandidates')
    cy.wait(2000)

    cy.contains('button', 'Add').click()
    cy.wait(2000)
    cy.url().should('include', 'addCandidate')

    cy.get('input[name="firstName"]').clear().type('Laura')
    cy.get('input[name="lastName"]').clear().type('Gomez')

    cy.get('.oxd-select-wrapper').first().click()
    cy.get('.oxd-select-option').first().click()
    cy.wait(500)

    cy.contains('.oxd-input-group', 'Email')
      .find('input').clear().type('laura.gomez@test.com')

    cy.contains('.oxd-input-group', 'Contact Number')
      .find('input').clear().type('0987654321')

    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/candidate_cv.pdf', { force: true })
    cy.wait(1000)

    cy.intercept('POST', '/web/index.php/api/v2/recruitment/candidates').as('createCandidate')
    cy.get('button[type="submit"]').click()
    cy.wait('@createCandidate', { timeout: 10000 }).its('response.statusCode').should('eq', 200)

    cy.log('Candidato creado correctamente')
  })

  it('Debe crear una nueva vacante', () => {

    cy.visit('/web/index.php/recruitment/viewJobVacancy')
    cy.wait(2000)

    cy.contains('button', 'Add').click()
    cy.wait(2000)
    cy.url().should('include', 'addJobVacancy')

    const vacancyName = 'QA Engineer ' + Date.now()
    cy.get('.oxd-input').eq(1).clear().type(vacancyName)

    cy.get('.oxd-select-wrapper').first().click()
    cy.wait(500)
    cy.get('.oxd-select-option').eq(1).click()
    cy.wait(500)

    cy.get('textarea').clear().type('Vacante para automatizador de pruebas')

    cy.intercept('POST', '/web/index.php/api/v2/recruitment/vacancies').as('createVacancy')
    cy.get('button[type="submit"]').click()
    cy.wait('@createVacancy', { timeout: 10000 }).its('response.statusCode').should('eq', 200)

    cy.log('Vacante creada correctamente')
  })

})