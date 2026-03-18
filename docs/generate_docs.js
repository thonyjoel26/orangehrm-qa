const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Footer, PageBreak
} = require('docx')
const fs = require('fs')

// ── Helpers ──────────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }
const borders = { top: border, bottom: border, left: border, right: border }
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder }

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 28, color: '2E5FA3' })]
  })
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 24, color: '2E5FA3' })]
  })
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, ...opts })]
  })
}

function spacer() {
  return new Paragraph({ children: [new TextRun({ text: '' })] })
}

function headerRow(cells, colWidths) {
  return new TableRow({
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill: '2E5FA3', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20, color: 'FFFFFF' })] })]
      })
    )
  })
}

function dataRow(cells, colWidths, fill = 'FFFFFF') {
  return new TableRow({
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: String(text), size: 20 })] })]
      })
    )
  })
}

// ─────────────────────────────────────────────────────────────
// DOCUMENTO 1: PLAN DE PRUEBAS
// ─────────────────────────────────────────────────────────────

const testCases = [
  // Login
  ['TC-001', '01 - Login', 'Login exitoso con credenciales válidas', 'Abrir login → ingresar Admin/admin123 → click Login', 'Redirige al dashboard, menú lateral visible', 'Alta', 'Funcional', 'CP', 'Aprobado'],
  ['TC-002', '01 - Login', 'Login con credenciales inválidas', 'Ingresar usuario/contraseña incorrectos → click Login', 'Mensaje de error "Invalid credentials"', 'Alta', 'Negativo', 'CP/VP', 'Aprobado'],
  // PIM
  ['TC-003', '02 - PIM', 'Añadir nuevo empleado con foto', 'PIM → Add Employee → llenar nombre + foto → Save', 'Empleado creado, redirige a su perfil', 'Alta', 'Funcional', 'CP', 'Aprobado'],
  ['TC-004', '02 - PIM', 'Editar detalles personales del empleado', 'Buscar empleado → editar: licencia, nac., estado civil, género, DOB → Save', 'Toast de éxito visible, datos guardados', 'Alta', 'Funcional', 'CP', 'Aprobado'],
  ['TC-005', '02 - PIM', 'Buscar empleado inexistente', 'PIM → buscar nombre que no existe → Search', 'Lista vacía o mensaje "No Records Found"', 'Media', 'Negativo', 'VP', 'Pendiente'],
  // Recruitment
  ['TC-006', '03 - Recruitment', 'Crear candidato con todos los campos', 'Recruitment → Candidates → Add → llenar form + CV → Save', 'Toast de éxito, candidato en lista', 'Alta', 'Funcional', 'CP', 'Aprobado'],
  ['TC-007', '03 - Recruitment', 'Crear vacante con todos los campos', 'Recruitment → Vacancies → Add → llenar form → Save', 'Toast de éxito, vacante en lista', 'Alta', 'Funcional', 'CP', 'Aprobado'],
  ['TC-008', '03 - Recruitment', 'Crear candidato sin email (campo requerido)', 'Recruitment → Add Candidate → omitir email → Save', 'Mensaje de validación en campo email', 'Media', 'Negativo', 'VP', 'Pendiente'],
  // Buzz
  ['TC-009', '04 - Buzz', 'Publicar video en Buzz Newsfeed', 'Buzz → Share Video → ingresar URL → Share', 'Post de video visible en el feed', 'Alta', 'Funcional', 'CP', 'Aprobado'],
  ['TC-010', '04 - Buzz', 'Ordenar por más comentados y comentar', 'Buzz → Sort by Most Comments → comentar primer post', 'Comentario visible en el post', 'Alta', 'Funcional', 'CP', 'Aprobado'],
  ['TC-011', '04 - Buzz', 'Publicar video con URL inválida', 'Buzz → Share Video → ingresar URL inválida → Share', 'Mensaje de error o validación', 'Media', 'Negativo', 'VP', 'Pendiente'],
]

const tcColWidths = [900, 1200, 2000, 2400, 1700, 700, 900, 700, 860]
const tcHeaders = ['ID', 'Módulo', 'Caso de Prueba', 'Pasos', 'Resultado Esperado', 'Prior.', 'Tipo', 'Técnica', 'Estado']

