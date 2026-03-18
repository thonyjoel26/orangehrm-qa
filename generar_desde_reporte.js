const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber
} = require('docx')
const fs = require('fs')

const reporte = JSON.parse(fs.readFileSync('cypress/reports/reporte_final.json', 'utf8'))

const border  = { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }
const borders = { top: border, bottom: border, left: border, right: border }

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: '2E5FA3' })]
  })
}

function para(text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })]
  })
}

function spacer() {
  return new Paragraph({ children: [new TextRun('')] })
}

function headerRow(cells, colWidths) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((text, i) =>
      new TableCell({
        borders,
        width: { size: colWidths[i], type: WidthType.DXA },
        shading: { fill: '2E5FA3', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, size: 18, color: 'FFFFFF' })]
        })]
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
        children: [new Paragraph({
          children: [new TextRun({ text: String(text), size: 20 })]
        })]
      })
    )
  })
}

const TODAY = new Date().toLocaleDateString('es-EC', {
  year: 'numeric', month: 'long', day: 'numeric'
})

const stats      = reporte.stats
const totalTests = stats.tests
const passed     = stats.passes
const failed     = stats.failures
const pending    = stats.pending
const duration   = (stats.duration / 1000).toFixed(1)

const filas = []
reporte.results.forEach((suite) => {
  suite.suites.forEach((subsuite) => {
    subsuite.tests.forEach((test) => {
      const estado = test.pass ? '✅ Pasó' : test.pending ? '⏳ Pendiente' : '❌ Falló'
      const tiempo = (test.duration / 1000).toFixed(1) + 's'
      const error  = test.err && test.err.message ? test.err.message.substring(0, 80) : '—'
      filas.push([subsuite.title, test.title, estado, tiempo, error])
    })
  })
})

const COLS  = [2000, 3000, 900, 900, 6880]
const HEADS = ['Módulo', 'Caso de Prueba', 'Estado', 'Tiempo', 'Error si aplica']

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [{
      id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
      run: { size: 28, bold: true, font: 'Arial', color: '2E5FA3' },
      paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 0 }
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 15840, height: 12240 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 360 },
        children: [new TextRun({ text: 'REPORTE DE EJECUCIÓN', bold: true, size: 56, color: '2E5FA3' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: 'Automatización E2E – OrangeHRM', size: 32, color: '555555' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `Fecha: ${TODAY}  |  Herramienta: Cypress`, size: 22, color: '888888' })]
      }),
      spacer(), spacer(),

      heading1('1. Resumen de Ejecución'),
      spacer(),
      new Table({
        width: { size: 8000, type: WidthType.DXA },
        columnWidths: [4000, 2000, 2000],
        rows: [
          headerRow(['Qué se midió', 'Número', 'Porcentaje'], [4000, 2000, 2000]),
          dataRow(['Total de casos ejecutados', String(totalTests), '100%'], [4000, 2000, 2000]),
          dataRow(['Casos que pasaron', String(passed), Math.round(passed/totalTests*100) + '%'], [4000, 2000, 2000], 'E8F5E9'),
          dataRow(['Casos que fallaron', String(failed), Math.round(failed/totalTests*100) + '%'], [4000, 2000, 2000], 'FFEBEE'),
          dataRow(['Casos pendientes', String(pending), Math.round(pending/totalTests*100) + '%'], [4000, 2000, 2000], 'FFF8E1'),
          dataRow(['Tiempo total de ejecución', duration + ' segundos', '—'], [4000, 2000, 2000]),
        ]
      }),
      spacer(),

      heading1('2. Detalle de Cada Prueba'),
      spacer(),
      new Table({
        width: { size: 13680, type: WidthType.DXA },
        columnWidths: COLS,
        rows: [
          headerRow(HEADS, COLS),
          ...filas.map((row, i) => {
            const fill = row[2] === '✅ Pasó' ? 'E8F5E9' : row[2] === '❌ Falló' ? 'FFEBEE' : 'FFF8E1'
            return dataRow(row, COLS, fill)
          })
        ]
      }),
      spacer(),

      heading1('3. Conclusión'),
      para(`Se ejecutaron ${totalTests} casos de prueba en total. ${passed} pasaron correctamente, ${failed} fallaron y ${pending} quedaron pendientes. El tiempo total fue de ${duration} segundos.`),
      spacer(),
      para('El caso que falló fue la creación de vacantes en Recruitment. El formulario se guarda en el servidor pero la página no muestra ningún mensaje de confirmación al usuario.'),
    ]
  }]
})

async function generate() {
  console.log('\n🔄 Generando reporte Word...\n')
  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync('Reporte_Ejecucion_OrangeHRM.docx', buffer)
  console.log('✅ Reporte_Ejecucion_OrangeHRM.docx generado\n')
}

generate().catch(console.error)