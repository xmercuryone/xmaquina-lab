# Apollo 3D Model — Generation Test Log

## v1 — 3 photos, concat mode (DEFORMED)

- **Date**: 2026-02-24
- **Engine**: Rodin Gen-2 via fal.ai ($0.40)
- **Input**: 3 images (standing front + back battery + hero head)
- **Settings**: 500K Triangle, PBR, seed 42
- **Result**: Model deformed — legs merged, arms fused. Caused by mixing different zoom levels and backgrounds (full body white BG, upper body black BG, head close-up white BG).
- **Lesson**: Concat mode requires consistent framing, distance, and background across all images.

## v2 — Single front photo (BETTER)

- **Date**: 2026-02-24
- **Engine**: Rodin Gen-2 via fal.ai ($0.40)
- **Input**: 1 image (apollo-standing-front.png)
- **Settings**: 500K Triangle, PBR, seed 42
- **Result**: Much better proportions. Full body with proper limb separation. Back is hallucinated (no reference). Some smoothing on details.
- **Lesson**: Single high-quality image produces more coherent results than mismatched multi-image.

## v3 — Front + back (pedestal split), concat mode

- **Date**: 2026-02-24
- **Engine**: Rodin Gen-2 via fal.ai ($0.40)
- **Input**: 2 images — standing front (full body, white BG) + pedestal back crop (full body back view, white BG)
- **Settings**: 500K Triangle, PBR, seed 42
- **Result**: Better back definition than v2. Front detail preserved (A1 chest, red accent). Some arm artifact from the pedestal crop bleeding into the back image. Proportions slightly off vs v2. Overall comparable to v2 — the back is more accurate but the front lost some crispness.
- **Lesson**: Pedestal back crop still had the other robot's arm bleeding in, which introduced noise. Need cleaner isolated back view for best results.

## v4 — Front + clean back, concat mode (DEFORMED)

- **Date**: 2026-02-25
- **Engine**: Rodin Gen-2 via fal.ai ($0.40)
- **Input**: 2 images — standing front (full body, white BG) + back-battery with black BG removed (upper body only, white BG)
- **Settings**: 500K Triangle, PBR, seed 42, concat mode
- **Result**: Severely deformed. The framing mismatch (full body front vs upper body back) confused the model.
- **Lesson**: Even with clean backgrounds, concat mode requires matching body coverage. Full body + upper body = dysmorphism.

## v5 — Front + clean back, fuse mode (DEFORMED)

- **Date**: 2026-02-25
- **Engine**: Rodin Gen-2 via fal.ai ($0.40)
- **Input**: Same as v4 (standing front + clean upper body back)
- **Settings**: 500K Triangle, PBR, seed 42, fuse mode
- **Result**: Same dysmorphism as v4. Fuse mode did not solve the framing mismatch.
- **Lesson**: Fuse mode is for blending features from different objects, not for handling different framings of the same object. Same framing requirement as concat.

## v6 — Single front photo, seed 100

- **Date**: 2026-02-25
- **Engine**: Rodin Gen-2 via fal.ai ($0.40)
- **Input**: 1 image (apollo-standing-front.png)
- **Settings**: 500K Triangle, PBR, seed 100
- **Result**: Good proportions, different back hallucination than v2. Comparable quality.

## v7 — Single front photo, seed 777 (BEST SO FAR)

- **Date**: 2026-02-25
- **Engine**: Rodin Gen-2 via fal.ai ($0.40)
- **Input**: 1 image (apollo-standing-front.png)
- **Settings**: 500K Triangle, PBR, seed 777
- **Result**: Best overall result. Good proportions, decent front detail. Back still hallucinated but acceptable shape.
- **Lesson**: Seed variation on single-image input is the most reliable way to iterate. Back remains the core unsolved problem.

---

## Key Findings

1. **Single front photo is the only reliable input method** — multi-image always breaks unless views have identical framing
2. **Concat mode** requires: same body coverage, same distance, same background, same angle type
3. **Fuse mode** does NOT fix framing mismatches — it's for blending different objects
4. **Seed variation** is cheap ($0.40/run) and produces meaningfully different results
5. **The back is always hallucinated** from a single front view — this is the fundamental limitation
6. **Next step**: Multi-view diffusion pipeline (see `docs/3d-generation-pipeline.md`)
