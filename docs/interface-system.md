# Portfolio interface system

This document is the design and implementation reference for the portfolio. New visual elements should fit this system before they are added to the page.

## Product direction

The portfolio should feel like a personal operating system rather than a themed résumé. Apple interfaces are a reference for hierarchy, materials, motion, density, and restraint. The site should not reproduce macOS or iOS literally.

Every operating-system-inspired element must do at least one useful job:

- Help someone navigate or understand the portfolio.
- Expose a real preference or action.
- Present professional or personal information more clearly.
- Reinforce Cristian's personality without competing with the content.

Decorative elements should never become more prominent than the work, career history, or contact path.

## Page hierarchy

The page has five layers, in this order:

1. **System bar** — global navigation, current section, local time, and Control Center.
2. **Identity** — introduction, Memoji, role, location, and primary action.
3. **Professional work** — current role, scope, principles, and measurable context.
4. **Evidence** — career timeline, education, and selected personal projects.
5. **Utility** — working style, AI practice, contact, and footer.

The first viewport should explain who Cristian is, what he does, and where to continue. It should contain no more than one dominant card, one widget rail, and the system bar.

## Spatial grid

### Desktop: 1200px and wider

The content shell is `1168px` wide and uses a fixed 16-column grid:

```text
16 columns × 58px + 15 gutters × 16px = 1168px
```

The `58px` column is the smallest visual unit and matches an icon control. Components span whole columns and gutters:

| Span | Width | Intended use |
| ---: | ---: | --- |
| 1 | 58px | Icon button |
| 2 | 132px | Compact tile or two-button group |
| 3 | 206px | Small status widget |
| 4 | 280px | Widget rail, Focus pill, Control Center group |
| 6 | 428px | Supporting content card |
| 8 | 576px | Half-width feature |
| 12 | 872px | Primary hero or feature |
| 16 | 1168px | Timeline and full-width sections |

The default first-viewport composition is:

```text
┌────────────────────────────── 16 columns ──────────────────────────────┐
│ System bar                                                         16 │
├───────────────────────────────────────────────┬────────────────────────┤
│ Hero                                       12 │ Widget rail          4 │
│                                               │ controls / focus       │
│                                               │ highlights             │
└───────────────────────────────────────────────┴────────────────────────┘
```

Cards within later sections use the same spans. Avoid custom percentages when an existing span works.

### Medium: 700px to 1199px

- Use a fluid 12-column grid with a `16px` gutter.
- The hero occupies all 12 columns.
- Controls form a horizontal or wrapped strip below the hero.
- Two-column content cards use six columns each.
- The timeline changes from a sidebar layout to a stacked introduction and list.

### Small: below 700px

- Use a four-column fluid grid with a `12px` gutter and `18px` page margins.
- Content cards occupy all four columns.
- Icon controls remain at least `52px` square.
- Floating controls must avoid text, links, and the device safe area.
- Reordering should follow reading priority, not the desktop visual position.

## Component families

### Surfaces

All glass containers derive from one `GlassSurface` primitive with variants:

- `content` — calm material for text-heavy cards.
- `widget` — stronger glass, compact information, and more visible edge reflection.
- `control` — interactive, high contrast, and sized from the 58px unit.
- `popover` — layered material used by the future Control Center and menus.

The primitive owns radius, tint, blur, edge reflection, shadows, light/dark colors, and reduced-transparency behavior. Feature components must not recreate these properties independently.

### Controls

- `IconButton` — one grid unit, circular, icon only, tooltip and accessible label required.
- `ControlPill` — four grid units by one unit, icon plus title and status.
- `PrimaryAction` — content-width button for the main route through the portfolio.
- `TextAction` — low-emphasis navigation or secondary action.

Theme, language, social links, Focus, and Control Center must use these primitives.

### Widgets

- `HighlightsWidget` — reminder-style list with a summary count.
- `FocusControl` — a ControlPill using the ID-card symbol.
- `LocalTimeWidget` — currently hidden; it should return only if it earns a place in the grid.
- `ControlCenter` — future popover containing global controls and system status.

Widgets share header spacing, typography, separators, and compact density. A widget should not introduce its own unrelated card geometry.

### Content cards

- `HeroCard`
- `WorkCard`
- `CurrentRoleCard`
- `AboutCard`
- `ProjectCard`
- `TimelineCard`
- `UtilityCard`

These are compositions of shared primitives. Repeated structures such as card headers, tags, action rows, project metadata, and technology chips should become components before their third use.

## System bar and Control Center

The future system bar replaces the conventional header and is visually inspired by the macOS menu bar.

Left side:

- `cm.` identity mark.
- Current section name.
- Primary section links on wide screens.

Right side:

- Optional São Paulo time.
- Control Center trigger.
- Theme/status indicator only when it adds useful context.

The Control Center opens from the top-right trigger as a `popover` surface. It contains:

- Language.
- Light/dark appearance.
- Focus mode.
- GitHub and LinkedIn.
- Future system-style preferences.

It must support click outside, `Escape`, focus return, keyboard navigation, and reduced motion. On mobile it becomes a bottom sheet or anchored compact panel rather than a desktop-style floating window.

Once Control Center exists, duplicated controls should be removed from the widget rail. The freed four-column rail can hold highlights, a carefully justified widget, or become part of the hero.

## Focus mode

Focus mode prioritizes professional evaluation:

- Keep identity, current work, about, timeline, working style, and contact.
- Hide decorative widgets, the conversational current-role card, personal projects, and personal details.
- Preserve a visible exit control at all viewport sizes.
- Animate removal with opacity and slight scale; animate surviving grid items into their new positions.
- Skip motion when `prefers-reduced-motion` is enabled.

Focus is a page mode, not a separate route. Its state may persist locally but should never change the URL shared with another person.

## Material and color

- Orange remains the only brand accent.
- Blue is reserved for active system state, such as Focus.
- Cyan is reserved for the ID-card glyph inside Focus.
- Content surfaces use quieter glass than controls and popovers.
- The cursor-driven reflection appears only on edges.
- The edge nearest the pointer is darker; the opposite edge catches the highlight.
- Text contrast takes priority over transparency.
- Shadows indicate elevation, not decoration. Components at the same elevation share the same shadow.

## Typography

- Use the system stack headed by `-apple-system` and `BlinkMacSystemFont`.
- Use tabular numerals for clocks, counts, and numeric metrics.
- Keep no more than four text levels inside a card: eyebrow, title, body, metadata.
- Uppercase and letter spacing are reserved for metadata and section captions.
- Body text should normally remain between `14px` and `17px` with a line height of at least `1.5`.

## Motion

Motion communicates state and spatial continuity:

- Controls: `160–220ms`.
- Card/grid rearrangement: `420–560ms`.
- Memoji theme reaction: approximately `680ms`, frame by frame.
- Popovers: scale from their trigger with a short opacity transition.
- Avoid continuous decorative animation.
- Every animation must have a reduced-motion outcome.

## React architecture

The target source structure is:

```text
src/
├── app/
│   ├── App.jsx
│   └── PortfolioProvider.jsx
├── components/
│   ├── controls/
│   │   ├── IconButton.jsx
│   │   ├── ControlPill.jsx
│   │   └── FocusControl.jsx
│   ├── surfaces/
│   │   └── GlassSurface.jsx
│   ├── system/
│   │   ├── SystemBar.jsx
│   │   └── ControlCenter.jsx
│   ├── widgets/
│   │   └── HighlightsWidget.jsx
│   └── content/
│       ├── HeroCard.jsx
│       ├── WorkCard.jsx
│       ├── ProjectCard.jsx
│       └── Timeline.jsx
├── hooks/
│   ├── useAppearance.js
│   ├── useFocusMode.js
│   └── useGlassReflection.js
├── content/
│   ├── projects.js
│   ├── timeline.js
│   └── translations.json
└── styles/
    ├── tokens.css
    ├── grid.css
    ├── materials.css
    └── components.css
```

`App.jsx` is currently an intermediate migrated file. It should be split according to this structure before adding the System Bar.

## Implementation sequence

1. **Foundation refactor**
   - Extract tokens and the 16-column grid.
   - Create `GlassSurface`, `IconButton`, and `ControlPill`.
   - Move global state into `PortfolioProvider` and extract hooks.

2. **Existing component cleanup**
   - Split the hero, highlights, work, projects, timeline, and utility sections.
   - Move content data out of JSX.
   - Remove legacy selectors and duplicated CSS declarations.

3. **System bar**
   - Build the responsive bar and active-section behavior.
   - Keep existing controls in place until the new bar is validated.

4. **Control Center**
   - Build an accessible popover.
   - Move appearance, language, Focus, and social controls into it.
   - Remove duplicated controls only after parity is confirmed.

5. **Grid review**
   - Recompose the first viewport after the rail is freed.
   - Review every section at desktop, medium, and mobile sizes.
   - Restore the time widget only if it improves the final composition.

## Definition of done for new UI

A new element is ready only when:

- It occupies documented grid spans at all breakpoints.
- It uses an existing surface and control primitive.
- Light and dark themes have been visually checked.
- Portuguese and English copy fit without clipping.
- Keyboard focus, labels, and hit targets work.
- Reduced motion and reduced transparency are respected.
- The full page is inspected after the change, not only the component itself.
- The production build passes and the result is checked through `/dist/index.html`.
