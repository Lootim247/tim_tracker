# Test Local Server
$localBody = @{ test = $true } | ConvertTo-Json
$localHeaders = @{
    'Authorization' = 'Basic dHBhbmlsYWlAZ21haWwuY29tOnR0LVRBTG4tcEFSTy1wVE5SLWxmWTMtN29BUA=='
    'Content-Type' = 'application/json'
}

try {
    $localResponse = Invoke-RestMethod -Uri 'http://localhost:3000/tim-tracker/api/upload-location' `
        -Method Post `
        -Headers $localHeaders `
        -Body $localBody
    Write-Host "Local Response:" -ForegroundColor Green
    $localResponse | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "Local Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Test Vercel Production
$vercelBody = @{ test = $true } | ConvertTo-Json
$vercelHeaders = @{
    'Authorization' = 'Basic dHBhbmlsYWlAZ21haWwuY29tOnR0LVRBTG4tcEFSTy1wVE5SLWxmWTMtN29BUA=='
    'Content-Type' = 'application/json'
}

try {
    $vercelResponse = Invoke-RestMethod -Uri 'https://tim-tracker-sigma.vercel.app/tim-tracker/api/upload-location' `
        -Method Post `
        -Headers $vercelHeaders `
        -Body $vercelBody
    Write-Host "`nVercel Response:" -ForegroundColor Green
    $vercelResponse | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "`nVercel Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}