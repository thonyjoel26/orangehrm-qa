// cypress/support/pages/BuzzPage.js

class BuzzPage {
  // ── Acciones ─────────────────────────────────────────────────
  visit() {
    cy.get('.oxd-main-menu-item').contains('Buzz').click()
    cy.url().should('include', 'buzz')
  }

  /**
   * Abre el formulario para publicar video
   */
  openVideoPostForm() {
    cy.get('.orangehrm-buzz-create-post-action-btn').contains('Share Video').click()
  }

  /**
   * Publica un video
   */
  postVideo(videoUrl) {
    this.openVideoPostForm()
    cy.get('[placeholder="Paste Video URL"]').clear().type(videoUrl)
    cy.get('button').contains('Share').click()
    cy.get('.oxd-toast--success').should('be.visible')
  }

  /**
   * Ordena el feed por "Most Comments"
   */
  sortByMostCommented() {
    cy.get('.oxd-select-text').click()
    cy.get('.oxd-select-dropdown').contains('Most Comments').click()
    cy.wait(2000) // Espera que el feed se reordene
  }

  /**
   * Comenta en el primer post del feed
   */
  commentOnFirstPost(comment) {
    // Busca el primer input de comentario visible
    cy.get('.orangehrm-buzz-post-row')
      .first()
      .find('[placeholder="Write your comment..."]')
      .click()
      .type(comment)
      .type('{enter}')

    // Verifica que el comentario se publicó
    cy.get('.orangehrm-buzz-post-row')
      .first()
      .find('.orangehrm-buzz-comment-area')
      .should('contain', comment)
  }
}

module.exports = new BuzzPage()
