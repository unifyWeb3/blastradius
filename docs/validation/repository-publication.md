# Repository Publication Audit

Captured: 2026-08-17 (Africa/Lagos)

## Scope

This audit covers the snapshot intended for the public Hack Hydra repository:
<https://github.com/unifyWeb3/blastradius>. The application is feature-frozen for
this publication pass. No deployment is performed here.

## Local Git State

Workspace root: `/home/unify/hydra`

The root `.git` entry is an empty, read-only managed-environment mount. Git
therefore reports:

```text
fatal: not a git repository (or any of the parent directories): .git
```

Classification: **D - repository with masked/environment-artifact Git state**.
There is no usable local branch, commit, index, or remote configuration to
preserve. This is an environment limitation, not evidence of a clean working
tree. A fresh, honest initial `main` commit is the appropriate publication
path; no dates or authorship are backdated.

## Remote State Before Publication

The authoritative GitHub repository is public, configured with `main` as its
default branch, and was empty when audited. It had no files or commits. The
current account has permission to administer and push to it. The first public
commit must therefore contain the audited participant-authored snapshot.

## Eligibility Review

- Participant-authored application, validation, and research files are dated
  August 16-17, 2026.
- No participant-authored pre-August-12 commit is present in the remote because
  the remote was empty.
- No history is fabricated, rewritten, or backdated by this publication.
- `LICENSE` is the MIT license and covers BlastRadius application code.
- HydraDB and other dependencies retain their own licenses; attribution is in
  `README.md`.

## Secret/Sensitive File Audit

The repository was scanned for private-key blocks, hosted-token prefixes,
credential/password assignments, environment files, auth material, browser
session data, and deployment tokens. No publishable secret was found.

`.env.example` contains documented local-development values only. Local `.env`
files, HydraDB data directories, and runtime credentials are excluded. Fixed
HydraDB tokens in reproducible examples are explicitly local-only development
credentials, not hosted credentials.

## Publish Tree Policy

Included:

- TypeScript application source, tests, scripts, and lockfile;
- README, MIT license, product/technical/validation documentation;
- deterministic 20-record fixture and required evidence;
- reproducible investigation scripts and captured results;
- final desktop, mobile, and intentional-error browser evidence.

Excluded by `.gitignore`:

- `node_modules/`, `.pnpm-store/`, `dist/`, coverage, caches, logs, and
  TypeScript build metadata;
- `.env` variants except `.env.example`;
- local `hydradb-data/`;
- OS metadata/Zone.Identifier files;
- nested third-party checkouts under `investigation/upstream/` and
  `investigation/external/`;
- superseded browser captures under `docs/validation/browser-smoke/` and
  `docs/validation/browser-smoke-mobile/`.

The final evidence directories are retained:
`browser-smoke-final`, `browser-smoke-mobile-final`, and `browser-error-smoke`.

## Reproduction Gates

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm verify:static
```

With the documented local HydraDB runtime available:

```bash
pnpm hydra:acceptance
pnpm build
pnpm start
```

The full HydraDB setup and the no-Docker extracted-image fallback are documented
in `README.md` and `docs/validation/baseline.md`.

## Publication Verification Checklist

Before push, verify the staged file list, branch (`main`), remote URL, license,
README links, and secret scan. After push, verify the public repository itself:
README rendering, license detection, source/docs visibility, public history,
and absence of excluded or secret files. Do not treat a local-only check as
proof of public publication.

## Publication Result

Publication completed successfully on 2026-08-17.

```text
remote: https://github.com/unifyWeb3/blastradius
branch: main
initial commit: 0d8b7b1 Publish BlastRadius hackathon MVP
commit timestamp: 2026-08-17T09:27:07Z
```

Verified through the public GitHub repository/API:

- repository visibility is `public` and default branch is `main`;
- the public history begins with the current-time August 17 root commit;
- `README.md` and the source tree are accessible;
- GitHub detects `LICENSE` as MIT;
- all eight `docs/design/` handoff files are accessible;
- excluded dependencies, build output, runtime data, nested checkouts, and
  superseded screenshots are absent;
- `.env.example` is the only published environment file and contains local
  development examples only.

No application deployment was attempted during this mission.

## Known Publication Constraints

- The managed environment does not expose a usable root `.git`; Git metadata
  must be created in an isolated writable location or temporary clone and used
  to stage this audited workspace.
- Docker is unavailable in the current environment, so local validation uses
  the documented extracted HydraDB image launcher.
- `docs/submission.md` still has placeholders for the demo video, optional
  deployed demo, and team list until those external artifacts exist.
