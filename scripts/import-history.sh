#!/usr/bin/env bash
# One-shot: give pulse-cards the git history of the four card repositories it replaces, so
# `git log` and `git blame` still reach back to each card's first commit.
#
# Run it once, by hand, from Git Bash at the root of pulse-cards while it is not yet a git repo:
#
#   bash scripts/import-history.sh
#
# What it does:
#   1. Clones each old repo (../area-pulse-card, ../home-pulse-card, ../tile-pulse-card,
#      ../scene-pulse-card) into a temporary folder. The old repos themselves are only read.
#   2. Rewrites each clone's history so every file sits under cards/<repo>/, where it lives now.
#   3. Creates this repo's .git and one commit that joins the four histories (an octopus merge of
#      the four rewritten `main` branches), without touching the files in this folder.
#
# Afterwards `git status` shows the move to one repository (the per-card package.json, dist/,
# workflows… gone, the root files new) for you to review and commit. Old tags are not brought
# over: v1.3.6 exists in more than one repo, and the new repo starts its own tags at v1.0.0.
set -euo pipefail

CARDS=(area-pulse-card home-pulse-card tile-pulse-card scene-pulse-card)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECTS="$(dirname "$ROOT")"
cd "$ROOT"

die() { echo "import-history: $*" >&2; exit 1; }
[ -e .git ] && die "this folder is already a git repository; the script is for a fresh one."
for c in "${CARDS[@]}"; do
  [ -d "$PROJECTS/$c/.git" ] || die "$PROJECTS/$c is not a git repository."
  [ -z "$(git -C "$PROJECTS/$c" -c core.filemode=false status --porcelain)" ] \
    || die "$c has uncommitted changes; commit or stash them there first."
  git -C "$PROJECTS/$c" rev-parse --verify --quiet main >/dev/null || die "$c has no 'main' branch."
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git init --quiet -b main
parents=()
for c in "${CARDS[@]}"; do
  echo "• $c"
  git clone --quiet --no-local --single-branch --branch main "$PROJECTS/$c" "$TMP/$c"
  (
    cd "$TMP/$c"
    FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --index-filter "
      git ls-files -s | sed 's#\t\"*#&cards/$c/#' |
        GIT_INDEX_FILE=\$GIT_INDEX_FILE.new git update-index --index-info &&
      if [ -f \"\$GIT_INDEX_FILE.new\" ]; then mv \"\$GIT_INDEX_FILE.new\" \"\$GIT_INDEX_FILE\"; fi
    " main >/dev/null 2>&1
  )
  git fetch --quiet --no-tags "$TMP/$c" "main:refs/import/$c"
  parents+=(-p "refs/import/$c")
done

# One tree with all four cards, as they were at their last commit, and one commit joining them.
export GIT_INDEX_FILE="$TMP/index"
git read-tree --empty
for c in "${CARDS[@]}"; do
  git ls-tree -r --full-tree "refs/import/$c" | git update-index --index-info
done
tree="$(git write-tree)"
unset GIT_INDEX_FILE
msg="chore: bring in the history of area-pulse-card, home-pulse-card, tile-pulse-card and scene-pulse-card

Each card's own commits, rewritten so its files sit under cards/<repo>/. The next commit moves
them into one bundle."
commit="$(git commit-tree "$tree" "${parents[@]}" -m "$msg")"
git update-ref refs/heads/main "$commit"
for c in "${CARDS[@]}"; do git update-ref -d "refs/import/$c"; done
git read-tree HEAD   # the index follows the new commit; the files in this folder stay as they are

echo
echo "Done: $(git rev-list --count HEAD) commits of history. Now review and commit the move:"
echo "  git status"
echo "  git add -A && git commit -m \"refactor: move the Pulse cards into one repository and one bundle\""
