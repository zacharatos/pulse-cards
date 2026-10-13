#Requires -Version 7
<#
.SYNOPSIS
  Builds the bundle and copies it into Home Assistant's www folder, to try changes before a release.
.DESCRIPTION
  For the maintainer's own Home Assistant, before tagging a version. HACS only installs released versions, so this
  puts the freshly built dist/pulse-cards.js at /local/pulse-cards-dev/pulse-cards.js through the Samba share
  add-on, and prints the dashboard resource URL to use, with a new cache-buster every time.

  It never changes Home Assistant itself: pointing the resource at the dev copy (and back to HACS after the
  release) stays a manual step in Settings -> Dashboards -> Resources.

  Needs: the Samba share add-on running, and the share opened once in Explorer so Windows remembers the sign-in.
.PARAMETER Share
  The config share. Default: $env:PULSE_HA_SHARE, else \\homeassistant\config (try \\homeassistant.local\config
  or \\<ip>\config if the name doesn't resolve).
.PARAMETER SkipBuild
  Copy the bundle as it is in dist/, without running npm run build first.
.EXAMPLE
  pwsh scripts/deploy-dev.ps1
.EXAMPLE
  pwsh scripts/deploy-dev.ps1 -Share \\192.168.1.20\config -SkipBuild
#>
param(
  [string]$Share = $(if ($env:PULSE_HA_SHARE) { $env:PULSE_HA_SHARE } else { '\\homeassistant\config' }),
  [switch]$SkipBuild
)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$bundle = Join-Path $root 'dist/pulse-cards.js'

if (-not $SkipBuild) {
  # node_modules installed by another OS (a Linux VM, WSL) has no Windows launchers and no Windows rollup binary.
  if ($IsWindows -and -not (Test-Path (Join-Path $root 'node_modules/.bin/rollup.cmd'))) {
    throw "node_modules wasn't installed on Windows (no rollup.cmd). Run 'npm ci' in $root once, then run this again."
  }
  Write-Host 'Building the bundle...'
  Push-Location $root
  try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed (exit code $LASTEXITCODE); nothing was copied." }
  } finally {
    Pop-Location
  }
}
if (-not (Test-Path $bundle)) { throw "No bundle at $bundle. Run npm run build first." }

if (-not (Test-Path $Share)) {
  throw @"
Can't reach $Share.
- Is the Samba share add-on installed and started in Home Assistant?
- Open $Share in Explorer once and sign in with the add-on's username and password (tick "Remember my credentials").
- If the name doesn't resolve, pass the address: -Share \\homeassistant.local\config or -Share \\<ip>\config
  (or set it once: `$env:PULSE_HA_SHARE = '\\<ip>\config').
"@
}

$target = Join-Path $Share 'www/pulse-cards-dev'
New-Item -ItemType Directory -Force -Path $target | Out-Null
Copy-Item -Path $bundle -Destination (Join-Path $target 'pulse-cards.js') -Force

# The version in the bundle plus the time: a new URL on every deploy, so browsers and the companion app reload it.
$version = (Select-String -Path (Join-Path $root 'src/version.ts') -Pattern 'VERSION = "([^"]+)"').Matches[0].Groups[1].Value
$stamp = Get-Date -Format 'MMdd-HHmm'
$url = "/local/pulse-cards-dev/pulse-cards.js?v=$version-$stamp"

Write-Host ''
Write-Host "Copied v$version to $target" -ForegroundColor Green
Write-Host ''
Write-Host 'Set the Pulse Cards resource (Settings -> Dashboards -> Resources) to:'
Write-Host "  $url" -ForegroundColor Cyan
Write-Host 'Edit the existing entry, never add a second one, then hard-refresh the browser (Ctrl+F5).'
Write-Host 'After the release: set it back to /hacsfiles/pulse-cards/pulse-cards.js'
