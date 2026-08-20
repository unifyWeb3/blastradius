FROM ghcr.io/hydra-db/hydradb@sha256:db78309a233be54662db29744047e985a39b51c45a270d1a1f47c31a62cdb709

COPY --chmod=755 entrypoint.sh /usr/local/bin/blastradius-hydradb-entrypoint

ENTRYPOINT ["/usr/local/bin/blastradius-hydradb-entrypoint"]
