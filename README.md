# OrangeHRM QA - Automatización E2E con Cypress

## 📁 Estructura del Proyecto

```
orangehrm-qa/
├── cypress/
│   ├── e2e/                          # Tests organizados por módulo
│   │   ├── 01_login.cy.js            # Login y verificación de menú
│   │   ├── 02_pim.cy.js              # Gestión de empleados
│   │   ├── 03_recruitment.cy.js      # Candidatos y vacantes
│   │   └── 04_buzz.cy.js             # Newsfeed y comentarios
│   ├── fixtures/
│   │   ├── testData.json             # Datos de prueba centralizados
│   │   ├── employee_photo.jpg        # Foto de empleado (agregar manualmente)
│   │   └── candidate_cv.pdf          # CV de candidato (agregar manualmente)
│   ├── support/
│   │   ├── pages/                    # Page Object Model (POM)
│   │   │   ├── LoginPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── PimPage.js
│   │   │   ├── RecruitmentPage.js
│   │   │   └── BuzzPage.js
│   │   ├── commands.js               # Comandos personalizados
│   │   └── e2e.js                    # Configuración global
│   └── downloads/                    # Archivos generados en tests
├── cypress.config.js
├── package.json
└── README.md
```

## 🏗️ Patrones de Diseño Utilizados

### 1. Page Object Model (POM)
Cada página del sitio tiene su propia clase que encapsula:
- **Selectores**: getters que retornan los elementos del DOM
- **Acciones**: métodos que interactúan con la página
- **Aserciones**: métodos que verifican el estado de la UI

### 2. Fixture Pattern
Los datos de prueba están centralizados en `testData.json` separados del código, permitiendo modificarlos sin tocar los tests.

### 3. Custom Commands
Comandos reutilizables como `cy.loginAs()` y `cy.waitForLoader()` evitan duplicación de código.

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18 o superior
- npm

### Instalación
```bash
# 1. Instalar dependencias
npm install

# 2. Agregar archivos a fixtures/ (requeridos para los tests)
#    - employee_photo.jpg (cualquier imagen JPG)
#    - candidate_cv.pdf   (cualquier PDF)
```

### Ejecutar los tests

```bash
# Modo interactivo (con interfaz gráfica - recomendado para demos)
npm run cy:open

# Modo headless (sin interfaz, genera video automáticamente)
npm run cy:run

# Modo headed headless (se ve el navegador pero sin GUI de Cypress)
npm run cy:run:headed
```

### Ejecutar un módulo específico
```bash
npx cypress run --spec "cypress/e2e/01_login.cy.js"
npx cypress run --spec "cypress/e2e/02_pim.cy.js"
npx cypress run --spec "cypress/e2e/03_recruitment.cy.js"
npx cypress run --spec "cypress/e2e/04_buzz.cy.js"
```

## 🌐 Sitio de Pruebas
**URL**: https://opensource-demo.orangehrmlive.com  
**Usuario**: Admin  
**Contraseña**: admin123

> ⚠️ Este es un entorno demo compartido. Los datos pueden resetear periódicamente.

## 🤖 Uso de IA (Justificación)
Se utilizó IA (Claude) para:
- Generar la estructura base del proyecto con POM
- Crear los selectores iniciales basados en el análisis del DOM
- Redactar la documentación

**Justificación**: Se usó como acelerador de productividad para el scaffolding inicial. Todos los selectores fueron verificados manualmente contra el sitio real antes de su uso final.

## 📊 Reporte de Ejecución
Los videos se guardan automáticamente en `cypress/videos/`  
Los screenshots en `cypress/screenshots/`
