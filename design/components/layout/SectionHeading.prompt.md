Kicker + title + right-hand verdict, used inside padded panels and sidebar blocks.

```jsx
<SectionHeading kicker="Selected evidence path" title="Merchant Web" right={<StatusPill status="exposed" />} />
<SectionHeading icon="clock-3" title="Exposure window" level={2} />
```

With a `kicker` the title renders at section size (15px); without one it drops to subsection size (13px) for sidebar blocks.
