/* @ds-bundle: {"format":4,"namespace":"BlastRadiusDesignSystem_6e5e22","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Field","sourcePath":"components/core/Field.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Kicker","sourcePath":"components/core/Kicker.jsx"},{"name":"Select","sourcePath":"components/core/Select.jsx"},{"name":"ApplicationRow","sourcePath":"components/evidence/ApplicationRow.jsx"},{"name":"ChainNode","sourcePath":"components/evidence/ChainNode.jsx"},{"name":"EvidenceRow","sourcePath":"components/evidence/EvidenceRow.jsx"},{"name":"SummaryMetric","sourcePath":"components/evidence/SummaryMetric.jsx"},{"name":"TimelineRow","sourcePath":"components/evidence/TimelineRow.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"ErrorBanner","sourcePath":"components/feedback/ErrorBanner.jsx"},{"name":"FullScreenState","sourcePath":"components/feedback/FullScreenState.jsx"},{"name":"GraphLegend","sourcePath":"components/graph/GraphLegend.jsx"},{"name":"GraphNode","sourcePath":"components/graph/GraphNode.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"ScopeNote","sourcePath":"components/layout/ScopeNote.jsx"},{"name":"SectionHeading","sourcePath":"components/layout/SectionHeading.jsx"},{"name":"TopBar","sourcePath":"components/layout/TopBar.jsx"},{"name":"CheckResult","sourcePath":"components/status/CheckResult.jsx"},{"name":"SeverityBadge","sourcePath":"components/status/SeverityBadge.jsx"},{"name":"StatusChip","sourcePath":"components/status/StatusChip.jsx"},{"name":"StatusDot","sourcePath":"components/status/StatusDot.jsx"},{"name":"StatusPill","sourcePath":"components/status/StatusPill.jsx"},{"name":"STATUS","sourcePath":"components/status/status-tokens.js"}],"sourceHashes":{"components/core/Button.jsx":"dd45600fb263","components/core/Field.jsx":"990d93135d06","components/core/Icon.jsx":"3af94a171316","components/core/Kicker.jsx":"a8912e381237","components/core/Select.jsx":"10b4856c37ef","components/core/icon-paths.js":"b3c1b45404c5","components/evidence/ApplicationRow.jsx":"7199340ce96f","components/evidence/ChainNode.jsx":"d6de6877c262","components/evidence/EvidenceRow.jsx":"b59965d30ec6","components/evidence/SummaryMetric.jsx":"84b353ba1810","components/evidence/TimelineRow.jsx":"26d26024530e","components/feedback/EmptyState.jsx":"cf8216ae687a","components/feedback/ErrorBanner.jsx":"e1f582eb1b6a","components/feedback/FullScreenState.jsx":"a876e5a0892b","components/graph/GraphLegend.jsx":"963daaef36b0","components/graph/GraphNode.jsx":"03873ea63daf","components/layout/Panel.jsx":"4bb3343f2fa4","components/layout/ScopeNote.jsx":"bab491a7a01e","components/layout/SectionHeading.jsx":"a539161f76fc","components/layout/TopBar.jsx":"4ca3df26bcae","components/status/CheckResult.jsx":"404954a56001","components/status/SeverityBadge.jsx":"75a0342ffb1f","components/status/StatusChip.jsx":"676149bdf822","components/status/StatusDot.jsx":"f1c99d4d31c3","components/status/StatusPill.jsx":"d876307b9183","components/status/status-tokens.js":"9a4aa9a3b759","ui_kits/console/EvidencePanels.jsx":"6315038ccda8","ui_kits/console/GraphCanvas.jsx":"9a76883dfb40","ui_kits/console/IncidentSidebar.jsx":"5c47bc5daa9d","ui_kits/console/Workspace.jsx":"7a2c8e923443","ui_kits/console/fixture.js":"03215703bbc3"},"inlinedExternals":[],"unexposedExports":[{"name":"iconNames","sourcePath":"components/core/Icon.jsx"},{"name":"iconPaths","sourcePath":"components/core/icon-paths.js"},{"name":"statusOf","sourcePath":"components/status/status-tokens.js"}]} */

(() => {

const __ds_ns = (window.BlastRadiusDesignSystem_6e5e22 = window.BlastRadiusDesignSystem_6e5e22 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Kicker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Uppercase eyebrow used above every heading, metric and field in the console. */
function Kicker({
  children,
  tone = "muted",
  as = "span",
  style,
  ...rest
}) {
  const Tag = as;
  const color = tone === "danger" ? "var(--status-compromised)" : tone === "primary" ? "var(--text-secondary)" : "var(--text-muted)";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--type-label-size)",
      lineHeight: "var(--type-label-line)",
      fontWeight: "var(--type-label-weight)",
      letterSpacing: "var(--type-label-tracking)",
      textTransform: "uppercase",
      color,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Kicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Kicker.jsx", error: String((e && e.message) || e) }); }

// components/core/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled console input. Used for the UTC exposure-window fields; `mono` is on by default because every value in this app is machine-shaped. */
function Field({
  label,
  hint,
  invalid = false,
  mono = true,
  inputProps = {},
  style,
  children,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: "block",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Kicker, {
    style: {
      marginBottom: 6
    }
  }, label), children || /*#__PURE__*/React.createElement("input", _extends({}, inputProps, {
    onFocus: e => {
      setFocus(true);
      inputProps.onFocus && inputProps.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      inputProps.onBlur && inputProps.onBlur(e);
    },
    style: {
      width: "100%",
      height: "var(--control-height)",
      padding: "0 10px",
      color: "var(--text-primary)",
      background: "var(--surface-input)",
      border: `1px solid ${invalid ? "var(--status-error)" : focus ? "var(--focus-ring)" : "var(--border-input)"}`,
      borderRadius: "var(--radius-sm)",
      fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
      fontSize: 12,
      letterSpacing: mono ? "-0.01em" : 0,
      outline: "none",
      transition: "var(--transition-control)",
      colorScheme: "dark",
      ...inputProps.style
    }
  })), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 5,
      fontFamily: "var(--font-sans)",
      fontSize: 10,
      color: invalid ? "var(--status-error)" : "var(--text-muted)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Field.jsx", error: String((e && e.message) || e) }); }

// components/core/icon-paths.js
try { (() => {
const iconPaths = {
  "arrow-right": "<path d=\"M5 12h14\"></path> <path d=\"m12 5 7 7-7 7\"></path>",
  "arrow-up-right": "<path d=\"M7 7h10v10\"></path> <path d=\"M7 17 17 7\"></path>",
  "box": "<path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\"></path> <path d=\"m3.3 7 8.7 5 8.7-5\"></path> <path d=\"M12 22V12\"></path>",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\"></path>",
  "circle-check-big": "<path d=\"M21.801 10A10 10 0 1 1 17 3.335\"></path> <path d=\"m9 11 3 3L22 4\"></path>",
  "circle-dashed": "<path d=\"M10.1 2.182a10 10 0 0 1 3.8 0\"></path> <path d=\"M13.9 21.818a10 10 0 0 1-3.8 0\"></path> <path d=\"M17.609 3.721a10 10 0 0 1 2.69 2.7\"></path> <path d=\"M2.182 13.9a10 10 0 0 1 0-3.8\"></path> <path d=\"M20.279 17.609a10 10 0 0 1-2.7 2.69\"></path> <path d=\"M21.818 10.1a10 10 0 0 1 0 3.8\"></path> <path d=\"M3.721 6.391a10 10 0 0 1 2.7-2.69\"></path> <path d=\"M6.391 20.279a10 10 0 0 1-2.69-2.7\"></path>",
  "circle-question-mark": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path> <path d=\"M12 17h.01\"></path>",
  "circle-slash-2": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M22 2 2 22\"></path>",
  "clock-3": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M12 6v6h4\"></path>",
  "database": "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"></ellipse> <path d=\"M3 5V19A9 3 0 0 0 21 19V5\"></path> <path d=\"M3 12A9 3 0 0 0 21 12\"></path>",
  "external-link": "<path d=\"M15 3h6v6\"></path> <path d=\"M10 14 21 3\"></path> <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path>",
  "file-check": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"></path> <path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path> <path d=\"m9 15 2 2 4-4\"></path>",
  "git-branch": "<path d=\"M15 6a9 9 0 0 0-9 9V3\"></path> <circle cx=\"18\" cy=\"6\" r=\"3\"></circle> <circle cx=\"6\" cy=\"18\" r=\"3\"></circle>",
  "loader-circle": "<path d=\"M21 12a9 9 0 1 1-6.219-8.56\"></path>",
  "maximize": "<path d=\"M8 3H5a2 2 0 0 0-2 2v3\"></path> <path d=\"M21 8V5a2 2 0 0 0-2-2h-3\"></path> <path d=\"M3 16v3a2 2 0 0 0 2 2h3\"></path> <path d=\"M16 21h3a2 2 0 0 0 2-2v-3\"></path>",
  "minus": "<path d=\"M5 12h14\"></path>",
  "package": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"></path> <path d=\"M12 22V12\"></path> <polyline points=\"3.29 7 12 12 20.71 7\"></polyline> <path d=\"m7.5 4.27 9 5.15\"></path>",
  "plus": "<path d=\"M5 12h14\"></path> <path d=\"M12 5v14\"></path>",
  "radar": "<path d=\"M19.07 4.93A10 10 0 0 0 6.99 3.34\"></path> <path d=\"M4 6h.01\"></path> <path d=\"M2.29 9.62A10 10 0 1 0 21.31 8.35\"></path> <path d=\"M16.24 7.76A6 6 0 1 0 8.23 16.67\"></path> <path d=\"M12 18h.01\"></path> <path d=\"M17.99 11.66A6 6 0 0 1 15.77 16.67\"></path> <circle cx=\"12\" cy=\"12\" r=\"2\"></circle> <path d=\"m13.41 10.59 5.66-5.66\"></path>",
  "refresh-cw": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path> <path d=\"M21 3v5h-5\"></path> <path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path> <path d=\"M8 16H3v5\"></path>",
  "scan-search": "<path d=\"M3 7V5a2 2 0 0 1 2-2h2\"></path> <path d=\"M17 3h2a2 2 0 0 1 2 2v2\"></path> <path d=\"M21 17v2a2 2 0 0 1-2 2h-2\"></path> <path d=\"M7 21H5a2 2 0 0 1-2-2v-2\"></path> <circle cx=\"12\" cy=\"12\" r=\"3\"></circle> <path d=\"m16 16-1.9-1.9\"></path>",
  "search-check": "<path d=\"m8 11 2 2 4-4\"></path> <circle cx=\"11\" cy=\"11\" r=\"8\"></circle> <path d=\"m21 21-4.3-4.3\"></path>",
  "shield-alert": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"></path> <path d=\"M12 8v4\"></path> <path d=\"M12 16h.01\"></path>",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"></path> <path d=\"M12 9v4\"></path> <path d=\"M12 17h.01\"></path>",
  "waypoints": "<path d=\"m10.586 5.414-5.172 5.172\"></path> <path d=\"m18.586 13.414-5.172 5.172\"></path> <path d=\"M6 12h12\"></path> <circle cx=\"12\" cy=\"20\" r=\"2\"></circle> <circle cx=\"12\" cy=\"4\" r=\"2\"></circle> <circle cx=\"20\" cy=\"12\" r=\"2\"></circle> <circle cx=\"4\" cy=\"12\" r=\"2\"></circle>",
  "x": "<path d=\"M18 6 6 18\"></path> <path d=\"m6 6 12 12\"></path>"
};
Object.assign(__ds_scope, { iconPaths });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/icon-paths.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BlastRadius glyph. Renders Lucide geometry (copied from lucide-icons/lucide)
 * inline so it inherits `currentColor` and scales crisply at 9-28px.
 */
function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  title,
  style,
  className,
  ...rest
}) {
  const body = __ds_scope.iconPaths[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? "img" : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : "true",
    focusable: "false",
    className: className,
    style: {
      flex: "none",
      display: "block",
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: body || ""
    }
  }, rest));
}
const iconNames = Object.keys(__ds_scope.iconPaths);
Object.assign(__ds_scope, { Icon, iconNames });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  primary: {
    background: "var(--action-primary-bg)",
    color: "var(--action-primary-fg)",
    border: "1px solid transparent",
    hover: "var(--action-primary-bg-hover)"
  },
  secondary: {
    background: "var(--teal-900)",
    color: "var(--teal-300)",
    border: "1px solid var(--teal-700)",
    hover: "#123B33"
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-default)",
    hover: "var(--surface-hover)"
  },
  quiet: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid transparent",
    hover: "var(--surface-hover)"
  }
};
const SIZES = {
  sm: {
    height: 30,
    padding: "0 10px",
    fontSize: 11,
    gap: 6,
    icon: 14
  },
  md: {
    height: 38,
    padding: "0 14px",
    fontSize: 13,
    gap: 8,
    icon: 16
  }
};

