

class BuzzPage {

  visit() {
    cy.visit('/web/index.php/buzz/viewBuzz')
    cy.wait(3000)
  }

  
  openVideoForm() {
    
    cy.get('.orangehrm-buzz-create-post-header-action').within(() => {
      cy.contains('Share Video').click()
    })
    cy.wait(1000)
  }

  typeVideoUrl(url) {
    cy.get('input[placeholder="Paste Video URL"]').clear().type(url)
  }

  sharePost() {
    cy.get('.orangehrm-buzz-create-post-footer').within(() => {
      cy.contains('button', 'Share').click()
    })
    cy.wait(3000)
  }

  verifyPostCreated() {
    cy.get('.oxd-toast').should('be.visible')
  }

  
  sortByMostCommented() {
    
    cy.get('.orangehrm-buzz-post-filter').within(() => {
      cy.get('.oxd-select-text').click()
    })
    cy.get('.oxd-select-option').contains('Most Comments').click()
    cy.wait(2000)
  }

  commentOnTopPost(comment) {
    
    cy.get('.orangehrm-buzz-post-actions').first().within(() => {
      cy.get('.oxd-icon-button').contains('comment').click({ force: true })
    })
    cy.wait(1000)

    
    cy.get('.orangehrm-buzz-comment-add-form').first()
      .find('input[placeholder="Write your comment..."]')
      .type(comment)
      .type('{enter}')

    cy.wait(2000)
  }
}

module.exports = new BuzzPage()
