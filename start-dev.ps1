Write-Host "🚀 Iniciando MussikOn Admin System..." -ForegroundColor Green
Write-Host ""

Write-Host "📦 Iniciando Backend..." -ForegroundColor Yellow
Set-Location "../app_mussikon_express"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal

Write-Host ""
Write-Host "⏳ Esperando 5 segundos para que el backend inicie..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
Set-Location "../APP_Mussikon_Admin_System"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Ambos servidores iniciados:" -ForegroundColor Green
Write-Host "   🌐 Backend: http://localhost:1000" -ForegroundColor White
Write-Host "   🎨 Frontend: http://localhost:5174" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentación: http://localhost:1000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 