/** Primary console action. `loading` swaps the leading glyph for a spinner and disables the control. */
function Button({
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  loading = false,
  disabled = false,
  block = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const off = disabled || loading;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: off,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: block ? "100%" : undefined,
      minHeight: s.height,
      padding: s.padding,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      fontFamily: "var(--font-sans)",
      fontSize: s.fontSize,
      fontWeight: 600,
      letterSpacing: "-0.005em",
      lineHeight: 1,
      borderRadius: "var(--radius-sm)",
      border: v.border,
      background: off ? v.background : hover ? v.hover : v.background,
      color: v.color,
      opacity: off ? 0.45 : 1,
      cursor: off ? "not-allowed" : "pointer",
      transition: "var(--transition-control)",
      ...style
    }
  }, rest), loading ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "loader-circle",
    size: s.icon,
    className: "br-spin"
  }) : icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }) : null, children, trailingIcon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: trailingIcon,
    size: s.icon
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Console dropdown. Only used for the application-check selector, which is populated from the incident catalog. */
function Select({
  options = [],
  value,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      height: "var(--control-height)",
      padding: "0 32px 0 10px",
      color: "var(--text-primary)",
      background: "var(--surface-input)",
      border: `1px solid ${focus ? "var(--focus-ring)" : "var(--border-input)"}`,
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      appearance: "none",
      WebkitAppearance: "none",
      outline: "none",
      opacity: disabled ? 0.45 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "var(--transition-control)"
    }
  }, rest), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value,
    style: {
      background: "var(--surface-raised)"
    }
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 14,
    style: {
      position: "absolute",
      right: 10,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--text-muted)",
      pointerEvents: "none"
    }
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Select.jsx", error: String((e && e.message) || e) }); }

// components/evidence/ChainNode.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** One node in the ordered application → dependency → compromised-version chain. */
function ChainNode({
  name,
  detail,
  role = "dependency",
  index,
  style,
  ...rest
}) {
  const compromised = role === "compromised";
  const application = role === "application";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "var(--chain-node-width)",
      flex: "none",
      padding: "10px 10px 9px",
      background: compromised ? "var(--red-800)" : "var(--surface-raised)",
      border: `1px solid ${compromised ? "var(--red-600)" : "var(--border-default)"}`,
      borderLeft: application ? "var(--border-rail) solid var(--teal-600)" : undefined,
      borderRadius: "var(--radius-md)",
      boxShadow: compromised ? "var(--shadow-node)" : "none",
      ...style
    }
  }, rest), index !== undefined ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginBottom: 5,
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      fontWeight: 500,
      letterSpacing: "0.04em",
      color: compromised ? "var(--red-300)" : "var(--text-faint)"
    }
  }, String(index).padStart(2, "0")) : null, /*#__PURE__*/React.createElement("strong", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.005em",
      color: compromised ? "#fff" : "var(--text-primary)",
      overflowWrap: "anywhere"
    }
  }, name), detail ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 5,
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
      color: compromised ? "var(--red-300)" : "var(--text-faint)",
      overflowWrap: "anywhere"
    }
  }, detail) : null);
}
Object.assign(__ds_scope, { ChainNode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/ChainNode.jsx", error: String((e && e.message) || e) }); }

// components/evidence/EvidenceRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * One `DEPENDS_ON` relationship rendered as evidence. A null validity interval is
 * itself evidence — it is called out in steel, never silently omitted.
 */
function EvidenceRow({
  relationshipType = "DEPENDS_ON",
  evidence,
  interval,
  style,
  ...rest
}) {
  const unresolved = !interval;
  return /*#__PURE__*/React.createElement("article", _extends({
    style: {
      padding: "11px 2px 12px",
      display: "grid",
      gridTemplateColumns: "18px minmax(0, 1fr)",
      gap: 9,
      borderBottom: "1px solid var(--border-subtle)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: unresolved ? "circle-question-mark" : "file-check",
    size: 16,
    style: {
      color: unresolved ? "var(--status-unresolved)" : "var(--teal-500)",
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      display: "block",
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: "0.06em",
      color: "var(--text-secondary)"
    }
  }, relationshipType), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "5px 0 0",
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      lineHeight: 1.5,
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      overflowWrap: "anywhere"
    }
  }, evidence), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      marginTop: 6,
      padding: unresolved ? "2px 6px" : 0,
      background: unresolved ? "var(--status-unresolved-bg)" : "transparent",
      backgroundImage: unresolved ? "var(--status-unresolved-hatch)" : undefined,
      border: unresolved ? "1px solid var(--status-unresolved-border)" : "none",
      borderRadius: "var(--radius-xs)",
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      letterSpacing: "-0.005em",
      color: unresolved ? "var(--status-unresolved)" : "var(--text-muted)"
    }
  }, unresolved ? "validWindow: null — temporal evaluation unresolved" : interval)));
}
Object.assign(__ds_scope, { EvidenceRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/EvidenceRow.jsx", error: String((e && e.message) || e) }); }

// components/evidence/SummaryMetric.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** One reading in the analysis summary band. Values are tabular; an em dash means "not queried yet", never zero. */
function SummaryMetric({
  label,
  value = "—",
  unit,
  tone = "default",
  hint,
  divider = true,
  style,
  ...rest
}) {
  const color = tone === "danger" ? "var(--status-exposed)" : tone === "healthy" ? "var(--status-healthy)" : "var(--text-primary)";
  const pending = value === "—" || value === null || value === undefined;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: "16px 18px",
      minWidth: 0,
      borderRight: divider ? "1px solid var(--border-subtle)" : "none",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--type-label-size)",
      fontWeight: 700,
      letterSpacing: "var(--type-label-tracking)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("strong", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 5,
      marginTop: 8,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--type-metric-size)",
      fontWeight: 600,
      letterSpacing: "var(--type-metric-tracking)",
      lineHeight: "var(--type-metric-line)",
      fontFeatureSettings: 'var(--numeric-tabular)',
      color: pending ? "var(--text-faint)" : color,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, value, unit && !pending ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: "var(--text-muted)",
      letterSpacing: 0
    }
  }, unit) : null), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 5,
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "-0.01em",
      color: "var(--text-faint)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { SummaryMetric });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/SummaryMetric.jsx", error: String((e && e.message) || e) }); }

