# Volvo Experience Page — Concept & Task

A project page for the Volvo Group Connected Solutions experience at
`/projects/volvo/`, following the pattern the Snappfood page establishes —
hero → product proof → one signature 3D set piece that carries the
narrative → outcomes — with the truck playing the role the earth plays
there.

## 1. Hero

- Title: **Volvo Group Connected Solutions** over a moody highway-at-dusk
  backdrop.
- Role line: "Trucks connectivity and Fleet management".
- Highlights column (pick the four strongest claims), e.g.:
  - Telematics Data Pipelines
  - Fleet Dashboard
  - Remote Diagnostics
  - Map/Routing UI

## 2. Signature set piece: sticky truck scene

The earth-sequence equivalent and the heart of the page. The teal FH 460
sits in a sticky canvas while story sections scroll past, each one
re-staging the same truck:

### "The vehicle"
The vitrine already built on the home page: slow turntable, drag to
inspect. Intro to what the product runs on.

### "The connection"
Camera pushes in; thin animated arcs/particles rise off the truck toward
the top of the frame (truck → cloud). Floating labels orbit the truck —
*GPS*, *CAN bus*, *fuel telemetry*, *uptime* — same technique as the
earth's "Teamplayer / Code review" labels. This section tells the
telematics story.

### "The fleet"
Camera pulls way back: the truck shrinks to a dot among dozens of dots on
a stylized dark map with route polylines. Copy talks about
fleet-management scale.

**Do not** duplicate real truck instances for this scene — fake the fleet
with sprites/2D behind the canvas.

### Optional beats between sections
- Headlights flick on as the scene darkens.
- Wheels turn a few degrees during section transitions.

## 3. Product proof

- Screenshots/mockups of the actual dashboards and apps (Snappfood-style
  screenshot blocks).
- Component/Stack section.

## 4. Outcomes + credits

- Metrics and impact.
- Model attribution (satisfies CC BY 4.0): small print —
  "Volvo FH 460" by [Rick_modding](https://sketchfab.com/Rick_modding_),
  licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/),
  via [Sketchfab](https://sketchfab.com/3d-models/volvo-fh-460-rick-modding-dcd13ab86e1e469d9daa83d4cbca669e).
  Modified (optimized for web).

## Implementation notes

- ~70% is already built or directly reusable:
  - Sticky-canvas-with-scroll-driven-sections choreography: lift from
    `src/app/projects/snappfood/Earth.tsx` (it is exactly that machine).
  - Truck model, teal material overrides, drag interaction, auto-rotate:
    already in `src/components/Model/` + `deviceModels.ts`.
  - Floating labels: same technique as the earth's labels.
- Genuinely new work (each a contained chunk):
  - Camera keyframes per section.
  - Arcs/particles shader for the telematics beat.
  - Map pull-back for the fleet scene.
- File layout mirrors Snappfood: `src/app/projects/volvo/` with
  `Volvo.tsx` + a `Truck.tsx` sibling to `Earth.tsx`.
- Home page ProjectSummary "View project" for the truck should link here.
