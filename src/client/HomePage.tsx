import {
  ArrowRight,
  Box,
  Clock3,
  Database,
  FileCheck2,
  GitBranch,
  Package,
  Radar,
  SearchCheck,
  ShieldAlert,
  Waypoints,
} from "lucide-react";
import type { ReactNode } from "react";

const incidentHref = "/incident";

export const HomePage = () => (
  <div className="home-shell">
    <header className="home-nav">
      <a className="home-brand" href="/" aria-label="BlastRadius home">
        <span className="brand-mark"><ShieldAlert size={20} aria-hidden="true" /></span>
        <span>
          <strong>BlastRadius</strong>
          <small>Temporal supply-chain analysis</small>
        </span>
      </a>
      <nav aria-label="Product navigation">
        <a href="#problem">Problem</a>
        <a href="#workflow">Workflow</a>
        <a href="#hydradb">Why HydraDB</a>
      </nav>
      <a className="home-nav__action" href={incidentHref}>Open incident <ArrowRight size={15} /></a>
    </header>

    <main>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <p className="home-kicker"><span /> Temporal supply-chain blast-radius analysis</p>
          <h1 id="home-title">Know exactly what a compromised dependency reaches.</h1>
          <p className="home-hero__lede">
            BlastRadius traces exact dependency relationships through HydraDB to reveal which applications
            are transitively exposed, when that exposure was active, and the path that proves it.
          </p>
          <div className="home-actions">
            <a className="home-button home-button--primary" href={incidentHref}>
              Investigate an incident <ArrowRight size={17} />
            </a>
            <a className="home-button home-button--quiet" href="#proof">
              Explore the graph <GitBranch size={16} />
            </a>
          </div>
          <dl className="home-signal-row">
            <div><dt>Identity</dt><dd>Exact package versions</dd></div>
            <div><dt>Traversal</dt><dd>Incoming SSpaths</dd></div>
            <div><dt>Time</dt><dd>Half-open intervals</dd></div>
          </dl>
        </div>

        <HeroGraphPreview />
      </section>

      <section className="home-problem home-section" id="problem" aria-labelledby="problem-title">
        <div className="home-section__intro">
          <p className="home-kicker">The incident-response gap</p>
          <h2 id="problem-title">A package advisory is only the starting point.</h2>
          <p>
            Knowing that a version is compromised does not identify the applications that resolved it through
            direct and transitive dependencies. Responders need reachability, exact versions, time, and evidence.
          </p>
        </div>
        <div className="problem-comparison">
          <article>
            <span className="problem-comparison__index">01</span>
            <Package size={21} aria-hidden="true" />
            <p>Package is compromised</p>
            <strong>ua-parser-js@0.7.29</strong>
            <small>An advisory identifies risk, not operational impact.</small>
          </article>
          <ArrowRight className="problem-comparison__arrow" size={24} aria-hidden="true" />
          <article className="problem-comparison__answer">
            <span className="problem-comparison__index">02</span>
            <Radar size={21} aria-hidden="true" />
            <p>Know what it actually reaches</p>
            <strong>Applications + paths + exposure window</strong>
            <small>A directed graph proves impact without guessing from package similarity.</small>
          </article>
        </div>
      </section>

      <section className="home-workflow home-section" id="workflow" aria-labelledby="workflow-title">
        <div className="home-section__intro home-section__intro--wide">
          <p className="home-kicker">One incident workflow</p>
          <h2 id="workflow-title">From compromised version to defensible answer.</h2>
        </div>
        <ol className="workflow-rail">
          <WorkflowStep index="01" icon={<SearchCheck />} title="Identify" text="Start with one exact compromised package/version." />
          <WorkflowStep index="02" icon={<Waypoints />} title="Traverse" text="HydraDB follows incoming dependency paths to application roots." />
          <WorkflowStep index="03" icon={<Clock3 />} title="Intersect" text="Evaluate every path against the requested exposure window." />
          <WorkflowStep index="04" icon={<FileCheck2 />} title="Explain" text="Return the ordered path, relationship evidence, and verdict." />
        </ol>
      </section>

      <section className="home-hydra home-section" id="hydradb" aria-labelledby="hydra-title">
        <div className="home-hydra__copy">
          <p className="home-kicker"><Database size={14} /> HydraDB is the analytical engine</p>
          <h2 id="hydra-title">The blast radius comes from graph traversal—not a lookup table.</h2>
          <p>
            BlastRadius stores exact applications, versions, and <code>DEPENDS_ON</code> relationships in HydraDB.
            The backend starts at the compromised version and runs a bounded incoming <code>algo.SSpaths</code>
            traversal. HydraDB returns hydrated nodes and edges; the application then applies an explicit temporal policy.
          </p>
          <a className="home-text-link" href={incidentHref}>See the traversal in the incident console <ArrowRight size={15} /></a>
        </div>
        <PipelineVisual />
      </section>

      <section className="home-proof home-section" id="proof" aria-labelledby="proof-title">
        <div className="home-section__intro">
          <p className="home-kicker">Curated incident proof</p>
          <h2 id="proof-title">The graph is the explanation.</h2>
          <p>
            The shipped dataset uses the real malicious <code>ua-parser-js@0.7.29</code> advisory and curated,
            lockfile-shaped application paths. The analysis is deterministic and runs against HydraDB.
          </p>
        </div>
        <div className="proof-console">
          <header>
            <span><ShieldAlert size={15} /> GHSA-pjwm-rvh2-c87w</span>
            <code>HydraDB · incoming · 6 hops</code>
          </header>
          <div className="proof-metrics">
            <div><small>Exposed applications</small><strong>1</strong><code>affectedRoots[]</code></div>
            <div><small>Topological candidates</small><strong>2</strong><code>candidateRoots[]</code></div>
            <div><small>Selected result</small><strong className="proof-metrics__status">Exposed</strong><code>effective overlap: 4.0h</code></div>
          </div>
          <div className="proof-path" aria-label="Merchant Web dependency evidence path">
            <ProofNode icon={<Box />} label="Merchant Web" detail="application" />
            <ProofEdge />
            <ProofNode icon={<Package />} label="@acme/commerce-sdk@3.4.0" detail="dependency" />
            <ProofEdge />
            <ProofNode icon={<Package />} label="request-ip@2.1.3" detail="dependency" />
            <ProofEdge />
            <ProofNode icon={<ShieldAlert />} label="ua-parser-js@0.7.29" detail="compromised" danger />
          </div>
          <footer>
            <span><FileCheck2 size={15} /> Exact lockfile evidence on every relationship</span>
            <span><Clock3 size={15} /> Active during the incident window</span>
          </footer>
        </div>
      </section>

      <section className="home-final-cta">
        <div>
          <p className="home-kicker">Incident ready</p>
          <h2>Trace the dependency. Prove the exposure.</h2>
          <p>Open the curated incident and run the real HydraDB traversal.</p>
        </div>
        <a className="home-button home-button--primary" href={incidentHref}>
          Investigate the incident <ArrowRight size={17} />
        </a>
      </section>
    </main>

    <footer className="home-footer">
      <span>BlastRadius · Hack Hydra 2026 · Track 02</span>
      <span>Curated incident dataset · MIT licensed</span>
    </footer>
  </div>
);