// components/evidence/TimelineRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  compromise: "var(--timeline-compromise)",
  dependency: "var(--timeline-dependency)",
  effective: "var(--timeline-effective)",
  unresolved: "var(--timeline-unresolved)"
};

/**
 * One interval bar on the UTC exposure timeline. `tone="unresolved"` renders a hatched,
 * open-ended band for a dependency edge with no validity interval — it must not be drawn
 * as a measured bar.
 */
function TimelineRow({
  label,
  left = 0,
  width = 100,
  tone = "dependency",
  title,
  style,
  ...rest
}) {
  const unresolved = tone === "unresolved";
  const color = TONES[tone] || TONES.dependency;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      minHeight: 30,
      display: "grid",
      gridTemplateColumns: "var(--timeline-label-width) minmax(0, 1fr)",
      gap: 8,
      alignItems: "center",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: "0.02em",
      color: unresolved ? "var(--status-unresolved)" : "var(--text-secondary)",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 8,
      background: "var(--timeline-track)",
      borderRadius: "var(--radius-xs)",
      boxShadow: "var(--shadow-inset-track)"
    }
  }, unresolved ? /*#__PURE__*/React.createElement("div", {
    title: title,
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "var(--radius-xs)",
      border: `1px dashed ${color}`,
      backgroundImage: "var(--status-unresolved-hatch)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    title: title,
    style: {
      position: "absolute",
      top: 0,
      height: 8,
      left: `${left}%`,
      width: `${Math.min(Math.max(width, 1.5), 100 - left)}%`,
      minWidth: 4,
      background: color,
      borderRadius: "var(--radius-xs)",
      boxShadow: tone === "effective" ? "0 0 0 2px rgba(47, 184, 155, 0.16)" : "none"
    }
  })));
}
Object.assign(__ds_scope, { TimelineRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/TimelineRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * In-panel empty or loading state. `Analysis pending` before a query and
 * `Querying HydraDB` while one is in flight — the two must stay distinguishable.
 */
function EmptyState({
  icon = "radar",
  label,
  sublabel,
  busy = false,
  height = "var(--graph-canvas-height)",
  grid = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height,
      display: "grid",
      placeContent: "center",
      justifyItems: "center",
      gap: 9,
      background: "var(--graph-canvas)",
      backgroundImage: grid ? "radial-gradient(var(--graph-grid) 1px, transparent 1px)" : undefined,
      backgroundSize: grid ? "18px 18px" : undefined,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: busy ? "loader-circle" : icon,
    size: 28,
    className: busy ? "br-spin" : undefined,
    style: {
      color: busy ? "var(--teal-500)" : "var(--text-faint)"
    }
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "-0.005em",
      color: "var(--text-secondary)"
    }
  }, label), sublabel ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.02em",
      color: "var(--text-faint)"
    }
  }, sublabel) : null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ErrorBanner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Dismissible API/HydraDB failure alert. Carries the API's stable message verbatim. */
function ErrorBanner({
  message,
  onDismiss,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "alert",
    style: {
      minHeight: 42,
      padding: "9px 10px 9px 12px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "var(--status-error)",
      background: "var(--status-error-bg)",
      border: "1px solid var(--status-error-border)",
      borderLeft: "var(--border-rail) solid var(--status-error)",
      borderRadius: "var(--radius-sm)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "triangle-alert",
    size: 17
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      lineHeight: 1.4,
      color: "var(--text-primary)"
    }
  }, message), onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss error",
    title: "Dismiss",
    onClick: onDismiss,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 26,
      height: 26,
      display: "grid",
      placeItems: "center",
      flex: "none",
      border: "1px solid transparent",
      borderColor: hover ? "var(--status-error-border)" : "transparent",
      borderRadius: "var(--radius-sm)",
      background: "transparent",
      color: "var(--status-error)",
      cursor: "pointer",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14,
    strokeWidth: 2
  })) : null);
}
Object.assign(__ds_scope, { ErrorBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ErrorBanner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/FullScreenState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Whole-viewport state: initial incident load, and incident-unavailable failure. */
function FullScreenState({
  icon = "loader-circle",
  label,
  detail,
  tone = "default",
  busy = false,
  style,
  ...rest
}) {
  const color = tone === "danger" ? "var(--status-error)" : "var(--teal-500)";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      minHeight: "100vh",
      display: "grid",
      placeContent: "center",
      justifyItems: "center",
      gap: 12,
      padding: 24,
      textAlign: "center",
      background: "var(--bg-app)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26,
    className: busy ? "br-spin" : undefined,
    style: {
      color
    }
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      maxWidth: 460
    }
  }, label), detail ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      letterSpacing: "-0.005em",
      color: "var(--text-muted)",
      maxWidth: 460
    }
  }, detail) : null);
}
Object.assign(__ds_scope, { FullScreenState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/FullScreenState.jsx", error: String((e && e.message) || e) }); }

// components/graph/GraphLegend.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KEYS = [{
  id: "compromised",
  label: "Compromised version",
  swatch: "solid",
  color: "var(--red-700)",
  border: "var(--red-500)"
}, {
  id: "exposed",
  label: "Exposed application",
  swatch: "rail",
  color: "var(--status-exposed)"
}, {
  id: "not_exposed",
  label: "Outside window",
  swatch: "rail",
  color: "var(--status-outside-window)"
}, {
  id: "unresolved",
  label: "Unresolved",
  swatch: "hatch",
  color: "var(--status-unresolved)"
}, {
  id: "dependency",
  label: "Intermediate dependency",
  swatch: "node",
  color: "var(--graph-node-inert)"
}, {
  id: "selected",
  label: "Selected path",
  swatch: "edge-selected",
  color: "var(--graph-edge-selected)"
}, {
  id: "edge",
  label: "DEPENDS_ON",
  swatch: "edge",
  color: "var(--graph-edge)"
}];
const Swatch = ({
  swatch,
  color,
  border
}) => {
  const base = {
    width: 18,
    height: 12,
    flex: "none",
    borderRadius: 2
  };
  if (swatch === "solid") return /*#__PURE__*/React.createElement("span", {
    style: {
      ...base,
      background: color,
      border: `1px solid ${border || color}`
    }
  });
  if (swatch === "rail") return /*#__PURE__*/React.createElement("span", {
    style: {
      ...base,
      background: "var(--graph-node-surface)",
      border: "1px solid var(--graph-node-border)",
      borderLeft: `3px solid ${color}`
    }
  });
  if (swatch === "hatch") return /*#__PURE__*/React.createElement("span", {
    style: {
      ...base,
      background: "var(--status-unresolved-bg)",
      backgroundImage: "var(--status-unresolved-hatch)",
      border: `1px dashed ${color}`
    }
  });
  if (swatch === "node") return /*#__PURE__*/React.createElement("span", {
    style: {
      ...base,
      background: "var(--graph-node-surface)",
      border: "1px solid var(--graph-node-border)"
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...base,
      height: 12,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: swatch === "edge-selected" ? 2.5 : 1.5,
      background: color,
      borderRadius: 2,
      backgroundImage: swatch === "edge-selected" ? `repeating-linear-gradient(90deg, ${color} 0 5px, transparent 5px 8px)` : undefined
    }
  }));
};

/** Legend for the graph's visual semantics. Present the keys the current result actually contains. */
function GraphLegend({
  keys,
  direction = "row",
  style,
  ...rest
}) {
  const shown = keys ? KEYS.filter(k => keys.includes(k.id)) : KEYS;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: direction,
      flexWrap: "wrap",
      gap: direction === "row" ? "8px 16px" : 8,
      alignItems: direction === "row" ? "center" : "flex-start",
      ...style
    }
  }, rest), shown.map(k => /*#__PURE__*/React.createElement("span", {
    key: k.id,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Swatch, {
    swatch: k.swatch,
    color: k.color,
    border: k.border
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      whiteSpace: "nowrap"
    }
  }, k.label))));
}
Object.assign(__ds_scope, { GraphLegend });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graph/GraphLegend.jsx", error: String((e && e.message) || e) }); }

// components/layout/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A structural region of the workspace: hairline chassis, optional 64px toolbar, no radius. */
function Panel({
  kicker,
  title,
  meta,
  actions,
  padded = false,
  toolbar = true,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-panel)",
      ...style
    }
  }, rest), toolbar && (kicker || title || meta || actions) ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--panel-toolbar-height)",
      padding: "0 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--gr-925)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, kicker ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginBottom: 4,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--type-label-size)",
      fontWeight: 700,
      letterSpacing: "var(--type-label-tracking)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, kicker) : null, title ? /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, title) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flex: "none"
    }
  }, meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "-0.01em",
      color: "var(--text-muted)"
    }
  }, meta) : null, actions)) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1,
      padding: padded ? "var(--pad-panel)" : 0
    }
  }, children));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Panel.jsx", error: String((e && e.message) || e) }); }

