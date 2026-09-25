#!/bin/sh
#
# (Re)generate the lockfile fixtures in test/fixtures with real package managers.
#
# Every fixture depends on `array-includes` (covered by nolyfill), `resolve` (not covered, depends
# on the covered `is-core-module`) and `object.assign` (covered, devDependency). Workspace fixtures
# have a `packages/a` workspace package depending on `has` and `side-channel` (covered).
# The `*-nolyfilled` fixtures are the result of running `nolyfill install` followed by the package
# manager on the corresponding fixture.
#
# The projects are created in a temporary directory (a fixture inside the monorepo would be
# treated as one of its workspace packages by pnpm and yarn), only the manifests and lockfiles are
# copied back. Requires network access, npm, pnpm, npx and corepack (bun is fetched through npx).
# The legacy binary bun.lockb fixture is produced by Bun 1.1, which ignores --lockfile-only and
# performs a full install, so that step takes a while.
#
# Usage: pnpm --filter nolyfill run test:fixtures
set -eu

CLI=$(cd "$(dirname "$0")/.." && pwd)
FIXTURES="$CLI/test/fixtures"
WORK=$(mktemp -d)
CACHE="$WORK/.cache"

export npm_config_cache="$CACHE/npm" COREPACK_ENABLE_STRICT=0 COREPACK_HOME="$CACHE/corepack" NO_UPDATE_CHECK=1
cd "$WORK"

mk() {
  mkdir -p "$1"
  cat > "$1/package.json" <<EOF
{
  "name": "fixture-root",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "array-includes": "^3.1.8",
    "resolve": "^1.22.10"
  },
  "devDependencies": {
    "object.assign": "^4.1.5"
  }$2
}
EOF
}
mkws() {
  mkdir -p "$1/packages/a"
  cat > "$1/packages/a/package.json" <<EOF
{
  "name": "a",
  "version": "1.0.0",
  "dependencies": {
    "has": "^1.0.4",
    "side-channel": "^1.1.0"
  }
}
EOF
}
mkpnpmws() {
  printf 'packages:\n  - "packages/*"\n' > "$1/pnpm-workspace.yaml"
}
mkyarnrc() {
  printf 'nodeLinker: node-modules\nenableGlobalCache: false\ncacheFolder: %s/yarn4\n' "$CACHE" > "$1/.yarnrc.yml"
}

mk npm6-single ''
mk npm-single ''
mk npm-ws ',
  "workspaces": ["packages/*"]'; mkws npm-ws
mk pnpm-single ''
mk pnpm-ws ',
  "packageManager": "pnpm@12.6.0"'; mkws pnpm-ws; mkpnpmws pnpm-ws
mk pnpm7-single ''
mk pnpm8-single ''
mk pnpm8-ws ',
  "packageManager": "pnpm@8.15.9"'; mkws pnpm8-ws; mkpnpmws pnpm8-ws
mk pnpm9-single ''
mk pnpm10-single ''
mk yarn1-single ''
mk yarn1-ws ',
  "workspaces": ["packages/*"]'; mkws yarn1-ws
mk yarn4-single ',
  "packageManager": "yarn@4.9.2"'; mkyarnrc yarn4-single
mk yarn4-ws ',
  "workspaces": ["packages/*"],
  "packageManager": "yarn@4.9.2"'; mkws yarn4-ws; mkyarnrc yarn4-ws
mk bun-single ''
mk bun-ws ',
  "workspaces": ["packages/*"]'; mkws bun-ws
mk bun-legacy-single ''

run() {
  dir=$1; shift
  printf '%s: %s\n' "$dir" "$*"
  (cd "$dir" && "$@" > "$WORK/$dir.log" 2>&1) || { cat "$WORK/$dir.log"; exit 1; }
}
install_npm()    { run "$1" npm install --package-lock-only --ignore-scripts --no-audit --no-fund; }
install_npm6()   { run "$1" npx -y npm@6 install --package-lock-only --ignore-scripts --no-audit --no-fund; }
install_pnpm()   { run "$1" pnpm install --lockfile-only; }
install_pnpm7()  { run "$1" npx -y pnpm@7.33.7 install --lockfile-only; }
install_pnpm8()  { run "$1" npx -y pnpm@8.15.9 install --lockfile-only; }
install_pnpm9()  { run "$1" npx -y pnpm@9.15.9 install --lockfile-only; }
install_pnpm10() { run "$1" npx -y pnpm@10.32.1 install --lockfile-only; }
install_yarn1()  { run "$1" corepack yarn@1.22.22 install --ignore-scripts --non-interactive --cache-folder "$CACHE/yarn1"; }
install_yarn4()  { run "$1" corepack yarn@4.9.2 install --mode=update-lockfile; }
install_bun()    { run "$1" npx -y bun@latest install --lockfile-only; }
install_bun1()   { run "$1" npx -y bun@1.1.38 install; }

install_npm6 npm6-single
install_npm npm-single
install_npm npm-ws
install_pnpm pnpm-single
install_pnpm pnpm-ws
install_pnpm7 pnpm7-single
install_pnpm8 pnpm8-single
install_pnpm8 pnpm8-ws
install_pnpm9 pnpm9-single
install_pnpm10 pnpm10-single
install_yarn1 yarn1-single
install_yarn1 yarn1-ws
install_yarn4 yarn4-single
install_yarn4 yarn4-ws
install_bun bun-single
install_bun bun-ws
install_bun1 bun-legacy-single

# `nolyfill install` (from source) followed by the package manager
nolyfilled() {
  src=$1; installer=$2; dst="$1-nolyfilled"
  cp -R "$src" "$dst"
  rm -rf "$dst/node_modules"
  run "$dst" node -r "$CLI/node_modules/@swc-node/register" "$CLI/src/cli.ts" install
  cat "$WORK/$dst.log"
  "$installer" "$dst"
}
nolyfilled npm-single install_npm
nolyfilled pnpm-ws install_pnpm
nolyfilled pnpm8-ws install_pnpm8
nolyfilled yarn1-ws install_yarn1
nolyfilled yarn4-ws install_yarn4
nolyfilled bun-ws install_bun

# only keep manifests and lockfiles
rm -rf "$FIXTURES"
for dir in */; do
  dir=${dir%/}
  mkdir -p "$FIXTURES/$dir"
  (cd "$dir" && find . -type f \( -name package.json -o -name package-lock.json -o -name pnpm-lock.yaml -o -name pnpm-workspace.yaml -o -name yarn.lock -o -name bun.lock -o -name bun.lockb \) -not -path '*/node_modules/*' | cpio -pdm "$FIXTURES/$dir" 2> /dev/null)
  if [ -f "$dir/.yarnrc.yml" ]; then
    printf 'nodeLinker: node-modules\n' > "$FIXTURES/$dir/.yarnrc.yml"
  fi
done

rm -rf "$WORK"
echo "fixtures written to $FIXTURES"
