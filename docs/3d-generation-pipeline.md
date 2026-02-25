# 3D Robot Generation Pipeline

> Designing a multi-stage pipeline to produce high-quality 3D humanoid models with accurate front AND back, starting from limited reference photos.

---

## The Problem

We have strong reference photos for the **front** of the Apptronik Apollo, but the **back** photo is upper-body only (different framing). Direct multi-image generation fails because:

| Approach | Result | Why it fails |
|----------|--------|-------------|
| Single front photo | Good front, random back | Back is hallucinated with no reference |
| Front + back (different framing) | Deformed model | Concat/fuse modes require matched framing |
| Multiple zoom levels | Limbs merge, body distorts | Model can't reconcile conflicting spatial info |

### Quality Goals

1. **Face/bust accuracy** — the visor, A1 chest display, red accent stripe must be recognizable
2. **Full body consistency** — front and back should look like the same robot, correct proportions
3. **Back accuracy** — mechanical detail, battery pack, A01 marking should be correct (not hallucinated)
4. **Web-ready** — PBR materials, < 30MB GLB, 100-200K triangles

---

## Pipeline Design

### Approach A: Multi-View Diffusion (try first)

Generate consistent multi-view images from a single photo, then feed all views into Rodin Gen-2.

```
                                         +---> front view ──┐
Single front photo ──> Multi-View Model ─+---> back view  ──┤──> Rodin Gen-2 ──> 3D Model
                                         +---> side view  ──┘     (concat mode)
                                         +---> 3/4 view  ──┘
```

**Why this should work:**
- Multi-view diffusion models generate **spatially consistent** views — same distance, framing, lighting
- All outputs share the same "understanding" of the object, so concat mode won't get confused
- The back view will be an informed prediction based on the front, not a random hallucination

**Candidate multi-view models (verified availability, Feb 2025):**

| Model | Platform | Model ID | Output | Cost | Notes |
|-------|----------|----------|--------|------|-------|
| **Era3D** | **fal.ai** | `fal-ai/era-3d` | 6 views + normal maps | Free tier / ~$0.05 | Explicit front/back. Best first try. |
| **Zero123++** | Replicate | `jd7h/zero123plusplus` | 6 views (3x2 grid) | $0.074/run | Fixed camera ring (30/90/150/210/270/330). |
| **Wonder3D** | Replicate | `adirik/wonder3d` | 6 views + normals + GLB | ~$0.30-0.50 | Also outputs direct 3D mesh. |
| **TripoSR** | fal.ai | `fal-ai/triposr` | Direct GLB mesh | $0.07/run | Ultra fast (<0.5s), low detail. |
| **Hunyuan3D-2mv** | fal.ai | `fal-ai/hunyuan3d/v2/multi-view` | Direct GLB mesh | $0.16-0.48 | Needs front/back/left inputs (chicken-and-egg). |
| **Trellis Multi** | fal.ai | `fal-ai/trellis/multi` | Direct GLB mesh | TBD | Accepts multiple images. |

**Recommended first try: Era3D on fal.ai**
- Already have FAL_KEY configured
- Explicitly generates front, back, left, right views + normal maps
- Normal maps give Rodin better geometry guidance
- Free tier available on fal.ai

**Pipeline steps:**

1. **Generate views**: Feed `apollo-standing-front.png` into Zero123++/Era3D
2. **Review outputs**: Check that back view looks plausible, all views have consistent framing
3. **Select best views**: Pick front + back (+ optionally sides) from the generated set
4. **Generate 3D**: Feed selected views into Rodin Gen-2 concat mode
5. **Optimize**: gltf-transform simplify + resize pipeline

**Expected cost**: $0.05 (multi-view) + $0.40 (Rodin) = **$0.45/attempt**

---

### Approach B: Iterative Refinement (fallback)

Use the best single-image model (v7) as a starting point, render its back, correct it with AI, then regenerate.

```
Front photo ──> Rodin Gen-2 ──> Base 3D ──> Render back view ──> AI img2img ──> Corrected back
                                                                      ↑
                                                              Real back photo
                                                              (style reference)

Then: Front photo + Corrected back ──> Rodin Gen-2 ──> Final 3D
```

**Pipeline steps:**

1. **Start with v7** (best current model, seed 777)
2. **Render the back**: Use Three.js offscreen render or Blender CLI to capture a clean back-view image from the 3D model
3. **AI correction**: Use img2img (FLUX, SDXL) with the real `apollo-back-battery.png` as style/detail reference to fix hallucinated details on the rendered back
4. **Match framing**: The rendered back will naturally have the same framing as the front (both come from the same 3D model)
5. **Regenerate**: Feed original front + corrected back into Rodin Gen-2 concat mode
6. **Iterate**: If still not right, repeat from step 2 with the new model

