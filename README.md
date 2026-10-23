# Fold & Snip

A small paper-cutting playground. Fold virtual paper, make a few cuts, and pull it open to discover the pattern.

**[Play Fold & Snip](https://syymza.github.io/fold-and-snip/)**

## Play

- Pick Snow flower, Garden rosette, or A little Webb.
- **Quick V snip:** drag inward from a long paper edge and release.
- **Angular cut:** tap an edge, place one or two inner corners, and return to that same edge. Preview the warm scrap, then choose **Cut piece** or **Cancel**.
- Pull the **Folded–Open** slider to unfold or refold, pausing anywhere. Fold fully before cutting again.
- Undo restores the last cut. New paper resets the selected preset. Changing presets starts fresh.

The guided cut button and Enter/Space on the focused paper provide keyboard alternatives. Angular examples still require confirmation. Escape cancels a preview. The unfold slider supports arrow keys, Page Up/Down, Home and End. Reduced motion skips automatic transitions while retaining manual control.

## Run locally

No installation, build step, account, API key or service is needed to play:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. The app is plain HTML, CSS and JavaScript, with no external runtime dependencies, analytics or runtime AI.

## Paper and source credit

**A little Webb** is an independent adaptation of the actual [Webb Mirror Paper Snowflake Activity](https://science.nasa.gov/asset/webb/webb-mirror-paper-snowflake-activity/), released December 8, 2021. The activity and template credit **NASA, ESA, CSA, Leah Hustak (STScI)**. This project is not affiliated with or endorsed by those organizations or the credited artist.

The original printable template was rendered and inspected before derivation. Its 30° wedge, thick folded-edge axis, retained shapes and nested hexagonal cutouts inform `webb-data.js`. Tiny drafting deviations are normalized to exact 30° reflection seams. The original template and folding instructions are available from the linked source; they are not redistributed here.

Snow flower and Garden rosette are original Fold & Snip presets and have no NASA provenance. They use right triangular 30° and 22.5° wedges, producing regular hexagonal and octagonal sheets before cuts. The animation uses nested rigid 3D hinge rotations, projected onto the paper stage. It preserves the original fully unfolded geometry; the camera fits the changing shape into view.

## Checks and deployment

With Node.js installed:

```sh
node --check app.js
node geometry.test.cjs
node fold-model.test.cjs
node scripts/build.mjs
```

The geometry tests cover sheet area, reflection seams, source-mask bounds, fully folded and unfolded endpoints, rigid panel lengths at intermediate positions, fixed crease axes and angular-path bounds. Local browser QA before publication included 56 cross-preset interaction assertions plus real pointer/keyboard interactions and visual inspection at desktop, 390px and 320px widths. Physical touch hardware and Safari/Firefox have not been tested.

GitHub Actions runs these checks on pull requests. On `main`, Pages deploys an explicit allowlist of the six runtime files plus `.nojekyll` and a generated `version.json` identifying the deployed commit. Tests, documentation, local source material and screenshots are not part of the deployed artifact.

## Prototype bounds

Cuts are bounded V notches or short same-edge angular paths with one or two inner corners. They are placed with taps/clicks rather than a freehand stroke. A 300 × 175 raster material check rejects empty cuts, multiple scraps and newly disconnected paper components; tiny raster components are ignored, so this is not an exact vector topology proof. Some cuts on the narrow Webb lattice are intentionally rejected.

There is no thickness/collision or fragment-physics simulation, persistence, export, audio, or undo history across preset switches. Colour choices are hidden in the compact phone layout. No backend or paid services are required.
