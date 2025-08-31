param(
  [string]$BundleName = "_debug_{0}" -f (Get-Date -Format "yyyyMMdd_HHmmss")
)

function CopyIfExists($path, $dest) {
  if (Test-Path $path) { Copy-Item $path -Recurse -Force -Destination $dest }
}

New-Item -ItemType Directory -Path $BundleName | Out-Null
$dest = Resolve-Path $BundleName

# 1) High-signal files
CopyIfExists ".\api\index.js"           $dest
CopyIfExists ".\api\auth.js"            $dest
CopyIfExists ".\api\alerts.js"          $dest
CopyIfExists ".\api\transactions.js"    $dest
CopyIfExists ".\api\db.js"              $dest
CopyIfExists ".\api\package.json"       $dest
CopyIfExists ".\vite.config.js"         $dest
CopyIfExists ".\docker-compose.yml"     $dest

# Frontend (React/Vue via Vite)
New-Item -ItemType Directory -Path "$dest\frontend" | Out-Null
CopyIfExists ".\frontend\package.json"           "$dest\frontend"
CopyIfExists ".\frontend\vite.config.*"          "$dest\frontend"
CopyIfExists ".\frontend\src\api.js"             "$dest\frontend"
CopyIfExists ".\frontend\src\main.*"             "$dest\frontend"
CopyIfExists ".\frontend\src\App.*"              "$dest\frontend"
CopyIfExists ".\frontend\src\components"         "$dest\frontend"

# 2) Redacted envs
if (Test-Path ".\api\.env") {
  (Get-Content ".\api\.env") `
  | % { $_ -replace '^JWT_SECRET=.*','JWT_SECRET=***REDACTED***' `
           -replace '^DATABASE_URL=.*','DATABASE_URL=***REDACTED***' } `
  | Set-Content "$dest\api.env.redacted"
}
if (Test-Path ".\frontend\.env.local") {
  Copy-Item ".\frontend\.env.local" "$dest\frontend.env.local"
}

# 3) Structure snapshot + diagnostics
cmd /c tree /F > "$dest\TREE.txt" 2>$null

"=== PORT HEALTH ===" | Set-Content "$dest\diagnostics.txt"
foreach ($p in 3000..3003) {
  "`n--- http://127.0.0.1:$p/health ---" | Add-Content "$dest\diagnostics.txt"
  try {
    (Invoke-RestMethod -Uri "http://127.0.0.1:$p/health" -TimeoutSec 2) `
      | Out-String | Add-Content "$dest\diagnostics.txt"
  } catch { "ERROR: $($_.Exception.Message)" | Add-Content "$dest\diagnostics.txt" }
}

"`n=== LISTENERS 3000-3003 ===" | Add-Content "$dest\diagnostics.txt"
Get-NetTCPConnection -State Listen `
 | ? { $_.LocalPort -in 3000,3001,3002,3003 } `
 | Format-Table -Auto | Out-String | Add-Content "$dest\diagnostics.txt"

"`n=== VERSIONS ===" | Add-Content "$dest\diagnostics.txt"
"node: $(node -v)"      | Add-Content "$dest\diagnostics.txt"
"npm:  $(npm -v)"       | Add-Content "$dest\diagnostics.txt"

# 4) Zip it
$zip = "$($dest).zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path $dest -DestinationPath $zip -Force
Write-Host "`n? Bundle created:" (Resolve-Path $zip)
