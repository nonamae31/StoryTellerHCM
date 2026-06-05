---
name: storyteller-hcm
description: Work on the StoryTellerHCM repo, a Next.js educational drag-and-drop story game about Ho Chi Minh and political theory chapters. Use when Codex is asked to inspect, edit, run, validate, or clean assets for this project, especially chapter pages under src/app/chapter/*, Chapter 5 gameplay/assets, localStorage chapter completion, Cloudinary scene images, generated transparent sprites, UI/animation behavior, or npm/Next.js build and dev-server tasks.
---

# StoryTellerHCM

## Project Shape

- Treat this as a Next.js app using React, TypeScript, Tailwind classes, Framer Motion, and lucide-react.
- Main app files:
  - `src/app/page.tsx`: home/book chapter list.
  - `src/app/chapter/layout.tsx`: shared chapter frame.
  - `src/app/chapter/{n}/page.tsx`: chapter gameplay pages.
  - `src/data/gameData.ts`: book/chapter metadata and shared image URLs.
  - `public/BookImage/Story5/generated/`: local transparent sprites used by Chapter 5.
- Chapter pages are standalone. Keep edits scoped to the requested chapter unless the user asks for cross-chapter changes.

## Working Rules

- Preserve the current drag-and-drop template unless the user explicitly asks for a redesign.
- Use Cloudinary URLs directly for scene/background images when the user provides them.
- Use `public/BookImage/Story5/generated/` only for local sprites or assets that must be transparent/cut out.
- Do not keep temporary downloaded images, contact sheets, or inspection files in the repo. If needed, put them under `.agent/` and delete them before finishing.
- Do not delete generated sprites referenced by `src/app/chapter/5/page.tsx`.
- Keep feedback/hints non-spoiling unless the user asks for easier gameplay.
- Final image/panel success effects are acceptable; avoid looping character animation when the user wants only final-image effects.

## Chapter 5 Notes

- Current route: `/chapter/5`.
- Completion is stored in `localStorage.completedChapters` with chapter number `5`.
- Win flow should let the player look back at the full solved board before returning home.
- Scene images are mostly Cloudinary; character sprites are local generated PNGs with alpha.
- If adding or replacing a character sprite:
  - Ensure the image has real transparency, not a white/checker background.
  - Verify alpha with an image tool or script.
  - Map the sprite by both `sceneId` and `characterId` so dragging `Hồ Chí Minh` never displays a `Đồng chí` sprite, and vice versa.
- If adding a new draggable character, update:
  - `CharacterId`
  - `CHARACTERS`
  - scene `characterImages`
  - any `STEPS` that require that character
  - character count limits in drop handling

## Validation

Run these before reporting completion after code edits:

```powershell
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
npm run build
npm run lint -- src/app/chapter/5/page.tsx
```

For non-Chapter 5 edits, lint the touched file or run `npm run lint` if scope is broad.

Common lint warning: Next may warn about `<img>` instead of `<Image />`. Treat this as non-blocking unless the user asks for image optimization.

## Running The App

- Preferred URL: `http://127.0.0.1:3000/chapter/5` or `http://localhost:3000/chapter/5`.
- If `npm` is not found, prepend `C:\Program Files\nodejs` to `PATH`.
- If the dev server is already running, do not start another one; check the route first.
- If starting dev mode and Turbopack causes issues, use webpack explicitly:

```powershell
$cwd = (Resolve-Path .).Path
$out = Join-Path $cwd ".agent\dev-server.out.log"
$err = Join-Path $cwd ".agent\dev-server.err.log"
New-Item -ItemType Directory -Force -Path (Join-Path $cwd ".agent") | Out-Null
$node = "C:\Program Files\nodejs\node.exe"
$nextCli = Join-Path $cwd "node_modules\next\dist\bin\next"
Start-Process -FilePath $node -ArgumentList @($nextCli, "dev", "--webpack", "-p", "3000") -WorkingDirectory $cwd -WindowStyle Hidden -RedirectStandardOutput $out -RedirectStandardError $err -PassThru
```

Then verify:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:3000/chapter/5" -UseBasicParsing -TimeoutSec 10
```