**Expected cost**: $0.40 (render is free) + ~$0.05 (img2img) + $0.40 (Rodin) = **$0.85/attempt**

**Pros**: More control over the back details, uses real reference
**Cons**: More steps, requires img2img tuning, may accumulate artifacts across iterations

---

### Approach C: Direct Multi-View 3D Generation (alternative)

Skip Rodin entirely. Use a model that natively handles multi-view → 3D.

```
Front photo ──> Zero123++ ──> 6 views ──> Hunyuan3D-2mv ──> 3D Model
```

**Candidate models:**
- **Hunyuan3D-2mv**: Tencent's multi-view variant, designed for consistent multi-view input
- **InstantMesh**: Open source, takes multi-view images and produces mesh directly
- **LGM (Large Gaussian Model)**: Fast Gaussian splatting from multi-view

**Pros**: Single pipeline, no Rodin dependency, potentially cheaper
**Cons**: Less tested for hard-surface mechanical models, quality ceiling may be lower than Rodin

---

## Implementation Plan

### Phase 1: Multi-View Generation (Approach A)

**Step 1**: Research and select multi-view model
- Test Zero123++ and Era3D on `apollo-standing-front.png`
- Evaluate: back view plausibility, framing consistency, detail preservation (face/visor)
- Available on fal.ai or Replicate

**Step 2**: Generate multi-view set
- Run selected model
- Save all generated views
- Pick best front + back (minimum), add sides if available and clean

**Step 3**: Feed into Rodin Gen-2
- Upload selected views in concat mode
- Test with seed 777 (our best seed so far)
- Compare with v7 (single-image baseline)

**Step 4**: Evaluate and iterate
- If back is accurate → success, proceed to optimization
- If back is better but not perfect → try Approach B refinement on this model
- If no improvement → try Approach C or different multi-view model

### Phase 2: Quality Refinement

Once we have a structurally sound model:
- **Face detail**: May need higher-res generation (HighPack 4K textures at $1.20/gen)
- **Texture correction**: Use texture inpainting for specific details (A1 display, red stripe)
- **Mesh cleanup**: Blender for any remaining artifacts

### Phase 3: Production Pipeline

For future robots (not just Apollo):
```bash
# 1. Multi-view generation
node scripts/generate-multiview.mjs --input photo.png --model era3d

# 2. 3D generation from views
node scripts/generate-3d.mjs --views front,back,left,right --engine rodin --seed 777

# 3. Post-processing
npx @gltf-transform/cli simplify model.glb model-s.glb --ratio 0.35
npx @gltf-transform/cli resize model-s.glb model-web.glb --width 2048 --height 2048
```

---

## Cost Tracking

| Version | Engine | Mode | Images | Seed | Cost | Result |
|---------|--------|------|--------|------|------|--------|
| v1 | Rodin Gen-2 | concat | 3 | 42 | $0.40 | Deformed |
| v2 | Rodin Gen-2 | single | 1 | 42 | $0.40 | Good (baseline) |
| v3 | Rodin Gen-2 | concat | 2 | 42 | $0.40 | Comparable to v2 |
| v4 | Rodin Gen-2 | concat | 2 | 42 | $0.40 | Deformed |
| v5 | Rodin Gen-2 | fuse | 2 | 42 | $0.40 | Deformed |
| v6 | Rodin Gen-2 | single | 1 | 100 | $0.40 | Good |
| v7 | Rodin Gen-2 | single | 1 | 777 | $0.40 | Best so far |
| **Total** | | | | | **$2.80** | |

---

## Sources

- [Era3D on fal.ai](https://fal.ai/models/fal-ai/era-3d) — Multi-view + normals, free tier
- [Zero123++ on Replicate](https://replicate.com/jd7h/zero123plusplus) — 6 views, $0.074/run
- [Wonder3D on Replicate](https://replicate.com/adirik/wonder3d) — Views + normals + direct GLB
- [TripoSR on fal.ai](https://fal.ai/models/fal-ai/triposr/api) — Ultra fast $0.07 direct mesh
- [Hunyuan3D Multi-View on fal.ai](https://fal.ai/models/fal-ai/hunyuan3d/v2) — Needs 3 input views
- [Trellis Multi on fal.ai](https://fal.ai/models/fal-ai/trellis/multi) — Multi-image 3D
- [Era3D paper](https://penghtyx.github.io/Era3D/) — High-Resolution Multiview Diffusion
- [Zero123++ paper](https://arxiv.org/abs/2310.15110) — Consistent multi-view generation
- [SV3D paper (Stability AI)](https://stability.ai/research/sv3d) — Orbital video from single image
