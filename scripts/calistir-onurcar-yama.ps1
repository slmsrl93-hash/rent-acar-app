$ErrorActionPreference = "Stop"
$candidates = @(
  "C:\projeler",
  "$env:USERPROFILE\Desktop\projeler",
  "$env:USERPROFILE\Desktop\projeler\rent-acar-app",
  "$env:USERPROFILE\Desktop\projeler\rent-acar-app.",
  "C:\projeler\rent-acar-app",
  "C:\projeler\rent-acar-app."
)
# Script next to this ps1 or downloaded
$script = Join-Path $PSScriptRoot "fix-onurcar-bakim.mjs"
if (-not (Test-Path $script)) {
  Write-Host "fix-onurcar-bakim.mjs bu klasorde yok. Once dosyayi sabit PC'ye kopyalayin."
  exit 1
}
$root = $null
foreach ($c in $candidates) {
  if (Test-Path (Join-Path $c "package.json")) { $root = $c; break }
  if (Test-Path $c) {
    Get-ChildItem $c -Directory -ErrorAction SilentlyContinue | ForEach-Object {
      if (Test-Path (Join-Path $_.FullName "package.json")) {
        $pkg = Get-Content (Join-Path $_.FullName "package.json") -Raw
        if ($pkg -match "vite") { $root = $_.FullName }
      }
    }
  }
}
if (-not $root) {
  Write-Host "Vite proje kokunu bulamadim. Elle verin:"
  Write-Host "  node fix-onurcar-bakim.mjs `"C:\yol\proje`""
  exit 1
}
Write-Host "Proje: $root"
node $script $root
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host ""
Write-Host "Sonraki adim: bu klasorde commit + Vercel onurcar production deploy"
