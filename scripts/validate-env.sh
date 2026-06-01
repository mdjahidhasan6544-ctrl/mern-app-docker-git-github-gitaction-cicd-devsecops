#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env}"

required_vars=(
  NODE_ENV
  APP_PROTOCOL
  AWS_HOST
  APP_PORT
  SERVER_PORT
  FRONTEND_URL
  BACKEND_URL
  PUBLIC_API_URL
  ALLOWED_ORIGINS
  MONGODB_URI
  JWT_SECRET
  DOCKER_IMAGE
  DOCKER_TAG
)

trim_key() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

load_env_file() {
  local file="$1"

  if [[ ! -f "$file" ]]; then
    echo "Missing env file: $file" >&2
    exit 1
  fi

  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" != *=* ]] && continue

    local key="${line%%=*}"
    local value="${line#*=}"
    key="$(trim_key "$key")"

    if [[ ! "$key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
      echo "Invalid env variable name in $file: $key" >&2
      exit 1
    fi

    if [[ "$value" =~ ^\"(.*)\"$ ]]; then
      value="${BASH_REMATCH[1]}"
    elif [[ "$value" =~ ^\'(.*)\'$ ]]; then
      value="${BASH_REMATCH[1]}"
    fi

    export "$key=$value"
  done < "$file"
}

validate_port() {
  local name="$1"
  local value="${!name:-}"

  if [[ ! "$value" =~ ^[0-9]+$ ]] || (( value < 1 || value > 65535 )); then
    echo "$name must be a TCP port between 1 and 65535." >&2
    return 1
  fi
}

load_env_file "$ENV_FILE"

missing=0
echo "Validating deployment environment: $ENV_FILE"

for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing required variable: $var" >&2
    missing=1
  else
    echo "$var is set."
  fi
done

if (( missing != 0 )); then
  echo "Environment validation failed." >&2
  exit 1
fi

validate_port APP_PORT
validate_port SERVER_PORT

echo "Environment validation passed."