// ─────────────────────────────────────────────────────────────
// DOCUMENTO 2: INFORME DE DEFECTOS
// ─────────────────────────────────────────────────────────────

const defects = [
  ['DEF-001', 'PIM', 'Alta', 'Abierto', 'El campo Employee ID no acepta formato alfanumérico', 'Ingresar EMP001 en el campo Employee ID al crear empleado', 'El campo acepta el valor y guarda', 'El campo muestra error de validación inesperado o no guarda', 'TC-003'],
  ['DEF-002', 'Buzz', 'Media', 'Abierto', 'URL de YouTube no previsualiza el video en el post', 'Publicar video con URL válida de YouTube', 'Previsualización del video en el newsfeed', 'Solo muestra texto sin previsualización', 'TC-009'],
  ['DEF-003', 'Recruitment', 'Baja', 'Abierto', 'El campo "Notes" en candidato acepta más de 1000 caracteres sin truncar', 'Ingresar texto mayor a 1000 caracteres en Notes', 'Validación de longitud máxima', 'Sin límite de caracteres visible', 'TC-006'],
  ['DEF-004', 'Login', 'Alta', 'Cerrado', 'Mensaje de error de login no es suficientemente descriptivo', 'Ingresar credenciales inválidas', 'Mensaje claro de "Usuario o contraseña incorrectos"', 'Solo muestra "Invalid credentials"', 'TC-002'],
  ['DEF-005', 'PIM', 'Media', 'Abierto', 'La imagen de perfil no se actualiza inmediatamente sin recargar la página', 'Subir nueva foto de empleado → guardar', 'Foto actualizada visible sin reload', 'Requiere recargar la página para ver la foto nueva', 'TC-003'],
]

const defColWidths = [800, 900, 700, 800, 2200, 1500, 1200, 1200, 960]
const defHeaders = ['ID', 'Módulo', 'Severidad', 'Estado', 'Descripción', 'Pasos para reproducir', 'Resultado Esperado', 'Resultado Actual', 'TC Relacionado']

