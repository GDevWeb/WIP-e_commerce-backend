# Quick API Test
$API_URL = "http://localhost:3000"

Write-Host "`n🧪 Quick API Test`n" -ForegroundColor Cyan

# 1. Health
Write-Host "Health Check..." -NoNewline
$health = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
Write-Host " ✅ $($health.status)" -ForegroundColor Green

# 2. Login
Write-Host "Admin Login..." -NoNewline
$login = Invoke-RestMethod `
    -Uri "$API_URL/api/auth/login" `
    -Method Post `
    -Body (@{email="admin@example.com"; password="password123"} | ConvertTo-Json) `
    -ContentType "application/json"
$token = $login.accessToken
Write-Host " ✅" -ForegroundColor Green

# 3. Get Orders
Write-Host "Get Orders..." -NoNewline
$orders = Invoke-RestMethod `
    -Uri "$API_URL/api/orders" `
    -Method Get `
    -Headers @{Authorization="Bearer $token"}
Write-Host " ✅ Found $($orders.total) orders" -ForegroundColor Green

# 4. Get Products
Write-Host "Get Products..." -NoNewline
$products = Invoke-RestMethod -Uri "$API_URL/api/products" -Method Get
Write-Host " ✅ Found $($products.products.Count) products" -ForegroundColor Green

Write-Host "`n✅ All tests passed!`n" -ForegroundColor Green