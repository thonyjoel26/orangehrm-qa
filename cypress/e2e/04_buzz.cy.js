// cypress/e2e/04_buzz.cy.js

describe('Buzz Newsfeed - Video y Comentarios', () => {

  beforeEach(() => {
    cy.visit('/web/index.php/auth/login')
    cy.get('[name="username"]').type('Admin')
    cy.get('[name="password"]').type('admin123')
    cy.get('[type="submit"]').click()
    cy.wait(2000)
  })

  it('Debe crear una publicación de video', () => {
    cy.visit('/web/index.php/buzz/viewBuzz')
    cy.wait(4000)

    cy.contains('Share Video').click({ force: true })
    cy.wait(2000)

    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder="Paste Video URL"]').length > 0) {
        cy.get('input[placeholder="Paste Video URL"]')
          .type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      } else {
        cy.get('textarea').filter(':visible').last()
          .type('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      }
    })

    cy.wait(1000)
    cy.contains('button', 'Share').last().click({ force: true })
    cy.wait(4000)

    cy.visit('/web/index.php/buzz/viewBuzz')
    cy.wait(3000)
    cy.get('.orangehrm-buzz-post-body').should('exist')
  })

  it('Debe comentar en el post más popular', () => {
    cy.visit('/web/index.php/buzz/viewBuzz')
    cy.wait(4000)

    
    cy.get('button').find('.bi-chat-text-fill').first()
      .parent().click({ force: true })
    cy.wait(1500)

    
    cy.get('.orangehrm-buzz-comment-add').find('.oxd-input').first()
      .type('Excelente publicación!{enter}')

    cy.wait(2000)
    cy.contains('Excelente publicación!').should('exist')
  })

})