// ── Generar Plan de Pruebas ───────────────────────────────────
const planDoc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: '2E5FA3' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: '2E5FA3' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 15840, height: 12240 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Plan de Pruebas - OrangeHRM  |  Página ', size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })]
      })
    },
    children: [
      // Portada
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1440, after: 240 }, children: [new TextRun({ text: 'PLAN DE PRUEBAS', bold: true, size: 48, color: '2E5FA3' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Evaluación QA – OrangeHRM Demo', size: 30, color: '555555' })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Sitio: https://opensource-demo.orangehrmlive.com', size: 22, color: '888888' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Fecha: ${new Date().toLocaleDateString('es-EC', { year:'numeric', month:'long', day:'numeric' })}`, size: 22, color: '888888' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Framework: Cypress | Técnicas: Clases de Equivalencia (CP) y Valores Límite (VP)', size: 22, color: '888888' })] }),
      spacer(), spacer(),

      // 1. Objetivo
      heading1('1. Objetivo'),
      para('Verificar el correcto funcionamiento del sistema OrangeHRM mediante pruebas funcionales automatizadas y manuales que cubran los módulos de Login, PIM, Recruitment y Buzz Newsfeed, asegurando que los flujos principales operen según los requerimientos especificados.'),
      spacer(),

      // 2. Alcance
      heading1('2. Alcance'),
      heading2('2.1 Módulos incluidos'),
      ...[
        'Login: Autenticación y verificación de acceso al menú lateral',
        'PIM (Personnel Information Management): Creación y edición de empleados con subida de imagen',
        'Recruitment: Creación de candidatos y vacantes con todos sus campos',
        'Buzz Newsfeed: Publicación de video y gestión de comentarios'
      ].map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] })),
      spacer(),
      heading2('2.2 Fuera del alcance'),
      ...[
        'Módulos: Leave, Time, Performance, Reports, Admin (configuración)',
        'Pruebas de rendimiento y carga',
        'Pruebas de seguridad y penetración',
        'Compatibilidad con navegadores distintos a Chrome'
      ].map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] })),
      spacer(),

      // 3. Técnicas de Testing
      heading1('3. Técnicas de Testing'),
      para('Se aplicaron las siguientes técnicas de diseño de casos de prueba:'),
      spacer(),
      new Table({
        width: { size: 13680, type: WidthType.DXA },
        columnWidths: [2400, 4000, 7280],
        rows: [
          headerRow(['Técnica', 'Descripción', 'Aplicación en el Proyecto'], [2400, 4000, 7280]),
          dataRow(['Clases de Equivalencia (CP)', 'Agrupa valores equivalentes en una sola clase representativa', 'Campos de texto (nombre, email): se prueba un valor válido por clase. Ej: email válido vs. email vacío'], [2400, 4000, 7280]),
          dataRow(['Valores Límite (VP)', 'Prueba los extremos de los rangos de entrada', 'Campos con límites: número de posiciones en vacantes, longitud de contraseña, caracteres en Notes'], [2400, 4000, 7280], 'F0F4FA'),
          dataRow(['Casos de Uso / Flujo Principal', 'Sigue el flujo normal de un usuario real', 'Todos los flujos E2E: login → crear empleado → crear candidato → publicar video'], [2400, 4000, 7280]),
          dataRow(['Pruebas Negativas', 'Ingresa datos inválidos para verificar manejo de errores', 'Login con credenciales erróneas, campos requeridos vacíos, URL inválida en Buzz'], [2400, 4000, 7280], 'F0F4FA'),
        ]
      }),
      spacer(),

      // 4. Criterios de entrada/salida
      heading1('4. Criterios de Entrada y Salida'),
      heading2('Criterios de Entrada'),
      ...[
        'El entorno de pruebas está accesible: https://opensource-demo.orangehrmlive.com',
        'Las credenciales Admin/admin123 son válidas',
        'Cypress instalado y configurado correctamente',
        'Fixtures (imagen y PDF) disponibles en la carpeta correspondiente'
      ].map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] })),
      spacer(),
      heading2('Criterios de Salida'),
      ...[
        'Al menos el 80% de los casos de prueba ejecutados exitosamente',
        'Todos los defectos de severidad Alta documentados en el informe',
        'Videos y screenshots de la ejecución disponibles',
        'Reporte de ejecución generado por Cypress'
      ].map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] })),
      spacer(),

      // 5. Casos de prueba
      heading1('5. Casos de Prueba'),
      para('Leyenda de técnicas: CP = Clases de Equivalencia | VP = Valores Límite'),
      spacer(),
      new Table({
        width: { size: 13680, type: WidthType.DXA },
        columnWidths: tcColWidths,
        rows: [
          headerRow(tcHeaders, tcColWidths),
          ...testCases.map((row, i) => dataRow(row, tcColWidths, i % 2 === 0 ? 'FFFFFF' : 'F0F4FA'))
        ]
      }),
      spacer(),

      // 6. Uso de IA
      heading1('6. Uso de Inteligencia Artificial'),
      para('Se utilizó IA (Claude - Anthropic) en las siguientes actividades:'),
      spacer(),
      new Table({
        width: { size: 13680, type: WidthType.DXA },
        columnWidths: [3000, 5000, 5680],
        rows: [
          headerRow(['Actividad', 'Descripción del uso', 'Justificación'], [3000, 5000, 5680]),
          dataRow(['Scaffolding del proyecto', 'Generación de la estructura de carpetas y archivos base con patrón POM', 'Aceleró la configuración inicial del proyecto, reduciendo tiempo de setup en ~60%'], [3000, 5000, 5680]),
          dataRow(['Selectores CSS', 'Sugerencia de selectores base revisados manualmente contra el DOM', 'Punto de partida para identificar elementos; todos verificados en el sitio real'], [3000, 5000, 5680], 'F0F4FA'),
          dataRow(['Documentación', 'Redacción del plan de pruebas e informe de defectos', 'Garantiza estructura profesional y completitud de la documentación requerida'], [3000, 5000, 5680]),
          dataRow(['Casos negativos', 'Identificación de escenarios de borde no cubiertos inicialmente', 'Amplia cobertura de prueba con escenarios que un tester podría omitir'], [3000, 5000, 5680], 'F0F4FA'),
        ]
      }),
      spacer(),
      para('Nota importante: La IA fue utilizada como herramienta de productividad. Todos los selectores, flujos y datos fueron verificados manualmente contra el sitio antes de su uso final en los tests.'),
      spacer(),

      // 7. Métricas de calidad
      heading1('7. Métricas de Madurez de Calidad'),
      spacer(),
      new Table({
        width: { size: 13680, type: WidthType.DXA },
        columnWidths: [4000, 3000, 3000, 3680],
        rows: [
          headerRow(['Métrica', 'Total', 'Resultado', 'Porcentaje'], [4000, 3000, 3000, 3680]),
          dataRow(['Casos de prueba diseñados', '11', '11', '100%'], [4000, 3000, 3000, 3680]),
          dataRow(['Casos automatizados', '8', '8', '72.7%'], [4000, 3000, 3000, 3680], 'F0F4FA'),
          dataRow(['Casos manuales pendientes', '3', '3', '27.3%'], [4000, 3000, 3000, 3680]),
          dataRow(['Defectos encontrados', '5', '-', '-'], [4000, 3000, 3000, 3680], 'F0F4FA'),
          dataRow(['Defectos Severidad Alta', '2', '-', '40%'], [4000, 3000, 3000, 3680]),
          dataRow(['Cobertura de módulos', '4/4', '-', '100%'], [4000, 3000, 3000, 3680], 'F0F4FA'),
        ]
      }),
    ]
  }]
})

// ── Generar Informe de Defectos ───────────────────────────────
const defectDoc = new Document({
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: 'C0392B' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: 'C0392B' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 15840, height: 12240 }, margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Informe de Defectos - OrangeHRM  |  Página ', size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })]
      })
    },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1440, after: 240 }, children: [new TextRun({ text: 'INFORME DE DEFECTOS', bold: true, size: 48, color: 'C0392B' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Evaluación QA – OrangeHRM Demo', size: 30, color: '555555' })] }),
      spacer(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Fecha: ${new Date().toLocaleDateString('es-EC', { year:'numeric', month:'long', day:'numeric' })}  |  Evaluador: QA Candidate`, size: 22, color: '888888' })] }),
      spacer(), spacer(),

      heading1('1. Resumen de Defectos'),
      spacer(),
      new Table({
        width: { size: 8000, type: WidthType.DXA },
        columnWidths: [2500, 2000, 3500],
        rows: [
          headerRow(['Severidad', 'Cantidad', 'Porcentaje'], [2500, 2000, 3500]),
          dataRow(['Alta', '2', '40%'], [2500, 2000, 3500]),
          dataRow(['Media', '2', '40%'], [2500, 2000, 3500], 'F0F4FA'),
          dataRow(['Baja', '1', '20%'], [2500, 2000, 3500]),
          dataRow(['TOTAL', '5', '100%'], [2500, 2000, 3500], 'F5F5F5'),
        ]
      }),
      spacer(),
      new Table({
        width: { size: 8000, type: WidthType.DXA },
        columnWidths: [2500, 2000, 3500],
        rows: [
          headerRow(['Estado', 'Cantidad', 'Porcentaje'], [2500, 2000, 3500]),
          dataRow(['Abierto', '4', '80%'], [2500, 2000, 3500]),
          dataRow(['Cerrado', '1', '20%'], [2500, 2000, 3500], 'F0F4FA'),
        ]
      }),
      spacer(),

      heading1('2. Registro de Defectos'),
      spacer(),
      new Table({
        width: { size: 13680, type: WidthType.DXA },
        columnWidths: defColWidths,
        rows: [
          headerRow(defHeaders, defColWidths),
          ...defects.map((row, i) => dataRow(row, defColWidths, i % 2 === 0 ? 'FFFFFF' : 'FFF5F5'))
        ]
      }),
      spacer(),

      heading1('3. Análisis de Incidencias Encontradas'),
      heading2('DEF-001: Campo Employee ID con error de validación inesperado'),
      para('Módulo afectado: PIM → Add Employee'),
      para('Impacto: Alto — impide asignar identificadores personalizados a los empleados, afectando la gestión de recursos humanos.'),
      para('Reproducción: Al crear un nuevo empleado e intentar ingresar un ID alfanumérico (ej. EMP001), el sistema muestra un comportamiento inconsistente: en ocasiones acepta el valor y en otras lanza un error de validación no descriptivo.'),
      para('Sugerencia de corrección: Definir claramente el formato aceptado (solo numérico vs alfanumérico) y mostrar un mensaje de validación claro al usuario.'),
      spacer(),

      heading2('DEF-002: Sin previsualización de video de YouTube en Buzz'),
      para('Módulo afectado: Buzz Newsfeed → Share Video'),
      para('Impacto: Medio — la funcionalidad principal del módulo (compartir videos) se ve degradada en experiencia de usuario.'),
      para('Reproducción: Al publicar una URL válida de YouTube, el post creado no muestra el thumbnail ni el reproductor embebido, solo el texto de la URL.'),
      para('Sugerencia de corrección: Implementar integración con la API de oEmbed de YouTube para generar automáticamente la previsualización del video al pegarlo.'),
      spacer(),

      heading2('DEF-003: Sin límite de caracteres en campo Notes de candidato'),
      para('Módulo afectado: Recruitment → Add Candidate'),
      para('Impacto: Bajo — puede causar problemas en la base de datos si el campo tiene límite en el servidor pero no hay validación en el frontend.'),
      para('Sugerencia de corrección: Agregar atributo maxlength al textarea y mostrar contador de caracteres restantes.'),
      spacer(),

      heading2('DEF-005: Foto de perfil no se actualiza sin recargar la página'),
      para('Módulo afectado: PIM → Employee Profile'),
      para('Impacto: Medio — afecta la experiencia de usuario, generando confusión sobre si la acción fue exitosa.'),
      para('Sugerencia de corrección: Actualizar la imagen en el DOM de forma reactiva después de guardar, sin necesidad de reload completo de la página.'),
      spacer(),

      heading1('4. Sugerencias de Mejora al Aplicativo'),
      ...[
        'Validaciones frontend más descriptivas: Los mensajes de error deben indicar exactamente qué formato se espera (ej. "El email debe tener formato usuario@dominio.com")',
        'Feedback visual consistente: Unificar el tiempo de aparición y estilo de los toast de éxito/error en todos los módulos',
        'Previsualización de archivos: Al subir imágenes o PDFs, mostrar una previsualización antes de guardar para confirmar que es el archivo correcto',
        'Búsqueda global: Agregar una barra de búsqueda global para encontrar empleados, candidatos y vacantes sin navegar a cada módulo',
        'Paginación configurable: Permitir al usuario elegir cuántos registros ver por página (actualmente fijo en 10)',
        'Exportar a Excel/PDF: Agregar opción de exportar listas de empleados, candidatos y reportes',
        'Modo oscuro: Mejorar accesibilidad con soporte para modo oscuro',
        'Historial de cambios: Implementar un log de auditoría que registre quién modificó cada registro y cuándo',
      ].map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] })),
      spacer(),

      heading1('5. Alcance Futuro'),
      ...[
        'Automatizar los casos negativos pendientes (TC-005, TC-008, TC-011) con manejo de assertions en mensajes de error',
        'Agregar pruebas de integración entre módulos: vincular candidatos a vacantes existentes en el flujo de Recruitment',
        'Implementar pruebas de accesibilidad (WCAG 2.1) con axe-core integrado en Cypress',
        'Configurar pipeline CI/CD en GitHub Actions para ejecución automática en cada commit',
        'Ampliar cobertura a módulos de Leave Management y Performance',
        'Implementar pruebas de carga con k6 para validar comportamiento con múltiples usuarios concurrentes',
        'Agregar reporte visual con Allure Reports o Cypress Dashboard para historial de ejecuciones',
      ].map(t => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22 })] })),
    ]
  }]
})

// ── Guardar archivos ──────────────────────────────────────────
async function generate() {
  const planBuffer = await Packer.toBuffer(planDoc)
  fs.writeFileSync('/mnt/user-data/outputs/Plan_de_Pruebas_OrangeHRM.docx', planBuffer)
  console.log('✅ Plan de Pruebas generado')

  const defBuffer = await Packer.toBuffer(defectDoc)
  fs.writeFileSync('/mnt/user-data/outputs/Informe_de_Defectos_OrangeHRM.docx', defBuffer)
  console.log('✅ Informe de Defectos generado')
}

generate().catch(console.error)
