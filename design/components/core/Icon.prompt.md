Lucide glyph, rendered inline so it inherits `currentColor` — use it for every icon in the console.

```jsx
<Icon name="shield-alert" size={17} />
<Icon name="loader-circle" size={16} className="br-spin" />
<Icon name="database" size={15} title="HydraDB" />
```

Sizes in use: 28 (empty states), 20 (full-screen states), 17 (banners, primary buttons), 16 (sidebar headings, graph nodes), 15 (runtime badge, scope note), 14 (advisory links, chevrons). Stroke weight defaults to 1.75; bump to 2 below 14px. Available names are in `assets/icons/` — the console vocabulary is `shield-alert`, `triangle-alert`, `radar`, `search-check`, `circle-check-big`, `circle-slash-2`, `circle-question-mark`, `clock-3`, `database`, `git-branch`, `box`, `package`, `file-check`, `arrow-right`, `arrow-up-right`, `refresh-cw`, `loader-circle`, `waypoints`, `scan-search`.
