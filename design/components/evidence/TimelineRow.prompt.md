One bar on the UTC exposure timeline. Compose rows in DTO order: compromise, each dependency, then the effective overlap.

```jsx
<TimelineRow label="Compromise" tone="compromise" left={0} width={4} title="Oct 22 12:15:21 → 16:16:08 UTC" />
<TimelineRow label="Dependency 1" left={0} width={100} />
<TimelineRow label="Effective exposure" tone="effective" left={0} width={4} />
<TimelineRow label="Dependency 2" tone="unresolved" />   {/* no validity interval */}
```

`left`/`width` are percentages of the computed UTC domain — compute the domain from the bars, exactly as the source does. `tone="unresolved"` draws a dashed hatched band across the whole track: the interval is unknown, so no measured extent may be implied. When there is no effective window, omit the effective row and label the panel "No overlap" rather than drawing a zero-width bar.
