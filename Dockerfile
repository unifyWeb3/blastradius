FROM ghcr.io/hydra-db/hydradb@sha256:db78309a233be54662db29744047e985a39b51c45a270d1a1f47c31a62cdb709 AS hydradb

FROM node:22-bookworm-slim

WORKDIR /app
ENV CI=true
RUN corepack enable

# The Railway free-plan fallback runs the pinned HydraDB graph node beside the
# Node API in one service. The graph node remains private on localhost.
COPY --from=hydradb /usr/local/bin/graph-node /usr/local/bin/graph-node
COPY --from=hydradb /usr/lib/x86_64-linux-gnu/libgraphblas.so.7.4.0 /opt/hydradb-libs/libgraphblas.so.7.4.0
COPY --from=hydradb /usr/lib/x86_64-linux-gnu/libgomp.so.1.0.0 /opt/hydradb-libs/libgomp.so.1.0.0
COPY --from=hydradb /usr/lib/x86_64-linux-gnu/libgcc_s.so.1 /opt/hydradb-libs/libgcc_s.so.1
RUN ln -s libgraphblas.so.7.4.0 /opt/hydradb-libs/libgraphblas.so.7 \
  && ln -s libgomp.so.1.0.0 /opt/hydradb-libs/libgomp.so.1
ENV LD_LIBRARY_PATH=/opt/hydradb-libs

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
COPY --chmod=755 deploy/single-service/entrypoint.sh /usr/local/bin/blastradius-entrypoint

ENV NODE_ENV=production
EXPOSE 8787 8443
ENTRYPOINT ["/usr/local/bin/blastradius-entrypoint"]
