

describe('02 - PIM: Gestión de Empleados', () => {

  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.get('[name="username"]').clear().type('Admin')
    cy.get('[name="password"]').clear().type('admin123')
    cy.get('button[type="submit"]').click()
    cy.wait(3000)
  })

  it('TC-003: Añadir nuevo empleado con imagen', () => {

    cy.visit('/web/index.php/pim/viewEmployeeList')
    cy.wait(2000)

    cy.contains('Add Employee').click()
    cy.wait(2000)

    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/employee_photo.jpg', { force: true })
    cy.wait(1000)

    cy.get('input[name="firstName"]').clear().type('Carlos')
    cy.get('input[name="middleName"]').clear().type('Andres')
    cy.get('input[name="lastName"]').clear().type('Perez')

   
    cy.intercept('POST', '**/pim/employees').as('createEmployee')
    cy.get('button[type="submit"]').first().click()
    cy.wait('@createEmployee').its('response.statusCode').should('eq', 200)

    cy.url().should('contain', 'viewPersonalDetails')
  })

  it('TC-004: Editar empleado', () => {

    cy.visit('/web/index.php/pim/viewEmployeeList')
    cy.wait(2000)

    cy.get('input[placeholder="Type for hints..."]').first().type('Carlos')
    cy.wait(1000)
    cy.get('button[type="submit"]').click()
    cy.wait(2000)

    
    cy.get('.oxd-table-row--clickable')
      .first()
      .find('button')
      .first()
      .click()

    cy.wait(2000)
    cy.url().should('contain', 'viewPersonalDetails')

    cy.get('input[name="firstName"]').clear().type('CarlosEditado')

    cy.intercept('PUT', '**/pim/employees/**').as('updateEmployee')
    cy.get('button[type="submit"]').first().click()
    cy.wait('@updateEmployee').its('response.statusCode').should('eq', 200)

    cy.get('.oxd-toast').should('exist')
  })

})