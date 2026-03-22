# Open-Source Planner References

This folder contains reference source files copied from local `tmp` imports so we can adapt interaction patterns quickly in small, maintainable modules.

## Sources

- `mj-react-planner` (from `tmp/imports/mj-react-planner-2.0.7/package/src`)
  - copied viewer files:
    - `viewer2d/grid.jsx`
    - `viewer2d/snap.jsx`
    - `viewer2d/rulerX.jsx`
    - `viewer2d/rulerY.jsx`
    - `viewer2d/guides.jsx`
    - `viewer2d/scene.jsx`
    - `viewer2d/viewer2d.jsx`
  - copied utility files:
    - `utils/snap.js`
    - `utils/snap-scene.js`
    - `utils/geometry.js`
    - `utils/math.js`
    - `utils/events.js`

- `ej2-showcase-react-floor-planner` (from `tmp/ej2-showcase-react-floor-planner/src/script`)
  - copied scripts:
    - `utilitymethods.js`
    - `events.js`
    - `selector.js`
    - `palettes.js`
    - `dropdowndatasource.js`

## Usage Note

These files are stored as reference inputs. Do not import them directly into production routes without adapting to this repo's architecture, typing, and style tokens.
