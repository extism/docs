set export

_help:
  just --list

_edit:
  @$EDITOR {{justfile()}}

_prepare:
  #!/bin/bash
  set -eou pipefail

  if ! &>/dev/null which aspell; then
    if uname -a | &>/dev/null grep Linux; then
      sudo apt-get install aspell
    else
      brew install aspell
    fi
  fi

  if [ ! -e .venv ]; then
    python3 -m venv .venv
    . .venv/bin/activate
    pip install PySpelling
  fi

  if [ ! -e node_modules ]; then
    npm ci
  fi

# Start the development server. Automatically installs dependencies.
start: _prepare
  npm start

clean:
  #!/bin/bash
  set -eou pipefail
  rm -rf node_modules
  rm -rf .venv

run *args: _prepare
  npm run $args

spellcheck: _prepare
  #!/bin/bash
  pyspelling -c .spellcheck.yml

test: spellcheck
