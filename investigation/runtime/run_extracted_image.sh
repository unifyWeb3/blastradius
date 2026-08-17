#!/usr/bin/env bash
set -euo pipefail

# Foreground launcher for the exact no-Docker path used in this investigation.
# It assumes the official image filesystem is already extracted. Override the
# paths and ports with HYDRA_INV_* variables when needed.

runtime_root="${HYDRA_INV_RUNTIME_ROOT:-/tmp/hydradb-investigation-runtime}"
image_root="${HYDRA_INV_IMAGE_ROOT:-/tmp/hydradb-rootfs}"
bolt_addr="${HYDRA_INV_BOLT_ADDR:-127.0.0.1:17687}"
http_addr="${HYDRA_INV_HTTP_ADDR:-127.0.0.1:18443}"
admin_addr="${HYDRA_INV_ADMIN_ADDR:-127.0.0.1:19091}"
token="${HYDRA_INV_TOKEN:-hydradb-investigation-token-32-bytes}"

test -x "$image_root/usr/local/bin/graph-node"
mkdir -p "$runtime_root/store" "$runtime_root/cache"
printf '%s\n' "$token" >"$runtime_root/auth-token"

export CLOUD_PROVIDER=local
export LOCAL_PATH="$runtime_root/store"
export GRAPH_NAMESPACE=local
export GRAPH_ID=default
export GRAPH_CELL_ID=cell-0
export GRAPH_CELLS=cell-0
export GRAPH_DATA_PATH=data
export GRAPH_ALLOW_PLAINTEXT=true
export GRAPH_AUTH_TOKEN_FILE="$runtime_root/auth-token"
export GRAPH_DATA_CACHE_BYTES=67108864
export GRAPH_DATA_CACHE_DIR="$runtime_root/cache"
export GRAPH_NODE_ID=node-0
export GRAPH_BOLT_ADDR="$bolt_addr"
export GRAPH_ADVERTISED_BOLT_ADDR="$bolt_addr"
export GRAPH_BOLT_NODE_ADDRESSES="node-0=$bolt_addr"
export GRAPH_HTTP_ADDR="$http_addr"
export GRAPH_ADMIN_ADDR="$admin_addr"
export RUST_MIN_STACK=33554432
export RUST_LOG="${RUST_LOG:-info}"

current_ld_library_path="${LD_LIBRARY_PATH:-}"
if [[ -n "$current_ld_library_path" ]]; then
  export LD_LIBRARY_PATH="$image_root/usr/lib/x86_64-linux-gnu:$image_root/lib/x86_64-linux-gnu:$current_ld_library_path"
else
  export LD_LIBRARY_PATH="$image_root/usr/lib/x86_64-linux-gnu:$image_root/lib/x86_64-linux-gnu"
fi

exec "$image_root/usr/local/bin/graph-node"
