# Siempre — digital Día de Muertos altar

A mobile-first, frontend-only editor for a blank three- or seven-level altar. No account, backend, analytics, or photo upload. Photos and object positions are saved in IndexedDB on the current browser and origin. Clearing site data removes them.

## Run

Run `npm run dev`, then open http://localhost:5173. Requires Python 3; no npm installation is necessary. `npm run check` performs JavaScript syntax checks. No automated tests are included, as requested.

## Use

Choose a structure, add a JPEG/PNG/WebP photo, select a level, and add its available objects. Drag objects within their level. For keyboard placement, choose an object in the list, then use arrow keys on the canvas. Remove selected objects with **Quitar**. Changing structure clears placed objects after confirmation but retains the photo. **Empezar de nuevo** clears the photo too.

Export produces a 1000 × 1100 PNG without selection indicators. File sharing is used only when supported; otherwise the PNG downloads. A website cannot silently save into a phone's gallery: users save the downloaded/shared image using their device's controls.

**Empezar de nuevo** opens a styled confirmation dialog, initially focused on **Conservar mi altar**. Cancel or press Escape to keep the draft unchanged. Only **Sí, empezar de nuevo** clears the photo and placed offerings; the selected structure is retained. Download the image first if you want to keep it.

## GitHub Pages

Publish these static files from the root of the repository's chosen deployment branch using Settings → Pages → Deploy from a branch. All application paths are relative, supporting `https://phyton06.github.io/Altar/`. No workflow, build service, or secrets are required. Publication is intentionally left to the owner.

The service worker caches the local shell after the first successful online visit. Installation availability depends on the browser. Update the cache version in `sw.js` when releasing changed shell files; a waiting worker activates when old tabs close. Google Fonts is optional and falls back to local serif/sans-serif fonts offline.

## Selectors and link previews

Both dropdowns use a coordinated custom listbox. Open with Enter/Space, navigate with arrows or Home/End, confirm with Enter, and cancel with Escape or Tab. A selected level displays its symbolic meaning; choosing an object updates the level and its explanation too.

Open Graph and Twitter card tags are static in `index.html`, pointing to `https://phyton06.github.io/Altar/` and the public 1200 × 630 `social-preview.png`. Change all absolute URLs if deploying under another domain. The image is a generic illustration: local photos and drafts are never embedded in the link. Social crawlers can read the preview only after publication, and platforms may cache older previews.

## Cultural basis and art

The selected arrangement follows [Tec de Monterrey's guide](https://conecta.tec.mx/es/noticias/aguascalientes/arte-y-cultura/guia-para-entender-los-niveles-y-simbolos-del-altar-de), with meanings from [INPI](https://www.gob.mx/inpi/articulos/conoces-el-significado-de-los-elementos-de-una-ofrenda-de-dia-de-muertos). Arrangements vary across families and regions; this is not a universal rule. Three-level numbering is top-down in the UI. The photo on the earthly level, copal on the prayer level, calaveritas alongside food, and unrestricted floral/paper decoration are educational/editorial adaptations.

Decoration SVGs in `art.js` are original detailed illustrations with a coordinated palette, not emoji or generic UI icons. Openclipart's CC0 altar illustration was researched as an asset source, but it is a complete scene rather than an independently draggable coherent object pack; it was not incorporated. No external art license is required for the original illustrations.
