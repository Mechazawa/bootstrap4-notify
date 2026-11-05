# Agent notes

- Checks: `npm run lint`, `npm test`, `npm run typecheck`, `npm run build`. `prepublishOnly` runs lint, tests and build.
- `src/bootstrap-notify.js` is the published ES module. Rollup builds only the UMD files in `dist/`.
- The package has `"type": "module"`, so the UMD file for `require()` must end in `.cjs`. A `.js` file in `dist/` loads as ESM in Node and breaks `require()`.
- The tests run in jsdom with fake timers. jsdom runs no CSS animations, so closing always takes the 600 ms fallback path.
- To test against jQuery 4: `npm install --no-save jquery@4 && npm test`, then `npm install` to restore jQuery 3.
- The original 3.1.5 source is in the commit "Import bootstrap-notify 3.1.5 by Robert McIntosh". Diff against it to see every change.
- `npm run build` copies `index.d.ts` to `index.d.cts` (not tracked in git) so CommonJS users get CommonJS types under `node16` resolution. Edit only `index.d.ts`.
