@echo off
echo.
echo ========================================
echo   EJECUTANDO TESTS DE ORANGEHRM
echo ========================================
echo.

echo [1/4] Corriendo tests con Cypress...
npx cypress run --browser chrome

echo.
echo [2/4] Fusionando reportes...
npx mochawesome-merge cypress/reports/mochawesome.json cypress/reports/mochawesome_001.json cypress/reports/mochawesome_002.json cypress/reports/mochawesome_003.json > cypress/reports/reporte_final.json

echo.
echo [3/4] Generando reporte HTML...
npx marge cypress/reports/reporte_final.json --reportDir cypress/reports/html --inline

echo.
echo [4/4] Generando reporte Word...
node generar_desde_reporte.js

echo.
echo ========================================
echo   LISTO - Revisa estos archivos:
echo   - Reporte_Ejecucion_OrangeHRM.docx
echo   - cypress/reports/html/reporte_final.html
echo   - cypress/videos/
echo ========================================
echo.
pause
```

---