// components/layout/ScopeNote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Provenance footnote. Pinned to the bottom of the sidebar — the product's data limitation is always on screen. */
function ScopeNote({
  icon = "git-branch",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      marginTop: "auto",
      padding: "14px 20px",
      display: "flex",
      gap: 8,
      alignItems: "center",
      borderTop: "1px solid var(--border-subtle)",
      color: "var(--text-faint)",
      fontFamily: "var(--font-sans)",
      fontSize: 10,
      letterSpacing: "0.01em",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { ScopeNote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/ScopeNote.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Heading for an evidence region or a sidebar block: kicker, title, and a right-hand verdict or value. */
function SectionHeading({
  kicker,
  title,
  icon,
  right,
  align = "start",
  level = 2,
  style,
  ...rest
}) {
  const Tag = `h${level}`;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: align === "center" ? "center" : "flex-start",
      justifyContent: "space-between",
      gap: 14,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    style: {
      color: "var(--text-muted)"
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, kicker ? /*#__PURE__*/React.createElement(__ds_scope.Kicker, {
    style: {
      marginBottom: 3
    }
  }, kicker) : null, /*#__PURE__*/React.createElement(Tag, {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: kicker ? "var(--type-section-size)" : "var(--type-subsection-size)",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "var(--text-primary)",
      overflowWrap: "anywhere"
    }
  }, title))), right ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none"
    }
  }, right) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/layout/TopBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The console chrome: brand identity on the left, live engine attribution on the right. */
function TopBar({
  product = "BlastRadius",
  descriptor = "Supply-chain incident analysis",
  engine = "HydraDB",
  traversal = "incoming SSpaths",
  compact = false,
  right,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      height: "var(--topbar-height)",
      padding: compact ? "0 12px" : "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      background: "var(--surface-chrome)",
      borderBottom: "1px solid var(--border-subtle)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      display: "grid",
      placeItems: "center",
      color: "#fff",
      background: "var(--red-700)",
      borderRadius: "var(--radius-sm)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "shield-alert",
    size: 18
  })), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: "-0.02em",
      color: "var(--text-primary)"
    }
  }, product), !compact && descriptor ? /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 11,
      marginLeft: 1,
      borderLeft: "1px solid var(--border-default)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--text-muted)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, descriptor) : null), right !== undefined ? right : compact ? null : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 10px",
      background: "var(--gr-950)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "database",
    size: 14,
    style: {
      color: "var(--teal-500)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      color: "var(--text-muted)"
    }
  }, engine), /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 11,
      fontWeight: 500,
      color: "var(--teal-300)",
      letterSpacing: "-0.01em"
    }
  }, traversal)));
}
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/TopBar.jsx", error: String((e && e.message) || e) }); }