const HeroGraphPreview = () => (
  <div className="hero-graph" aria-label="Preview of the Merchant Web dependency path">
    <header>
      <div><span>Incident graph</span><strong>Selected exposure path</strong></div>
      <code>4 nodes · 3 edges</code>
    </header>
    <div className="hero-graph__canvas">
      <div className="hero-graph__signal"><span /> exposed in window</div>
      <div className="hero-path hero-path--merchant">
        <PreviewNode kind="application" label="Merchant Web" detail="production" />
        <PreviewEdge />
        <PreviewNode label="@acme/commerce-sdk" detail="v3.4.0" />
        <PreviewEdge />
        <PreviewNode label="request-ip" detail="v2.1.3" />
        <PreviewEdge />
        <PreviewNode kind="compromised" label="ua-parser-js" detail="v0.7.29" />
      </div>
      <div className="hero-path hero-path--admin" aria-label="Outside-window candidate path">
        <PreviewNode kind="outside" label="Admin Portal" detail="outside window" />
        <PreviewEdge muted />
        <PreviewNode muted label="@acme/identity-sdk" detail="v2.7.1" />
      </div>
      <div className="hero-graph__timeline">
        <span>Effective exposure</span><i /><strong>4.0h</strong>
      </div>
    </div>
    <footer>
      <span><i className="legend-dot legend-dot--danger" /> Compromised</span>
      <span><i className="legend-dot legend-dot--teal" /> Selected path</span>
      <span><i className="legend-dot legend-dot--amber" /> Outside window</span>
    </footer>
  </div>
);

const PreviewNode = ({ label, detail, kind, muted }: { label: string; detail: string; kind?: "application" | "compromised" | "outside"; muted?: boolean }) => (
  <div className={["preview-node", kind ? `preview-node--${kind}` : "", muted ? "preview-node--muted" : ""].filter(Boolean).join(" ")}>
    {kind === "application" || kind === "outside" ? <Box size={14} /> : kind === "compromised" ? <ShieldAlert size={14} /> : <Package size={14} />}
    <span><strong>{label}</strong><small>{detail}</small></span>
  </div>
);

const PreviewEdge = ({ muted = false }: { muted?: boolean }) => (
  <div className={muted ? "preview-edge preview-edge--muted" : "preview-edge"}>
    <code>DEPENDS_ON</code><span /><ArrowRight size={13} />
  </div>
);

const WorkflowStep = ({ index, icon, title, text }: { index: string; icon: ReactNode; title: string; text: string }) => (
  <li>
    <span className="workflow-rail__index">{index}</span>
    <span className="workflow-rail__icon">{icon}</span>
    <strong>{title}</strong>
    <p>{text}</p>
  </li>
);

const PipelineVisual = () => {
  const stages = [
    ["Source", "advisory + lockfile"],
    ["Normalize", "exact identities"],
    ["HydraDB", "property graph"],
    ["SSpaths", "incoming traversal"],
    ["Temporal", "interval policy"],
    ["Result", "path evidence"],
  ];
  return (
    <div className="pipeline-visual" aria-label="BlastRadius data and query pipeline">
      {stages.map(([label, detail], index) => (
        <div className={label === "HydraDB" || label === "SSpaths" ? "pipeline-stage pipeline-stage--core" : "pipeline-stage"} key={label}>
          <span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><small>{detail}</small>
        </div>
      ))}
    </div>
  );
};

const ProofNode = ({ icon, label, detail, danger = false }: { icon: ReactNode; label: string; detail: string; danger?: boolean }) => (
  <div className={danger ? "proof-node proof-node--danger" : "proof-node"}>
    {icon}<span><strong>{label}</strong><small>{detail}</small></span>
  </div>
);

const ProofEdge = () => <span className="proof-edge"><code>DEPENDS_ON</code><ArrowRight size={16} /></span>;
