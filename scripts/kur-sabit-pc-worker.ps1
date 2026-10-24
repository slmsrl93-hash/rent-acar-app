#Requires -Version 5.1
<#
.SYNOPSIS
  Sabit PC'de Cursor My Machines worker'ini kalici kurar ve baslatir.

.DESCRIPTION
  - Cursor Agent CLI kurar (yoksa)
  - Git for Windows / Git Bash kontrol eder
  - Onurcar Vite proje kokunu bulur (--worker-dir)
  - Windows Startup'a otomatik baslatma ekler
  - agent worker start --name sabit-pc calistirir

  Bu oturum Linux bulut VM'den sabit PC'ye "sicramaz".
  Worker ayakta iken https://cursor.com/agents adresinden
  My Machines -> sabit-pc secerek YENI ajan acmaniz gerekir.
#>

$ErrorActionPreference = "Stop"
$WorkerName = "sabit-pc"

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host "OK: $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "UYARI: $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "HATA: $msg" -ForegroundColor Red }

# --- 1) Node / Git ---
Write-Step "Temel araclar"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Fail "Node.js yok. https://nodejs.org kurun, sonra bu scripti tekrar calistirin."
  exit 1
}
Write-Ok "node $(node -v)"

$gitBash = @(
  "C:\Program Files\Git\bin\bash.exe",
  "C:\Program Files (x86)\Git\bin\bash.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $gitBash) {
  Write-Fail "Git for Windows (Git Bash) yok. Worker Windows'ta buna ihtiyac duyar."
  Write-Host "Kurulum: https://git-scm.com/download/win"
  exit 1
}
Write-Ok "Git Bash: $gitBash"

# --- 2) Vite proje koku ---
Write-Step "Onurcar Vite proje koku"
$candidates = @()
if ($env:ONURCAR_ROOT) { $candidates += $env:ONURCAR_ROOT }
$candidates += @(
  "C:\projeler",
  "$env:USERPROFILE\Desktop\projeler",
  "$env:USERPROFILE\Documents\projeler",
  "C:\projeler\rent-acar-app",
  "C:\projeler\rent-acar-app.",
  "$env:USERPROFILE\Desktop\projeler\rent-acar-app",
  "$env:USERPROFILE\Desktop\projeler\rent-acar-app."
)

function Test-ViteRoot([string]$path) {
  if (-not (Test-Path (Join-Path $path "package.json"))) { return $false }
  $pkg = Get-Content (Join-Path $path "package.json") -Raw -ErrorAction SilentlyContinue
  return ($pkg -match '"vite"' -or $pkg -match 'vite')
}

$root = $null
foreach ($c in $candidates) {
  if (-not $c) { continue }
  if (Test-ViteRoot $c) { $root = (Resolve-Path $c).Path; break }
  if (Test-Path $c) {
    Get-ChildItem $c -Directory -ErrorAction SilentlyContinue | ForEach-Object {
      if (-not $root -and (Test-ViteRoot $_.FullName)) {
        $root = $_.FullName
      }
    }
  }
}

if (-not $root) {
  Write-Fail "Vite proje kokunu bulamadim."
  Write-Host "Ornek:"
  Write-Host '  $env:ONURCAR_ROOT = "C:\yol\onurcar-vite"'
  Write-Host "  .\kur-sabit-pc-worker.ps1"
  exit 1
}
Write-Ok "Proje: $root"

Push-Location $root
try {
  $remote = (git remote get-url origin 2>$null)
  if (-not $remote) {
    Write-Warn "Bu klasorde git remote yok. My Machines eslesmesi zayif kalabilir."
    Write-Host "Canli Onurcar Vite reposunun git kokunde calistirin (private Vercel git / gercek kaynak)."
  } else {
    Write-Ok "git origin: $remote"
    if ($remote -match "slmsrl93-hash/rent-acar-app" -and $remote -notmatch "1232057907") {
      Write-Warn "Bu remote public CRA stub olabilir. Canli Onurcar Vite kokunu kullanin."
    }
  }
} finally {
  Pop-Location
}

# --- 3) Cursor Agent CLI ---
Write-Step "Cursor Agent CLI"
$agentCmd = Get-Command agent -ErrorAction SilentlyContinue
if (-not $agentCmd) {
  Write-Host "CLI yok; kurulum basliyor..."
  try {
    irm 'https://cursor.com/install?win32=true' | iex
  } catch {
    Write-Fail "CLI kurulamadi: $($_.Exception.Message)"
    exit 1
  }
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
              [System.Environment]::GetEnvironmentVariable("Path", "User")
  $agentCmd = Get-Command agent -ErrorAction SilentlyContinue
}
if (-not $agentCmd) {
  Write-Fail "'agent' komutu PATH'te yok. PowerShell'i kapatip acin, tekrar deneyin."
  exit 1
}
$ver = (& agent --version 2>&1 | Out-String).Trim()
Write-Ok "agent: $ver"

# --- 4) Giris ---
Write-Step "Cursor oturumu"
$who = $null
try { $who = agent status 2>&1 | Out-String } catch { $who = $_.Exception.Message }
if ($who -match "Logged in|logged in|Authenticated|email" -or $env:CURSOR_API_KEY) {
  Write-Ok "Kimlik bilgisi var (login veya CURSOR_API_KEY)"
} else {
  Write-Warn "Giris gerekli. Tarayici acilacak..."
  agent login
}

# --- 5) Vercel (deploy icin) ---
Write-Step "Vercel CLI (deploy)"
if (Get-Command vercel -ErrorAction SilentlyContinue) {
  Write-Ok "vercel mevcut"
  Write-Host "Deploy icin bu PC'de bir kez: vercel login  (sonra proje linki onurcar)"
} else {
  Write-Warn "vercel yok. Isterseniz: npm i -g vercel   sonra vercel login"
}

# --- 6) Startup kaydi (kalici) ---
Write-Step "Windows Startup (otomasyon)"
$startupDir = [Environment]::GetFolderPath("Startup")
$launcher = Join-Path $env:LOCALAPPDATA "CursorWorker\start-sabit-pc-worker.cmd"
New-Item -ItemType Directory -Force -Path (Split-Path $launcher) | Out-Null

$agentExe = $agentCmd.Source
$cmd = @"
@echo off
cd /d "$root"
"$agentExe" worker start --name $WorkerName --worker-dir "$root"
"@
Set-Content -Path $launcher -Value $cmd -Encoding ASCII

$shortcutPath = Join-Path $startupDir "Cursor-sabit-pc-worker.lnk"
$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut($shortcutPath)
$sc.TargetPath = $launcher
$sc.WorkingDirectory = $root
$sc.WindowStyle = 7
$sc.Description = "Cursor My Machines worker: sabit-pc"
$sc.Save()
Write-Ok "Startup: $shortcutPath"
Write-Ok "Launcher: $launcher"

# --- 7) Eski worker varsa uyar ---
Write-Step "Worker baslatiliyor"
Write-Host "Mevcut 'agent worker' pencerelerini kapatip tek worker birakin (repos bos kalmasin)."
Write-Host "Komut: agent worker start --name $WorkerName --worker-dir `"$root`""
Write-Host ""

$startArgs = @("worker", "start", "--name", $WorkerName, "--worker-dir", $root)
Write-Host "Calistiriliyor (bu pencere acik kalmali)..."
& agent @startArgs
