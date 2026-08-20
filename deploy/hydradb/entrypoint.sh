#!/usr/bin/env bash
set -euo pipefail

: "${GRAPH_AUTH_TOKEN:?GRAPH_AUTH_TOKEN is required}"

data_root="${HYDRADB_DATA_ROOT:-/data}"
http_port="${PORT:-8443}"
bolt_port="${HYDRADB_BOLT_PORT:-7687}"
admin_port="${HYDRADB_ADMIN_PORT:-9090}"

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
export GRAPH_BOLT_ADDR="0.0.0.0:$bolt_port"
export GRAPH_ADVERTISED_BOLT_ADDR="${RAILWAY_PRIVATE_DOMAIN:-127.0.0.1}:$bolt_port"
export GRAPH_BOLT_NODE_ADDRESSES="node-0=127.0.0.1:$bolt_port"
export GRAPH_HTTP_ADDR="0.0.0.0:$http_port"
export GRAPH_ADMIN_ADDR="0.0.0.0:$admin_port"
export RUST_MIN_STACK="${RUST_MIN_STACK:-33554432}"
export RUST_LOG="${RUST_LOG:-info}"

exec /usr/local/bin/graph-node