// components/status/SeverityBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Advisory severity. The product only ever emits `critical`; the other levels exist so the badge does not lie if the catalog widens. */
function SeverityBadge({
  severity = "critical",
  style,
  ...rest
}) {
  const tone = severity === "critical" ? {
    bg: "var(--red-700)",
    fg: "#FFFFFF"
  } : severity === "high" ? {
    bg: "var(--amber-700)",
    fg: "#FFFFFF"
  } : {
    bg: "var(--gr-700)",
    fg: "var(--gr-100)"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 7px",
      color: tone.fg,
      background: tone.bg,
      borderRadius: "var(--radius-xs)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--type-label-size)",
      fontWeight: 700,
      letterSpacing: "var(--type-label-tracking)",
      textTransform: "uppercase",
      lineHeight: 1,
      ...style
    }
  }, rest), severity);
}
Object.assign(__ds_scope, { SeverityBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/SeverityBadge.jsx", error: String((e && e.message) || e) }); }

// components/status/StatusDot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  active: "var(--status-compromised)",
  healthy: "var(--status-healthy)",
  unresolved: "var(--status-unresolved)",
  idle: "var(--text-faint)"
};

/** Live-state indicator — the incident's catalog status in the sidebar, and the HydraDB runtime state in the top bar. */
function StatusDot({
  tone = "active",
  label,
  pulse = true,
  style,
  ...rest
}) {
  const color = TONES[tone] || TONES.idle;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      color: "var(--text-muted)",
      fontFamily: "var(--font-sans)",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "var(--type-label-tracking)",
      textTransform: "uppercase",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: pulse ? "br-pulse" : undefined,
    style: {
      width: 7,
      height: 7,
      borderRadius: "var(--radius-pill)",
      background: color,
      boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 18%, transparent)`
    }
  }), label);
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/status/status-tokens.js
try { (() => {
/** Domain status vocabulary. One meaning per entry — never collapse two of these. */
const STATUS = {
  exposed: {
    key: "exposed",
    label: "Exposed in window",
    short: "Exposed",
    row: "active exposure",
    icon: "shield-alert",
    fg: "var(--status-exposed)",
    bg: "var(--status-exposed-bg)",
    border: "var(--status-exposed-border)",
    hatch: "none"
  },
  not_exposed: {
    key: "not_exposed",
    label: "Outside window",
    short: "Not exposed in window",
    row: "outside window",
    icon: "circle-check-big",
    fg: "var(--status-outside-window)",
    bg: "var(--status-outside-window-bg)",
    border: "var(--status-outside-window-border)",
    hatch: "none"
  },
  unresolved: {
    key: "unresolved",
    label: "Temporal evidence incomplete",
    short: "Temporal result unresolved",
    row: "validity missing",
    icon: "circle-question-mark",
    fg: "var(--status-unresolved)",
    bg: "var(--status-unresolved-bg)",
    border: "var(--status-unresolved-border)",
    hatch: "var(--status-unresolved-hatch)"
  },
  no_path: {
    key: "no_path",
    label: "No supporting path",
    short: "Not exposed",
    row: "no supporting path",
    icon: "circle-slash-2",
    fg: "var(--status-healthy)",
    bg: "var(--status-healthy-bg)",
    border: "var(--status-healthy-border)",
    hatch: "none"
  },
  compromised: {
    key: "compromised",
    label: "Compromised",
    short: "Compromised",
    row: "compromised version",
    icon: "shield-alert",
    fg: "var(--status-compromised)",
    bg: "var(--status-compromised-bg)",
    border: "var(--status-compromised-border)",
    hatch: "none"
  },
  neutral: {
    key: "neutral",
    label: "Neutral",
    short: "Neutral",
    row: "",
    icon: "package",
    fg: "var(--status-neutral)",
    bg: "var(--status-neutral-bg)",
    border: "var(--status-neutral-border)",
    hatch: "none"
  }
};
const statusOf = key => STATUS[key] || STATUS.neutral;
Object.assign(__ds_scope, { STATUS, statusOf });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/status-tokens.js", error: String((e && e.message) || e) }); }

// components/graph/GraphNode.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * A node on the blast-radius canvas. Read-only by contract: no drag, no connect, no edit.
 * Hierarchy is compromised > affected application > intermediate dependency > unrelated.
 */
function GraphNode({
  name,
  detail,
  kind = "version",
  status,
  selected = false,
  dimmed = false,
  clickable = false,
  onSelect,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const compromised = kind === "compromised";
  const application = kind === "application";
  const s = status ? __ds_scope.statusOf(status) : null;
  const icon = compromised ? "shield-alert" : application ? "box" : "package";
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: clickable ? onSelect : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    role: clickable ? "button" : undefined,
    tabIndex: clickable ? 0 : undefined,
    style: {
      width: "var(--graph-node-width)",
      minHeight: 56,
      padding: "10px 11px",
      textAlign: "left",
      background: compromised ? "var(--red-800)" : "var(--graph-node-surface)",
      border: `1px solid ${compromised ? "var(--red-500)" : hover && clickable ? "var(--border-strong)" : "var(--graph-node-border)"}`,
      borderLeft: application && s ? `var(--border-node-rail) solid ${s.fg}` : undefined,
      borderRadius: "var(--radius-md)",
      boxShadow: selected ? "var(--ring-selected), var(--shadow-node)" : "var(--shadow-node)",
      opacity: dimmed ? 0.42 : 1,
      cursor: clickable ? "pointer" : "default",
      transition: "var(--transition-surface), opacity var(--duration-base) var(--ease-standard)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16,
    style: {
      marginTop: 1,
      color: compromised ? "var(--red-300)" : application && s ? s.fg : "var(--graph-node-inert)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.008em",
      color: compromised ? "#fff" : "var(--graph-node-label)",
      overflowWrap: "anywhere"
    }
  }, name), detail ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      letterSpacing: "0.01em",
      color: compromised ? "var(--red-300)" : "var(--graph-node-meta)",
      overflowWrap: "anywhere"
    }
  }, detail) : null)));
}
Object.assign(__ds_scope, { GraphNode });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graph/GraphNode.jsx", error: String((e && e.message) || e) }); }

// components/status/CheckResult.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const OUTCOMES = {
  supporting_dependency_path: {
    key: "exposed",
    title: "Exposed",
    body: n => `${n} hop dependency path`
  },
  no_common_overlap: {
    key: "not_exposed",
    title: "Not exposed in window",
    body: () => "Path has no common temporal overlap."
  },
  no_supporting_dependency_path: {
    key: "no_path",
    title: "Not exposed",
    body: () => "No supporting dependency path found."
  },
  missing_dependency_validity: {
    key: "unresolved",
    title: "Temporal result unresolved",
    body: () => "A dependency edge on the supporting path has no validity interval. Exposure can be neither confirmed nor ruled out."
  }
};

/**
 * Renders one `ExposureCheckDto` outcome. The four reasons are visually distinct by
 * contract — `missing_dependency_validity` must never reuse the outside-window treatment.
 */
function CheckResult({
  reason,
  hopCount = 0,
  showReasonCode = true,
  style,
  ...rest
}) {
  const outcome = OUTCOMES[reason] || OUTCOMES.no_supporting_dependency_path;
  const s = __ds_scope.statusOf(outcome.key);
  const uncertain = outcome.key === "unresolved";
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      gap: 9,
      alignItems: "flex-start",
      padding: "11px 12px",
      background: s.bg,
      backgroundImage: uncertain ? s.hatch : undefined,
      borderLeft: `var(--border-rail) solid ${s.fg}`,
      border: `1px solid ${s.border}`,
      borderLeftWidth: "var(--border-rail)",
      borderLeftColor: s.fg,
      borderRadius: "var(--radius-sm)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: 17,
    style: {
      color: s.fg,
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: s.fg,
      letterSpacing: "-0.005em"
    }
  }, outcome.title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      lineHeight: 1.45,
      color: "var(--text-secondary)"
    }
  }, outcome.body(hopCount)), showReasonCode ? /*#__PURE__*/React.createElement("code", {
    style: {
      display: "block",
      marginTop: 6,
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      letterSpacing: "-0.01em",
      color: "var(--text-muted)"
    }
  }, "reason: ", reason) : null));
}
Object.assign(__ds_scope, { CheckResult });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/CheckResult.jsx", error: String((e && e.message) || e) }); }

// components/status/StatusChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square glyph chip that carries a row's status — the leading element of every application row. */
function StatusChip({
  status = "neutral",
  size = 28,
  style,
  ...rest
}) {
  const s = __ds_scope.statusOf(status);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      width: size,
      height: size,
      display: "grid",
      placeItems: "center",
      flex: "none",
      color: s.fg,
      background: s.bg,
      backgroundImage: s.hatch !== "none" ? s.hatch : undefined,
      border: `1px solid ${s.border}`,
      borderRadius: "var(--radius-sm)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: Math.round(size * 0.57)
  }));
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/evidence/ApplicationRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A candidate root in the inventory. Selecting it selects the same path a graph-node click selects. */
function ApplicationRow({
  name,
  status = "neutral",
  hopCount,
  detail,
  selected = false,
  onSelect,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = __ds_scope.statusOf(status);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onSelect,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    "aria-pressed": selected,
    style: {
      width: "100%",
      padding: "10px 10px 10px 9px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      textAlign: "left",
      color: "var(--text-primary)",
      background: selected ? "var(--surface-raised)" : hover ? "var(--surface-hover)" : "transparent",
      border: "1px solid transparent",
      borderColor: selected ? "var(--border-strong)" : "transparent",
      borderLeft: `var(--border-rail) solid ${selected ? s.fg : "transparent"}`,
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      transition: "var(--transition-control)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.StatusChip, {
    status: status,
    size: 28
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: "-0.005em",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, name), /*#__PURE__*/React.createElement("small", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "-0.01em",
      color: "var(--text-muted)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, hopCount !== undefined ? `${hopCount} hops` : null, hopCount !== undefined && (detail || s.row) ? " · " : null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: s.fg
    }
  }, detail || s.row))));
}
Object.assign(__ds_scope, { ApplicationRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/evidence/ApplicationRow.jsx", error: String((e && e.message) || e) }); }

// components/status/StatusPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Temporal verdict for a path. Four distinct meanings, never collapsed: exposed / not_exposed / unresolved / no_path. */
function StatusPill({
  status = "neutral",
  label,
  icon = true,
  size = "md",
  style,
  ...rest
}) {
  const s = __ds_scope.statusOf(status);
  const sm = size === "sm";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: sm ? 5 : 6,
      padding: sm ? "3px 7px" : "5px 9px",
      color: s.fg,
      background: s.bg,
      backgroundImage: s.hatch !== "none" ? s.hatch : undefined,
      border: `1px solid ${s.border}`,
      borderRadius: "var(--radius-xs)",
      fontFamily: "var(--font-sans)",
      fontSize: sm ? 9 : "var(--type-label-size)",
      fontWeight: 700,
      letterSpacing: "var(--type-label-tracking)",
      textTransform: "uppercase",
      lineHeight: 1.1,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: sm ? 10 : 12,
    strokeWidth: 2
  }) : null, label || s.label);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/status/StatusPill.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/EvidencePanels.jsx
try { (() => {
/* Lower evidence row: the ordered path with its relationship evidence, and the UTC timeline. */
function PathEvidence({
  path
}) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const {
    SectionHeading,
    StatusPill,
    ChainNode,
    EvidenceRow,
    Icon
  } = NS;
  const fmt = window.brFormatUtc;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--pad-panel)",
      minWidth: 0,
      borderRight: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Selected evidence path",
    title: path.application.name,
    right: /*#__PURE__*/React.createElement(StatusPill, {
      status: path.temporal.status
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "flex",
      alignItems: "stretch",
      gap: 6,
      overflowX: "auto",
      paddingBottom: 8
    },
    "aria-label": "Ordered dependency path"
  }, path.nodes.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: n.entityId,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(ChainNode, {
    index: i + 1,
    role: n.entityId === path.compromisedVersion.entityId ? "compromised" : n.kind === "application" ? "application" : "dependency",
    name: n.name,
    detail: n.kind === "application" ? n.repository : n.entityId
  }), i < path.nodes.length - 1 ? /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 17,
    style: {
      color: "var(--text-faint)"
    }
  }) : null))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, path.relationships.map(r => /*#__PURE__*/React.createElement(EvidenceRow, {
    key: r.edgeId,
    relationshipType: r.relationshipType,
    evidence: r.evidence,
    interval: r.validWindow ? `${fmt(r.validWindow.start)} → ${fmt(r.validWindow.end)}` : undefined
  }))));
}
function ExposureTimeline({
  path
}) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const {
    SectionHeading,
    TimelineRow
  } = NS;
  const fmt = window.brFormatUtc;
  const bars = [{
    id: "compromise",
    label: "Compromise",
    window: path.temporal.compromisedWindow,
    tone: "compromise"
  }, ...path.relationships.map((r, i) => ({
    id: r.edgeId,
    label: `Dependency ${i + 1}`,
    window: r.validWindow,
    tone: r.validWindow ? "dependency" : "unresolved"
  })), ...(path.temporal.effectiveWindow ? [{
    id: "effective",
    label: "Effective exposure",
    window: path.temporal.effectiveWindow,
    tone: "effective"
  }] : [])];
  const measured = bars.filter(b => b.window);
  const domainStart = Math.min(...measured.map(b => b.window.start));
  const domainEnd = Math.max(...measured.map(b => b.window.end));
  const domain = Math.max(1, domainEnd - domainStart);
  const overlap = path.temporal.effectiveWindow;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--pad-panel)",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Half-open interval policy",
    title: "Exposure timeline",
    align: "center",
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        fontFeatureSettings: "var(--numeric-tabular)",
        color: overlap ? "var(--status-exposed)" : "var(--text-muted)"
      }
    }, overlap ? window.brFormatDuration(overlap) : "No overlap")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "18px 0 8px var(--timeline-label-width)",
      paddingLeft: 8,
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      color: "var(--text-faint)"
    }
  }, /*#__PURE__*/React.createElement("span", null, fmt(domainStart)), /*#__PURE__*/React.createElement("span", null, fmt(domainEnd))), /*#__PURE__*/React.createElement("div", null, bars.map(b => /*#__PURE__*/React.createElement(TimelineRow, {
    key: b.id,
    label: b.label,
    tone: b.tone,
    left: b.window ? (b.window.start - domainStart) / domain * 100 : 0,
    width: b.window ? (b.window.end - b.window.start) / domain * 100 : 100,
    title: b.window ? `${fmt(b.window.start)} → ${fmt(b.window.end)}` : "No validity interval"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: 10.5,
      lineHeight: 1.5,
      color: "var(--text-muted)"
    }
  }, "Intervals are half-open ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10
    }
  }, "[start, end)"), "; touching boundaries do not overlap."));
}
Object.assign(window, {
  PathEvidence,
  ExposureTimeline
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/EvidencePanels.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/GraphCanvas.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  const paths = analysis.candidateRoots.map(c => c.paths[0]);
  paths.forEach((path, rowIndex) => {
    path.nodes.forEach((n, i) => {
      const x = n.kind === "application" ? 20 : i === path.nodes.length - 1 ? GRAPH_WIDTH : Math.round(GRAPH_WIDTH * i / (path.nodes.length - 1));
      const y = 72 + rowIndex * ROW_GAP;
      positions.set(n.entityId, [...(positions.get(n.entityId) || []), {
        x,
        y
      }]);
    });
  });
  const selectedNodes = new Set((selectedPath?.nodes || []).map(n => n.entityId));
  const selectedEdges = new Set((selectedPath?.relationships || []).map(e => e.edgeId));
  const status = new Map(analysis.candidateRoots.map(c => [c.application.entityId, c.status]));
  const placed = analysis.graph.nodes.map(n => {
    const samples = positions.get(n.entityId) || [{
      x: GRAPH_WIDTH,
      y: 160
    }];
    return {
      node: n,
      x: Math.round(samples.reduce((s, p) => s + p.x, 0) / samples.length),
      y: Math.round(samples.reduce((s, p) => s + p.y, 0) / samples.length),
      compromised: n.entityId === analysis.compromisedVersion.entityId,
      status: status.get(n.entityId),
      selected: selectedNodes.has(n.entityId),
      onPath: selectedNodes.has(n.entityId)
    };
  });
  const byId = new Map(placed.map(p => [p.node.entityId, p]));
  const edges = analysis.graph.relationships.map(r => {
    const s = byId.get(r.sourceEntityId);
    const t = byId.get(r.targetEntityId);
    return {
      id: r.edgeId,
      selected: selectedEdges.has(r.edgeId),
      x1: s.x + NODE_W,
      y1: s.y + NODE_H / 2,
      x2: t.x,
      y2: t.y + NODE_H / 2
    };
  });
  const minX = Math.min(...placed.map(p => p.x)) - PAD;
  const minY = Math.min(...placed.map(p => p.y)) - PAD;
  const maxX = Math.max(...placed.map(p => p.x)) + NODE_W + PAD;
  const maxY = Math.max(...placed.map(p => p.y)) + NODE_H + PAD;
  return {
    placed,
    edges,
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function GraphCanvas({
  analysis,
  selectedPath,
  onSelectApplication,
  height
}) {
  const {
    GraphNode
  } = window.BlastRadiusDesignSystem_6e5e22;
  const wrapRef = React.useRef(null);
  const [box, setBox] = React.useState({
    w: 860,
    h: 426
  });
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({
    x: 0,
    y: 0
  });
  const drag = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setBox({
      w: el.clientWidth,
      h: el.clientHeight
    });
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
  const onDown = e => {
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      px: pan.x,
      py: pan.y
    };
  };
  const onMove = e => {
    if (!drag.current) return;
    setPan({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y)
    });
  };
  const onUp = () => {
    drag.current = null;
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    onMouseDown: onDown,
    onMouseMove: onMove,
    onMouseUp: onUp,
    onMouseLeave: onUp,
    style: {
      position: "relative",
      height: height || "var(--graph-canvas-height)",
      overflow: "hidden",
      background: "var(--graph-canvas)",
      backgroundImage: "radial-gradient(var(--graph-grid) 1px, transparent 1px)",
      backgroundSize: "18px 18px",
      cursor: drag.current ? "grabbing" : "grab"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: layout.width,
      height: layout.height,
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
      transformOrigin: "0 0"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: layout.width,
    height: layout.height,
    style: {
      position: "absolute",
      inset: 0,
      overflow: "visible",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("marker", {
    id: "br-arrow",
    markerWidth: "7",
    markerHeight: "7",
    refX: "6.5",
    refY: "3",
    orient: "auto"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,0 L6,3 L0,6 z",
    fill: "var(--graph-edge)"
  })), /*#__PURE__*/React.createElement("marker", {
    id: "br-arrow-sel",
    markerWidth: "7",
    markerHeight: "7",
    refX: "6.5",
    refY: "3",
    orient: "auto"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,0 L6,3 L0,6 z",
    fill: "var(--graph-edge-selected)"
  }))), layout.edges.map(e => {
    const x1 = e.x1 - layout.minX;
    const y1 = e.y1 - layout.minY;
    const x2 = e.x2 - layout.minX;
    const y2 = e.y2 - layout.minY;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return /*#__PURE__*/React.createElement("g", {
      key: e.id
    }, /*#__PURE__*/React.createElement("path", {
      d: `M${x1},${y1} C${x1 + 55},${y1} ${x2 - 55},${y2} ${x2},${y2}`,
      fill: "none",
      stroke: e.selected ? "var(--graph-edge-selected)" : "var(--graph-edge)",
      strokeWidth: e.selected ? 2.5 : 1.5,
      strokeDasharray: e.selected ? "7 5" : undefined,
      markerEnd: `url(#${e.selected ? "br-arrow-sel" : "br-arrow"})`,
      className: e.selected ? "br-flow" : undefined
    }), /*#__PURE__*/React.createElement("rect", {
      x: mx - 38,
      y: my - 8,
      width: "76",
      height: "15",
      rx: "3",
      fill: "var(--graph-canvas)",
      opacity: "0.94"
    }), /*#__PURE__*/React.createElement("text", {
      x: mx,
      y: my + 3,
      textAnchor: "middle",
      fontFamily: "var(--font-mono)",
      fontSize: "9",
      fontWeight: "600",
      fill: e.selected ? "var(--red-400)" : "var(--graph-edge-label)"
    }, "DEPENDS_ON"));
  })), layout.placed.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.node.entityId,
    style: {
      position: "absolute",
      left: p.x - layout.minX,
      top: p.y - layout.minY
    },
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement(GraphNode, {
    kind: p.compromised ? "compromised" : p.node.kind === "application" ? "application" : "version",
    status: p.status,
    name: p.node.name,
    detail: p.node.kind === "application" ? p.node.environment : `v${p.node.version}`,
    selected: p.selected,
    dimmed: !!selectedPath && !p.onPath && !p.compromised,
    clickable: p.node.kind === "application",
    onSelect: () => p.node.kind === "application" && onSelectApplication(p.node.entityId)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      bottom: 12,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, [{
    icon: "plus",
    label: "Zoom in",
    act: () => setZoom(z => Math.min(2.4, z * 1.2))
  }, {
    icon: "minus",
    label: "Zoom out",
    act: () => setZoom(z => Math.max(0.4, z / 1.2))
  }, {
    icon: "maximize",
    label: "Fit view",
    act: () => {
      setZoom(1);
      setPan({
        x: 0,
        y: 0
      });
    }
  }].map(c => /*#__PURE__*/React.createElement(GraphControl, _extends({
    key: c.icon
  }, c)))));
}
function GraphControl({
  icon,
  label,
  act
}) {
  const {
    Icon
  } = window.BlastRadiusDesignSystem_6e5e22;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    title: label,
    "aria-label": label,
    onClick: act,
    onMouseDown: e => e.stopPropagation(),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 28,
      height: 28,
      display: "grid",
      placeItems: "center",
      background: hover ? "var(--surface-hover)" : "var(--surface-panel)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-sm)",
      color: "var(--text-secondary)",
      cursor: "pointer",
      transition: "var(--transition-control)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 14,
    strokeWidth: 2
  }));
}
Object.assign(window, {
  GraphCanvas,
  buildLayout
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/GraphCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/IncidentSidebar.jsx
try { (() => {
/* Left incident rail: identity, the UTC window, and the single-application check. */
function IncidentSidebar({
  incident,
  windowStart,
  windowEnd,
  onWindowStart,
  onWindowEnd,
  windowValid,
  analyzing,
  hasAnalysis,
  onAnalyze,
  checkApplication,
  onCheckApplication,
  checking,
  checkResult,
  onCheck,
  mobile
}) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const {
    SeverityBadge,
    StatusDot,
    Field,
    Select,
    Button,
    SectionHeading,
    CheckResult,
    ScopeNote,
    Icon
  } = NS;
  const block = {
    padding: mobile ? 15 : "var(--pad-sidebar-section)",
    borderBottom: "1px solid var(--border-subtle)"
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: mobile ? "100%" : "var(--sidebar-width)",
      flex: "none",
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-panel)",
      borderRight: mobile ? "none" : "1px solid var(--border-subtle)",
      borderBottom: mobile ? "1px solid var(--border-subtle)" : "none"
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: block
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(SeverityBadge, {
    severity: incident.advisory.severity
  }), /*#__PURE__*/React.createElement(StatusDot, {
    tone: "active",
    label: "Active"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.06em",
      color: "var(--status-compromised)",
      textTransform: "uppercase"
    }
  }, incident.advisory.id), /*#__PURE__*/React.createElement("h1", {
    style: {
      marginTop: 7,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--type-display-size)",
      fontWeight: 600,
      lineHeight: "var(--type-display-line)",
      letterSpacing: "var(--type-display-tracking)",
      overflowWrap: "anywhere"
    }
  }, incident.compromisedVersion.packageName, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 4,
      fontSize: "var(--type-version-size)",
      color: "var(--status-compromised)",
      letterSpacing: "var(--type-version-tracking)"
    }
  }, "@", incident.compromisedVersion.version)), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 10,
      fontSize: 12.5,
      lineHeight: 1.5,
      color: "var(--text-secondary)"
    }
  }, incident.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13,
      display: "flex",
      gap: 14,
      flexWrap: "wrap"
    }
  }, [{
    href: incident.advisory.sourceUrl,
    label: incident.advisory.cve
  }, {
    href: incident.advisory.osvUrl,
    label: "OSV record"
  }].map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontSize: 11,
      fontWeight: 600,
      color: "var(--link-fg)"
    }
  }, l.label, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 13,
    strokeWidth: 2
  }))))), /*#__PURE__*/React.createElement("section", {
    style: block
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    icon: "clock-3",
    title: "Exposure window",
    align: "center",
    style: {
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "UTC start",
    inputProps: {
      type: "datetime-local",
      step: "0.001",
      value: windowStart,
      onChange: onWindowStart
    }
  }), /*#__PURE__*/React.createElement(Field, {
    label: "UTC end",
    invalid: !windowValid,
    hint: !windowValid ? "Start must be before end" : undefined,
    inputProps: {
      type: "datetime-local",
      step: "0.001",
      value: windowEnd,
      onChange: onWindowEnd
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    icon: hasAnalysis ? "refresh-cw" : "radar",
    loading: analyzing,
    disabled: !windowValid,
    onClick: onAnalyze,
    style: {
      marginTop: 2
    }
  }, analyzing ? "Querying HydraDB" : hasAnalysis ? "Re-run analysis" : "Analyze blast radius"))), /*#__PURE__*/React.createElement("section", {
    style: block
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    icon: "search-check",
    title: "Application check",
    align: "center",
    style: {
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Select, {
    value: checkApplication,
    onChange: onCheckApplication,
    options: incident.applications.map(a => ({
      value: a.entityId,
      label: a.name
    }))
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    icon: "search-check",
    loading: checking,
    disabled: !hasAnalysis,
    onClick: onCheck
  }, "Check exposure"), !hasAnalysis ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "var(--text-faint)",
      lineHeight: 1.4
    }
  }, "Available after a blast-radius analysis.") : null, checkResult ? /*#__PURE__*/React.createElement(CheckResult, {
    reason: checkResult.reason,
    hopCount: checkResult.hopCount
  }) : null)), mobile ? null : /*#__PURE__*/React.createElement(ScopeNote, null, incident.dataScope));
}
Object.assign(window, {
  IncidentSidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/IncidentSidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Workspace.jsx
try { (() => {
/* BlastRadius incident workspace — one route, all states. */
function useBreakpoint() {
  const [w, setW] = React.useState(typeof window !== "undefined" ? window.innerWidth : 1440);
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w <= 820 ? "sm" : w <= 1100 ? "md" : "lg";
}
function Workspace({
  startLoading = true,
  forceBp
}) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const {
    TopBar,
    Panel,
    SummaryMetric,
    ApplicationRow,
    EmptyState,
    ErrorBanner,
    FullScreenState,
    GraphLegend,
    ScopeNote
  } = NS;
  const incident = window.brIncident;
  const bp = forceBp || useBreakpoint();
  const sm = bp === "sm";
  const [loading, setLoading] = React.useState(startLoading);
  const [analysis, setAnalysis] = React.useState(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [windowStart, setWindowStart] = React.useState(window.brToDateTimeInput(incident.compromiseWindow.start));
  const [windowEnd, setWindowEnd] = React.useState(window.brToDateTimeInput(incident.compromiseWindow.end));
  const [checkApplication, setCheckApplication] = React.useState(incident.applications[0].entityId);
  const [checking, setChecking] = React.useState(false);
  const [checkResult, setCheckResult] = React.useState(null);
  React.useEffect(() => {
    if (!startLoading) return;
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [startLoading]);
  const windowValid = Date.parse(windowStart + "Z") < Date.parse(windowEnd + "Z");
  const runAnalysis = () => {
    setAnalyzing(true);
    setError(null);
    setCheckResult(null);
    setTimeout(() => {
      const result = window.brAnalysis;
      setAnalysis(result);
      setSelected(result.candidateRoots.find(c => c.status === "exposed")?.application.entityId || result.candidateRoots[0].application.entityId);
      setAnalyzing(false);
    }, 850);
  };
  const runCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setCheckResult(window.brCheckOutcomes[checkApplication]);
      setChecking(false);
    }, 500);
  };
  if (loading) return /*#__PURE__*/React.createElement(FullScreenState, {
    busy: true,
    label: "Loading incident",
    detail: "GET /api/incidents"
  });
  const candidate = analysis?.candidateRoots.find(c => c.application.entityId === selected);
  const path = candidate?.paths[0] || null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: forceBp ? 0 : "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-app)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    compact: sm
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: sm ? "column" : "row",
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: sm ? "100%" : bp === "md" ? "var(--sidebar-width-md)" : "var(--sidebar-width)",
      flex: "none",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(window.IncidentSidebar, {
    incident: incident,
    mobile: sm,
    windowStart: windowStart,
    windowEnd: windowEnd,
    onWindowStart: e => setWindowStart(e.target.value),
    onWindowEnd: e => setWindowEnd(e.target.value),
    windowValid: windowValid,
    analyzing: analyzing,
    hasAnalysis: !!analysis,
    onAnalyze: runAnalysis,
    checkApplication: checkApplication,
    onCheckApplication: e => {
      setCheckApplication(e.target.value);
      setCheckResult(null);
    },
    checking: checking,
    checkResult: checkResult,
    onCheck: runCheck
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: sm ? "0 10px 18px" : "0 18px 24px"
    }
  }, error ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(ErrorBanner, {
    message: error,
    onDismiss: () => setError(null)
  })) : null, /*#__PURE__*/React.createElement("section", {
    "aria-label": "Analysis summary",
    style: {
      display: "grid",
      gridTemplateColumns: sm ? "repeat(2, minmax(0,1fr))" : "repeat(4, minmax(0,1fr))",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(SummaryMetric, {
    label: "Exposed applications",
    value: analysis ? analysis.affectedRootCount : "—",
    tone: "danger",
    hint: "affectedRoots[]"
  }), /*#__PURE__*/React.createElement(SummaryMetric, {
    label: "Topological candidates",
    value: analysis ? analysis.candidateRootCount : "—",
    hint: "candidateRoots[]",
    divider: !sm
  }), /*#__PURE__*/React.createElement(SummaryMetric, {
    label: "HydraDB query",
    value: analysis ? window.brFormatLatency(analysis.timing.hydraQueryMs) : "—",
    hint: "timing.hydraQueryMs",
    style: {
      borderTop: sm ? "1px solid var(--border-subtle)" : undefined
    }
  }), /*#__PURE__*/React.createElement(SummaryMetric, {
    label: "Traversal",
    value: analysis ? analysis.traversal.direction : "—",
    hint: analysis ? `${analysis.traversal.maxLength} hop cap` : "algo.SSpaths",
    divider: false,
    style: {
      borderTop: sm ? "1px solid var(--border-subtle)" : undefined
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: sm ? "block" : "grid",
      gridTemplateColumns: `minmax(0,1fr) ${bp === "md" ? "var(--root-inventory-width-md)" : "var(--root-inventory-width)"}`,
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    kicker: "Incident graph",
    title: "Transitive blast radius",
    meta: analysis ? `${analysis.graph.nodes.length} nodes · ${analysis.graph.relationships.length} edges` : null,
    style: {
      borderRight: sm ? "none" : "1px solid var(--border-subtle)"
    }
  }, analysis ? /*#__PURE__*/React.createElement(window.GraphCanvas, {
    analysis: analysis,
    selectedPath: path,
    onSelectApplication: setSelected,
    height: sm ? "var(--graph-canvas-height-sm)" : "var(--graph-canvas-height)"
  }) : /*#__PURE__*/React.createElement(EmptyState, {
    busy: analyzing,
    label: analyzing ? "Querying HydraDB" : "Analysis pending",
    sublabel: analyzing ? "Incoming SSpaths traversal" : "No graph result",
    height: sm ? "var(--graph-canvas-height-sm)" : "var(--graph-canvas-height)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 14px",
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--gr-925)"
    }
  }, /*#__PURE__*/React.createElement(GraphLegend, {
    keys: analysis ? ["compromised", "exposed", "not_exposed", "dependency", "selected", "edge"] : ["compromised", "exposed", "edge"]
  }))), /*#__PURE__*/React.createElement(Panel, {
    kicker: "Root inventory",
    title: "Application paths",
    style: {
      borderTop: sm ? "1px solid var(--border-subtle)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, analysis ? analysis.candidateRoots.map(c => /*#__PURE__*/React.createElement(ApplicationRow, {
    key: c.application.entityId,
    name: c.application.name,
    status: c.status,
    hopCount: c.paths[0].hopCount,
    selected: c.application.entityId === selected,
    onSelect: () => setSelected(c.application.entityId)
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      padding: 16,
      fontSize: 11,
      color: "var(--text-faint)"
    }
  }, "No analysis result")))), path ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: bp === "lg" ? "minmax(0,1.4fr) minmax(330px,0.8fr)" : "minmax(0,1fr)"
    }
  }, /*#__PURE__*/React.createElement(window.PathEvidence, {
    path: path
  }), /*#__PURE__*/React.createElement(window.ExposureTimeline, {
    path: path
  })) : /*#__PURE__*/React.createElement(EmptyState, {
    icon: "circle-slash-2",
    label: "No path selected",
    height: 180,
    grid: false
  }), sm ? /*#__PURE__*/React.createElement(ScopeNote, {
    style: {
      marginTop: 0
    }
  }, incident.dataScope) : null)));
}
Object.assign(window, {
  Workspace,
  useBreakpoint
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Workspace.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/fixture.js
try { (() => {
/* Real values from the BlastRadius curated fixture (src/graph/fixture.ts) and the
   verified smoke run (docs/validation/browser-smoke-final/result.json).
   Nothing here is invented: entity IDs, evidence strings, intervals and timings
   are the ones the running product returns. */
const ms = iso => Date.parse(iso);
const maliciousWindow = {
  start: ms("2021-10-22T12:15:21.378Z"),
  end: ms("2021-10-22T16:16:08.807Z")
};
const activeDuringIncident = {
  start: ms("2021-10-01T00:00:00.000Z"),
  end: ms("2021-10-23T00:00:00.000Z")
};
const activeAfterFix = {
  start: ms("2021-10-22T16:16:09.000Z"),
  end: ms("2021-11-30T00:00:00.000Z")
};
const incident = {
  id: "incident:ghsa-pjwm-rvh2-c87w",
  title: "Embedded malware in ua-parser-js@0.7.29",
  status: "active investigation",
  advisory: {
    id: "GHSA-pjwm-rvh2-c87w",
    cve: "CVE-2021-4229",
    severity: "critical",
    sourceUrl: "https://github.com/advisories/GHSA-pjwm-rvh2-c87w",
    osvUrl: "https://osv.dev/vulnerability/GHSA-pjwm-rvh2-c87w"
  },
  compromisedVersion: {
    entityId: "pkg:npm/ua-parser-js@0.7.29",
    ecosystem: "npm",
    packageName: "ua-parser-js",
    version: "0.7.29"
  },
  compromiseWindow: maliciousWindow,
  applications: [{
    entityId: "app:admin-portal",
    name: "Admin Portal"
  }, {
    entityId: "app:analytics-worker",
    name: "Analytics Worker"
  }, {
    entityId: "app:merchant-web",
    name: "Merchant Web"
  }],
  dataScope: "curated demonstration fixture"
};
const node = (entityId, kind, name, extra) => ({
  entityId,
  kind,
  name,
  ...extra
});
const nodes = {
  adminPortal: node("app:admin-portal", "application", "Admin Portal", {
    repository: "github.com/acme/admin-portal",
    environment: "production"
  }),
  merchantWeb: node("app:merchant-web", "application", "Merchant Web", {
    repository: "github.com/acme/merchant-web",
    environment: "production"
  }),
  identitySdk: node("pkg:npm/@acme/identity-sdk@2.7.1", "version", "@acme/identity-sdk@2.7.1", {
    packageName: "@acme/identity-sdk",
    version: "2.7.1"
  }),
  commerceSdk: node("pkg:npm/@acme/commerce-sdk@3.4.0", "version", "@acme/commerce-sdk@3.4.0", {
    packageName: "@acme/commerce-sdk",
    version: "3.4.0"
  }),
  requestIp: node("pkg:npm/request-ip@2.1.3", "version", "request-ip@2.1.3", {
    packageName: "request-ip",
    version: "2.1.3"
  }),
  uaParser: node("pkg:npm/ua-parser-js@0.7.29", "version", "ua-parser-js@0.7.29", {
    packageName: "ua-parser-js",
    version: "0.7.29"
  })
};
const edge = (edgeId, source, target, evidence, validWindow) => ({
  edgeId,
  relationshipType: "DEPENDS_ON",
  sourceEntityId: source,
  targetEntityId: target,
  evidence,
  validWindow: validWindow || null
});
const adminPath = {
  pathId: "path:admin-portal",
  application: nodes.adminPortal,
  compromisedVersion: nodes.uaParser,
  nodes: [nodes.adminPortal, nodes.identitySdk, nodes.uaParser],
  relationships: [edge("admin-portal-depends-on-identity-sdk-2.7.1", "app:admin-portal", "pkg:npm/@acme/identity-sdk@2.7.1", "admin-portal package-lock.json resolved @acme/identity-sdk@2.7.1 after the fixed release.", activeAfterFix), edge("identity-sdk-depends-on-ua-parser-js-0.7.29", "pkg:npm/@acme/identity-sdk@2.7.1", "pkg:npm/ua-parser-js@0.7.29", "@acme/identity-sdk@2.7.1 retained a dependency edge after the compromise window.", activeAfterFix)],
  hopCount: 2,
  temporal: {
    status: "not_exposed",
    reason: "no_common_overlap",
    requestedWindow: maliciousWindow,
    compromisedWindow: maliciousWindow,
    effectiveWindow: null
  }
};
const merchantPath = {
  pathId: "path:merchant-web",
  application: nodes.merchantWeb,
  compromisedVersion: nodes.uaParser,
  nodes: [nodes.merchantWeb, nodes.commerceSdk, nodes.requestIp, nodes.uaParser],
  relationships: [edge("merchant-web-depends-on-commerce-sdk-3.4.0", "app:merchant-web", "pkg:npm/@acme/commerce-sdk@3.4.0", "merchant-web package-lock.json resolved @acme/commerce-sdk@3.4.0", activeDuringIncident), edge("commerce-sdk-depends-on-request-ip-2.1.3", "pkg:npm/@acme/commerce-sdk@3.4.0", "pkg:npm/request-ip@2.1.3", "@acme/commerce-sdk@3.4.0 package-lock.json resolved request-ip@2.1.3", activeDuringIncident), edge("request-ip-depends-on-ua-parser-js-0.7.29", "pkg:npm/request-ip@2.1.3", "pkg:npm/ua-parser-js@0.7.29", "request-ip@2.1.3 lockfile resolution resolved ua-parser-js@0.7.29", activeDuringIncident)],
  hopCount: 3,
  temporal: {
    status: "exposed",
    reason: null,
    requestedWindow: maliciousWindow,
    compromisedWindow: maliciousWindow,
    effectiveWindow: maliciousWindow
  }
};
const analysis = {
  compromisedVersion: nodes.uaParser,
  requestedWindow: maliciousWindow,
  affectedRootCount: 1,
  candidateRootCount: 2,
  candidateRoots: [{
    application: nodes.adminPortal,
    status: "not_exposed",
    paths: [adminPath]
  }, {
    application: nodes.merchantWeb,
    status: "exposed",
    paths: [merchantPath]
  }],
  graph: {
    nodes: [nodes.adminPortal, nodes.identitySdk, nodes.uaParser, nodes.merchantWeb, nodes.commerceSdk, nodes.requestIp],
    relationships: [...adminPath.relationships, ...merchantPath.relationships]
  },
  traversal: {
    engine: "HydraDB algo.SSpaths",
    direction: "incoming",
    maxLength: 6,
    relationshipTypes: ["DEPENDS_ON"]
  },
  timing: {
    hydraQueryMs: 50,
    totalMs: 63
  }
};

/* Exposure-check outcomes exactly as the running backend answers them for this fixture. */
const checkOutcomes = {
  "app:merchant-web": {
    status: "exposed",
    reason: "supporting_dependency_path",
    hopCount: 3
  },
  "app:admin-portal": {
    status: "not_exposed",
    reason: "no_common_overlap",
    hopCount: 2
  },
  "app:analytics-worker": {
    status: "not_exposed",
    reason: "no_supporting_dependency_path",
    hopCount: 0
  }
};

/* ---- formatting, ported from src/client/format.ts ---- */
const formatUtc = t => new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short"
}).format(t);
const formatDuration = w => {
  const hours = (w.end - w.start) / 3600000;
  return hours >= 1 ? `${hours.toFixed(hours >= 10 ? 0 : 1)}h` : `${Math.round((w.end - w.start) / 60000)}m`;
};
const formatLatency = v => v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${v.toFixed(0)}ms`;
const toDateTimeInput = t => new Date(t).toISOString().slice(0, 23);
Object.assign(window, {
  brIncident: incident,
  brAnalysis: analysis,
  brCheckOutcomes: checkOutcomes,
  brFormatUtc: formatUtc,
  brFormatDuration: formatDuration,
  brFormatLatency: formatLatency,
  brToDateTimeInput: toDateTimeInput
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/fixture.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Kicker = __ds_scope.Kicker;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.ApplicationRow = __ds_scope.ApplicationRow;

__ds_ns.ChainNode = __ds_scope.ChainNode;

__ds_ns.EvidenceRow = __ds_scope.EvidenceRow;

__ds_ns.SummaryMetric = __ds_scope.SummaryMetric;

__ds_ns.TimelineRow = __ds_scope.TimelineRow;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.ErrorBanner = __ds_scope.ErrorBanner;

__ds_ns.FullScreenState = __ds_scope.FullScreenState;

__ds_ns.GraphLegend = __ds_scope.GraphLegend;

__ds_ns.GraphNode = __ds_scope.GraphNode;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.ScopeNote = __ds_scope.ScopeNote;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.TopBar = __ds_scope.TopBar;

__ds_ns.CheckResult = __ds_scope.CheckResult;

__ds_ns.SeverityBadge = __ds_scope.SeverityBadge;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.STATUS = __ds_scope.STATUS;

})();
