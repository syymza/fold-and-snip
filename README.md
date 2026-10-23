# Fold & Snip

A small paper-cutting playground. Fold virtual paper, make a few cuts, and pull it open to discover the pattern.

**[Play Fold & Snip](https://syymza.github.io/fold-and-snip/)**

## Play

- Pick Hexagon, Octagon, or Webb. Each selector shows the actual uncut sheet folding into the wedge used on the canvas. Hexagon repeats cuts six ways; Octagon repeats them eight ways; Webb starts from the NASA template.
- **Quick V snip:** drag inward from a long paper edge and release.
- **Angular cut:** click a marked edge, place up to four inner corners, and return to that same marked edge. Preview the shaded scrap in place, then choose **Cut piece** or **Cancel**.
- Choose **Reveal pattern** for the surprise, then **Fold & keep cutting** to add more cuts.
- Undo restores the last cut. New paper resets the selected preset. Changing presets starts fresh.

The guided cut button and Enter/Space on the focused paper provide keyboard alternatives. Angular examples still require confirmation. Escape cancels a preview. Backspace on the focused paper removes the last point, and **Back a point** reopens a scrap preview without discarding the shape. Reduced motion reveals or refolds the paper instantly.

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
node angular.test.cjs
node scripts/build.mjs
```

The geometry tests cover sheet area, reflection seams, source-mask bounds, fully folded and unfolded endpoints, rigid panel lengths at intermediate positions, fixed crease axes and angular-path bounds. The browser regression runner checks 54 interaction and rendering assertions, including exact preview/committed-mask equality. Real pointer/keyboard interactions and visual inspection were also completed at desktop, 390px and 320px widths. Physical touch hardware and Safari/Firefox have not been tested.

GitHub Actions runs these checks on pull requests. On `main`, Pages deploys an explicit allowlist of the six runtime files plus `.nojekyll` and a generated `version.json` identifying the deployed commit. Tests, documentation, local source material and screenshots are not part of the deployed artifact.

## Prototype bounds

Cuts are bounded V notches or short same-edge angular paths with up to four inner corners. They are placed with taps/clicks rather than a freehand stroke. Muted edge targets and point markers show valid input. Invalid clicks show a red marker and keep placed points. Full instructions and rejection reasons are available through accessible names and screen-reader status; hover hints explain the icon controls. A 300 × 175 raster material check rejects empty cuts, multiple scraps and newly disconnected paper components; tiny raster components are ignored, so this is not an exact vector topology proof. Some cuts on the narrow Webb lattice are intentionally rejected.

There is no thickness/collision or fragment-physics simulation, persistence, export, audio, or undo history across preset switches. Colour choices are hidden in the compact phone layout. No backend or paid services are required.

## Interaction regression preview

Run the local server and open `tests/browser.html` for browser checks covering direction-changing paths, visible rejection, retained points after interruptions, point recovery, exact preview/commit mask consistency, simple reveal/fold, undo/reset and keyboard alternatives. Synthetic pointer events are used in this runner; real desktop and narrow-layout pointer testing is a separate verification step. Test files are excluded from the Pages artifact.

The interface uses short labels beside the scissors and action icons, with a cut count and a quiet Webb source link. Ivory paper and thin muted edge guides keep attention on the canvas; a finished shape shades the exact scrap in place before confirmation. Preset diagrams use the same wedge and reflected-sheet geometry as the canvas, with short paper labels and accessible names. There is no manual unfolding slider or persistent explanatory copy.
