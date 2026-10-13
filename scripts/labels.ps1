#Requires -Version 7
<#
.SYNOPSIS
  Creates (or updates) the issue labels the issue forms and the backlog use.
.DESCRIPTION
  Run once, by the maintainer, with the GitHub CLI signed in (gh auth login).
  Safe to run again: --force updates the colour and description of existing labels.
.EXAMPLE
  pwsh scripts/labels.ps1
.EXAMPLE
  pwsh scripts/labels.ps1 -Repo zacharatos/pulse-theme
#>
param([string]$Repo = 'zacharatos/pulse-cards')
$ErrorActionPreference = 'Stop'

$labels = @(
  # What it is
  @('bug',             'd73a4a', "Something doesn't work")
  @('ui',              'f9a8d4', 'Works, but looks or feels off')
  @('idea',            'a2eeef', 'A suggestion: something a card could do')
  @('work-item',       '5319e7', 'Written up and ready to build (work item form)')
  @('refactor',        'c5def5', 'No visible change')
  @('real-house-test', '0e8a16', 'Needs trying in a real Home Assistant')
  @('documentation',   '0075ca', 'README, AGENTS.md, CHANGELOG')
  @('ci',              'bfdadc', 'Build, CI, release')
  # Which card (matches the commit scopes)
  @('card: area',      'fbca04', 'Area Pulse Card')
  @('card: home',      'fbca04', 'Home Pulse Card')
  @('card: shortcuts', 'fbca04', 'Home Pulse Shortcuts')
  @('card: tile',      'fbca04', 'Tile Pulse Card')
  @('card: scene',     'fbca04', 'Scene Pulse Card')
  @('card: all',       'fbca04', 'The bundle, or every card')
  # Where it is
  @('needs-triage',    'ededed', 'New, not looked at yet')
  @('needs-info',      'd4c5f9', 'Waiting for the reporter')
  @('ready',           '0e8a16', 'Agreed and specified; an agent can pick it up')
  @('blocked',         'b60205', 'Waiting on something else (HA release, another issue)')
  # How soon
  @('P1',              'b60205', 'Broken for someone, or blocks a release')
  @('P2',              'd93f0b', 'Next release')
  @('P3',              'c2e0c6', 'Someday: an idea worth keeping')
  # Where it came from
  @('from: forum',     'ffffff', 'Home Assistant community forum thread')
  @('from: reddit',    'ffffff', 'r/homeassistant post')
  @('from: own',       'ffffff', "Timos's own testing or idea")
)

foreach ($l in $labels) {
  gh label create $l[0] --repo $Repo --color $l[1] --description $l[2] --force
  if ($LASTEXITCODE -ne 0) { throw "Could not create label '$($l[0])' on $Repo." }
}
Write-Host "Labels ready on $Repo." -ForegroundColor Green
