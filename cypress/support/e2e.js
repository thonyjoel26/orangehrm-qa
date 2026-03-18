// cypress/support/e2e.js
import './commands'

// Suprimir errores de consola no críticos del sitio de pruebas
Cypress.on('uncaught:exception', (err) => {
  // OrangeHRM a veces lanza errores de JS internos que no afectan la UI
  if (err.message.includes('ResizeObserver') || err.message.includes('Non-Error')) {
    return false
  }
})
