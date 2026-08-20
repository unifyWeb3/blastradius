/* Blast-radius canvas. Node placement reproduces src/client/graph-layout.tsx:
   application roots pin left, the compromised version pins right, intermediate
   hops distribute evenly, one row per candidate path, shared nodes average. */
const NODE_W = 190;
const NODE_H = 56;
const GRAPH_WIDTH = 620;
const ROW_GAP = 150;
const PAD = 26;

function buildLayout(analysis, selectedPath) {
  const positions = new Map();
  const paths = analysis.candidateRoots.map((c) => c.paths[0]);
  paths.forEach((path, rowIndex) => {
    path.nodes.forEach((n, i) => {
      const x =
        n.kind === "application"
          ? 20
          : i === path.nodes.length - 1
            ? GRAPH_WIDTH
            : Math.round((GRAPH_WIDTH * i) / (path.nodes.length - 1));
      const y = 72 + rowIndex * ROW_GAP;
      positions.set(n.entityId, [...(positions.get(n.entityId) || []), { x, y }]);
    });
  });

  const selectedNodes = new Set((selectedPath?.nodes || []).map((n) => n.entityId));
  const selectedEdges = new Set((selectedPath?.relationships || []).map((e) => e.edgeId));
  const status = new Map(analysis.candidateRoots.map((c) => [c.application.entityId, c.status]));

  const placed = analysis.graph.nodes.map((n) => {
    const samples = positions.get(n.entityId) || [{ x: GRAPH_WIDTH, y: 160 }];
    return {
      node: n,
      x: Math.round(samples.reduce((s, p) => s + p.x, 0) / samples.length),
      y: Math.round(samples.reduce((s, p) => s + p.y, 0) / samples.length),
      compromised: n.entityId === analysis.compromisedVersion.entityId,
      status: status.get(n.entityId),
      selected: selectedNodes.has(n.entityId),
      onPath: selectedNodes.has(n.entityId),
    };
  });

  const byId = new Map(placed.map((p) => [p.node.entityId, p]));
  const edges = analysis.graph.relationships.map((r) => {
    const s = byId.get(r.sourceEntityId);
    const t = byId.get(r.targetEntityId);
    return {
      id: r.edgeId,
      selected: selectedEdges.has(r.edgeId),
      x1: s.x + NODE_W,
      y1: s.y + NODE_H / 2,
      x2: t.x,
      y2: t.y + NODE_H / 2,
    };
  });

  const minX = Math.min(...placed.map((p) => p.x)) - PAD;
  const minY = Math.min(...placed.map((p) => p.y)) - PAD;
  const maxX = Math.max(...placed.map((p) => p.x)) + NODE_W + PAD;
  const maxY = Math.max(...placed.map((p) => p.y)) + NODE_H + PAD;
  return { placed, edges, minX, minY, width: maxX - minX, height: maxY - minY };
}

function GraphCanvas({ analysis, selectedPath, onSelectApplication, height }) {
  const { GraphNode } = window.BlastRadiusDesignSystem_6e5e22;
  const wrapRef = React.useRef(null);
  const [box, setBox] = React.useState({ w: 860, h: 426 });
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const drag = React.useRef(null);

  React.useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = React.useMemo(() => buildLayout(analysis, selectedPath), [analysis, selectedPath]);
  const fit = Math.max(0.6, Math.min(1.1, (box.w - 16) / layout.width, (box.h - 16) / layout.height));
  const scale = fit * zoom;
  const offsetX = (box.w - layout.width * scale) / 2 + pan.x;
  const offsetY = (box.h - layout.height * scale) / 2 + pan.y;

  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onMove = (e) => {
    if (!drag.current) return;
    setPan({ x: drag.current.px + (e.clientX - drag.current.x), y: drag.current.py + (e.clientY - drag.current.y) });
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <div
      ref={wrapRef}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      style={{
        position: "relative",
        height: height || "var(--graph-canvas-height)",
        overflow: "hidden",
        background: "var(--graph-canvas)",
        backgroundImage: "radial-gradient(var(--graph-grid) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        cursor: drag.current ? "grabbing" : "grab",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: layout.width,
          height: layout.height,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <svg
          width={layout.width}
          height={layout.height}
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
        >
          <defs>
            <marker id="br-arrow" markerWidth="7" markerHeight="7" refX="6.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="var(--graph-edge)" />
            </marker>
            <marker id="br-arrow-sel" markerWidth="7" markerHeight="7" refX="6.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="var(--graph-edge-selected)" />
            </marker>
          </defs>
          {layout.edges.map((e) => {
            const x1 = e.x1 - layout.minX;
            const y1 = e.y1 - layout.minY;
            const x2 = e.x2 - layout.minX;
            const y2 = e.y2 - layout.minY;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            return (
              <g key={e.id}>
                <path
                  d={`M${x1},${y1} C${x1 + 55},${y1} ${x2 - 55},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke={e.selected ? "var(--graph-edge-selected)" : "var(--graph-edge)"}
                  strokeWidth={e.selected ? 2.5 : 1.5}
                  strokeDasharray={e.selected ? "7 5" : undefined}
                  markerEnd={`url(#${e.selected ? "br-arrow-sel" : "br-arrow"})`}
                  className={e.selected ? "br-flow" : undefined}
                />
                <rect x={mx - 38} y={my - 8} width="76" height="15" rx="3" fill="var(--graph-canvas)" opacity="0.94" />
                <text
                  x={mx}
                  y={my + 3}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="9"
                  fontWeight="600"
                  fill={e.selected ? "var(--red-400)" : "var(--graph-edge-label)"}
                >
                  DEPENDS_ON
                </text>
              </g>
            );
          })}
        </svg>
        {layout.placed.map((p) => (
          <div
            key={p.node.entityId}
            style={{ position: "absolute", left: p.x - layout.minX, top: p.y - layout.minY }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GraphNode
              kind={p.compromised ? "compromised" : p.node.kind === "application" ? "application" : "version"}
              status={p.status}
              name={p.node.name}
              detail={p.node.kind === "application" ? p.node.environment : `v${p.node.version}`}
              selected={p.selected}
              dimmed={!!selectedPath && !p.onPath && !p.compromised}
              clickable={p.node.kind === "application"}
              onSelect={() => p.node.kind === "application" && onSelectApplication(p.node.entityId)}
            />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { icon: "plus", label: "Zoom in", act: () => setZoom((z) => Math.min(2.4, z * 1.2)) },
          { icon: "minus", label: "Zoom out", act: () => setZoom((z) => Math.max(0.4, z / 1.2)) },
          {
            icon: "maximize",
            label: "Fit view",
            act: () => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            },
          },
        ].map((c) => (
          <GraphControl key={c.icon} {...c} />
        ))}
      </div>
    </div>
  );
}

function GraphControl({ icon, label, act }) {
  const { Icon } = window.BlastRadiusDesignSystem_6e5e22;
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={act}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28,
        height: 28,
        display: "grid",
        placeItems: "center",
        background: hover ? "var(--surface-hover)" : "var(--surface-panel)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-sm)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "var(--transition-control)",
      }}
    >
      <Icon name={icon} size={14} strokeWidth={2} />
    </button>
  );
}

Object.assign(window, { GraphCanvas, buildLayout });
