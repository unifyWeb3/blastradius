#!/usr/bin/env bash
set -euo pipefail

: "${GRAPH_AUTH_TOKEN:?GRAPH_AUTH_TOKEN is required}"

data_root="${HYDRADB_DATA_ROOT:-/data}"
hydra_http_port="${HYDRADB_INTERNAL_HTTP_PORT:-8443}"
hydra_bolt_port="${HYDRADB_BOLT_PORT:-7687}"
hydra_admin_port="${HYDRADB_ADMIN_PORT:-9090}"

mkdir -p "$data_root/store" "$data_root/cache"
umask 077
printf '%s\n' "$GRAPH_AUTH_TOKEN" > "$data_root/auth-token"

export CLOUD_PROVIDER=local
export LOCAL_PATH="$data_root/store"
export GRAPH_NAMESPACE="${GRAPH_NAMESPACE:-default}"
export GRAPH_ID="${GRAPH_ID:-default}"
export GRAPH_CELL_ID="${GRAPH_CELL_ID:-cell-0}"
export GRAPH_CELLS="${GRAPH_CELLS:-cell-0}"
export GRAPH_DATA_PATH="${GRAPH_DATA_PATH:-data}"
export GRAPH_ALLOW_PLAINTEXT="${GRAPH_ALLOW_PLAINTEXT:-true}"
export GRAPH_AUTH_TOKEN_FILE="$data_root/auth-token"
export GRAPH_DATA_CACHE_BYTES="${GRAPH_DATA_CACHE_BYTES:-67108864}"
export GRAPH_DATA_CACHE_DIR="$data_root/cache"
export GRAPH_NODE_ID="${GRAPH_NODE_ID:-node-0}"
export GRAPH_BOLT_ADDR="127.0.0.1:$hydra_bolt_port"
export GRAPH_ADVERTISED_BOLT_ADDR="127.0.0.1:$hydra_bolt_port"
export GRAPH_BOLT_NODE_ADDRESSES="node-0=127.0.0.1:$hydra_bolt_port"
export GRAPH_HTTP_ADDR="127.0.0.1:$hydra_http_port"
export GRAPH_ADMIN_ADDR="127.0.0.1:$hydra_admin_port"
export RUST_MIN_STACK="${RUST_MIN_STACK:-33554432}"
export RUST_LOG="${RUST_LOG:-info}"

/usr/local/bin/graph-node &
hydra_pid=$!

cleanup() {
  kill "$hydra_pid" 2>/dev/null || true
  if [[ -n "${app_pid:-}" ]]; then
    kill "$app_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

ready=false
for attempt in $(seq 1 "${HYDRADB_START_ATTEMPTS:-60}"); do
  if ! kill -0 "$hydra_pid" 2>/dev/null; then
    echo "HydraDB graph-node exited before becoming ready." >&2
    exit 1
  fi
  if (echo >/dev/tcp/127.0.0.1/"$hydra_http_port") 2>/dev/null; then
    ready=true
    break
  fi
  sleep "${HYDRADB_START_RETRY_SECONDS:-1}"
done

if [[ "$ready" != true ]]; then
  echo "HydraDB did not open its internal HTTP port in time." >&2
  exit 1
fi

export HYDRADB_URL="http://127.0.0.1:$hydra_http_port"
export HYDRADB_TOKEN="$GRAPH_AUTH_TOKEN"
export HYDRADB_NAMESPACE="${HYDRADB_NAMESPACE:-$GRAPH_NAMESPACE}"
export HYDRADB_GRAPH_ID="${HYDRADB_GRAPH_ID:-$GRAPH_ID}"
export HYDRADB_CELL_ID="${HYDRADB_CELL_ID:-$GRAPH_CELL_ID}"
export BLASTRADIUS_AUTO_INGEST="${BLASTRADIUS_AUTO_INGEST:-true}"

pnpm start &
app_pid=$!

set +e
wait -n "$hydra_pid" "$app_pid"
status=$?
set -e

cleanup
wait "$hydra_pid" "$app_pid" 2>/dev/null || true
exit "$status"
