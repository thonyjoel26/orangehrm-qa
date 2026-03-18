

describe('01 - Inicio de Sesión', () => {

  it('TC-001: Login exitoso con credenciales válidas', () => {

    cy.visit('/web/index.php/auth/login')

    cy.get('[name="username"]').clear().type('Admin')
    cy.get('[name="password"]').clear().type('admin123')

    
    cy.get('[type="submit"]').click()

    cy.url().should('include', '/dashboard')

    cy.get('.oxd-sidepanel').should('be.visible')

    
    cy.get('.oxd-main-menu').should('contain', 'PIM')
    cy.get('.oxd-main-menu').should('contain', 'Recruitment')
    cy.get('.oxd-main-menu').should('contain', 'Buzz')
  })

  it('TC-002: Login fallido con credenciales inválidas', () => {

    cy.visit('/web/index.php/auth/login')
    cy.get('[name="username"]').clear().type('usuarioMalo')
    cy.get('[name="password"]').clear().type('claveErronea')
    cy.get('[type="submit"]').click()

    
    cy.get('.oxd-alert-content-text').should('be.visible')
      .and('contain', 'Invalid credentials')
  })

})
