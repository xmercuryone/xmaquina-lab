# AI 3D Model Generation — Tool Research

> Research conducted 2026-02-24 for generating a GLTF model of the Apptronik Apollo humanoid robot.

---

## Recommendation Summary

| Rank | Tool | Score | Best for | Cost |
|------|------|-------|----------|------|
| 1 | **Rodin Gen-2** (via fal.ai) | 9/10 | Best quality, part-based decomposition | **$0.40/gen** |
| 2 | **KREA** (aggregator) | 8.5/10 | Try 4 engines in one UI (Hunyuan3D-2, Tripo, Trellis) | $9/mo |
| 3 | **Hunyuan3D 2.1** (Tencent) | 8/10 | Best free option, dedicated multi-view model | Free (OSS) |
| 4 | **Tripo3D** | 8/10 | Best dev experience, built-in retopology | $12/mo |
| 5 | **Meshy** | 7.5/10 | Best for rapid prototyping iterations | Free tier / $16/mo |
| 6 | **TRELLIS.2** (Microsoft) | 7.5/10 | Best open-source single-image | Free (OSS) |

**Not applicable**: OpenAI 4o (no 3D generation), Google Veo (video only), Luma Genie (text-only, no image input).

---

## Recommended Strategy

### Phase 1 — Rapid prototyping with KREA ($9/mo) or Meshy (free)

Use KREA to compare Hunyuan3D-2, Tripo, and Trellis on the same Apollo reference photos. Alternatively, use Meshy's 100 free credits/month. Validate the Three.js/R3F viewer setup (lighting, materials, orbit controls) before investing in highest quality.

### Phase 2 — Production model with Rodin Gen-2 via fal.ai ($0.40/gen)

Upload 3-5 best reference photos in `concat` multi-image mode via the fal.ai API. The BANG architecture decomposes the robot into separate parts (head, torso, limbs) — ideal for a mechanical humanoid. Export as GLB with PBR textures (HighPack addon for 4K textures at $1.20/gen).

10 generation attempts = $4-12 total — far cheaper than any monthly subscription.

### Phase 3 — Post-processing pipeline

```bash
# 1. Decimate to web-friendly triangle count (target 50-100K)
npx gltf-transform simplify input.glb output.glb --ratio 0.5

# 2. Resize textures to 2K (balance quality vs load time)
npx gltf-transform resize input.glb output.glb --width 2048 --height 2048

# 3. Apply Draco compression for smaller file size
npx gltf-transform draco input.glb output.glb
```

---

## Top 5 Tools — Detailed Analysis

### 1. Rodin Gen-2 (Hyper3D) — hyper3d.ai

**Why it's #1 for Apollo:**
- Part-based decomposition (BANG architecture) treats joints, panels, and actuators as separate coherent parts — exactly how a robot is structured
- `concat` multi-image mode: upload multiple views of the same object for accurate 360 reconstruction
- 4K seamless PBR textures (albedo, roughness, metallic) — November 2025 update eliminated visible seams
- 85-95% accuracy on hard-surface mechanical models

| Attribute | Detail |
|-----------|--------|
| Input modes | Text-to-3D, Image-to-3D, Multi-image up to 5 (concat/fuse) |
| Output | GLB, USDZ, FBX, OBJ, STL with PBR |
| Mesh quality | Clean quad-based, 10B-param BANG model, 2K-500K tris / 4K-50K quads |
| Textures | 1K PBR standard, 4K with HighPack addon |
| Speed | ~2 minutes |
| Pricing | See "Where to access" below |

**Where to access Rodin Gen-2:**

| Platform | Price | Multi-image | API | Notes |
|----------|-------|-------------|-----|-------|
| **fal.ai** (recommended) | **$0.40/gen** ($1.20 w/ HighPack 4K textures) | Yes, up to 5 images | REST API | Best value. Full Gen-2. concat + fuse modes. |
| **Replicate** | Pay per second (~$0.30-0.50) | Yes | REST API | Less documented. |
| **Scenario** | Per platform credits | Yes, concat + fuse | Web UI + API | Good UI with T/A pose toggle, mesh density presets. |
| **Hyper3D direct** | Creator $24/mo (30 credits) / Business $120/mo | Yes | REST API | Official platform. Most features. |
| **ComfyUI** | Free (node plugin) | Yes | Local workflow | Requires Hyper3D API key. |

**Best reference photos to use (up to 5 in concat mode):**
1. `apollo-standing-front.png` — primary (full body, clean BG)
2. `apollo-back-battery.png` — back detail
3. `apollo-hero-shot.png` — head/shoulders close-up

---

### 2. Hunyuan3D 2.1 (Tencent) — Open Source

**Why it ranks high:**
- Completely free, MIT-friendly license
- Dedicated `Hunyuan3D-2mv` model designed for multi-angle inputs
- Full PBR pipeline: albedo, normal, roughness, metallic (up to 4K)
- Physics-grounded material simulation
- Available on Replicate API (~$0.10-0.30/run) without GPU setup

| Attribute | Detail |
|-----------|--------|
| Input modes | Text-to-3D, Image-to-3D, Multi-view (2mv model) |
| Output | OBJ, FBX, GLB with PBR |
| Mesh quality | High detail, ~600K triangles (needs decimation) |
| Textures | 4K PBR with physics-grounded materials |
| Speed | ~30 seconds |
| Pricing | Free (self-hosted) or ~$0.10-0.30/run on Replicate |

**Caveat:** 600K triangle output needs decimation to 50-100K for web use.

---

### 3. Tripo3D — tripo3d.ai

**Why it ranks high:**
- Built-in Tripo Studio: remesh, retopology (8-10 sec), texture editing
- API at $0.20-$0.40/generation — best for programmatic iteration
- Auto mesh-part segmentation outputs labeled components
- Blender integration plugin available

| Attribute | Detail |
|-----------|--------|
| Input modes | Text-to-3D, Image-to-3D, Multi-view |
| Output | OBJ, GLTF/GLB, FBX, STL, USDZ |
| Mesh quality | Clean quad topology, auto-segmented parts |
| Textures | 4K PBR, Magic Brush for local repaint |
| Speed | Seconds (preview) to minutes (refined) |
| Pricing | Free tier, Paid from $12/mo, API $0.20-$0.40/gen |

**Standout feature:** The retopology tool produces web-optimized edge flow in 8-10 seconds, eliminating the need for manual Blender cleanup.

---

### 4. Meshy — meshy.ai

**Why it's the prototyping pick:**
- 100 free credits/month — enough to iterate multiple attempts
- Up to 4 reference images in multi-view mode
- 7 export formats including GLB and BLEND
- Text-to-texture feature useful for re-texturing a base mesh
- Multiple art styles (Realistic, Sculpture, etc.)

| Attribute | Detail |
|-----------|--------|
| Input modes | Text-to-3D, Image-to-3D, Multi-view (up to 4 images) |
| Output | FBX, GLB, OBJ, STL, 3MF, USDZ, BLEND |
| Mesh quality | Good, improved with v6 |
| Textures | PBR with AI texturing |
| Speed | Fast |
| Pricing | Free (100 credits/mo), Pro $16/mo (1000 credits) |

**Caveat:** Output quality is the most variable — 80-90% accuracy on hard surfaces. Great for testing, less reliable for final production.

---

### 5. TRELLIS.2 (Microsoft) — Open Source

**Why it's notable:**
- Completely free, MIT license
- O-Voxel representation preserves sharp features and hard edges
- 4K PBR textures (albedo, roughness, metallic, opacity)
- Blazing fast: 3 seconds at 512^3, 60 seconds at 1536^3

| Attribute | Detail |
|-----------|--------|
| Input modes | Image-to-3D, Text-to-3D |
| Output | GLB, OBJ, FBX, STL, PLY |
| Mesh quality | Sharp features via O-Voxel, up to 1536^3 resolution |
| Textures | 4K PBR |
| Speed | 3-60 seconds |
| Pricing | Free (requires 24GB+ VRAM GPU) |

**Caveat:** Single-image only (no multi-view). Requires A100/H100 GPU for self-hosting.

---

## 6. KREA — krea.ai (Multi-Model Aggregator)

**What it is:**
KREA is not a single 3D model — it's an AI creative platform that bundles **4 different 3D generation engines** under one UI. You pick the model per generation, compare results, and export. This makes it uniquely valuable for our use case: try multiple engines on the same Apollo reference photos without separate accounts.

**Available 3D engines inside KREA:**

| Engine | Strength | Notes |
|--------|----------|-------|
| **Hunyuan3D-2** | Best detail, production-quality PBR | Same Tencent model ranked #2 in our analysis |
| **Hunyuan3D-2mini-Turbo** | Fastest generation | Speed-optimized variant, lower detail |
| **Tripo** | Good for organic shapes | Same engine ranked #3 in our analysis |
| **Trellis** | Stable texture quality | Microsoft's open-source model |

**Key features:**
- Image-to-3D and text-to-3D from a single interface
- Multi-view input support
- Optional PBR materials generation
- Adjustable face count for cleaner meshes
- OBJ and GLTF export formats
- Integrated into KREA's broader creative suite (image gen, video, lipsync)

| Attribute | Detail |
|-----------|--------|
| Input modes | Text-to-3D, Image-to-3D, multi-view |
| Output | OBJ, GLTF |
| Mesh quality | Depends on chosen engine (Hunyuan3D-2 is best) |
| Textures | PBR optional, quality varies by engine |
| Speed | Seconds (Turbo) to ~90 sec (Hunyuan3D-2) |
| Pricing | Free (100 compute units/day), Basic $9/mo (5K units), Pro $35/mo (20K units) |

**Why it matters for Apollo:**
KREA lets us run the same reference photos through Hunyuan3D-2, Tripo, and Trellis side-by-side and pick the best result — all without signing up for three separate services. The Basic plan at $9/mo with 5,000 compute units gives enough credits for significant iteration. And since Hunyuan3D-2 (our #2 ranked engine) is available inside KREA, you get near-top-tier quality at a lower price than Rodin's $24/mo.

**Potential workflow:**
1. Upload Apollo reference photos to KREA
2. Generate with Hunyuan3D-2 (best quality)
3. Generate with Tripo (comparison)
4. Generate with Trellis (comparison)
5. Pick the best result, export as GLTF
6. Post-process with gltf-transform pipeline

**Caveats:**
- KREA is tight-lipped about technical implementation details
- 3D is still a newer feature in their platform (launched April 2025)
- Quality is bounded by the underlying engine — KREA adds convenience, not quality improvements
- Rodin Gen-2 (not available in KREA) still produces the highest quality output — but is now accessible at $0.40/gen via fal.ai, making the cost advantage of KREA less decisive

---

## Tools Evaluated but Not Recommended

| Tool | Reason |
|------|--------|
| **Luma Genie** | Text-only input, no image-to-3D. Cannot use reference photos. Company focus shifted to video. |
| **Stability SF3D** | Single-image only, basic textures. Speed-optimized at expense of quality. |
| **CSM / Cube** | Less mature for hard-surface mechanical models. Lower quality ceiling. |
| **Sloyd** | Template-based — limited if no robot template exists. |
| **OpenAI 4o** | Does not generate 3D models. |
| **Google Veo** | Video generation only, not 3D meshes. |
| **Kaedim** | Enterprise pricing, human-in-the-loop (slow). Overkill for one model. |
| **Neural4D-2.5** | Just announced Feb 2026. Too new to evaluate, but promising "native 3D" approach worth monitoring. |

---

## Reference Photos for Generation

### Use these (clean, isolated, white/black BG):

| File | View | Priority |
|------|------|----------|
| `apollo-standing-front.png` | Full body, 3/4 front | **Primary** |
| `apollo-back-battery.png` | Upper body, rear view | **Secondary** |
| `apollo-hero-shot.png` | Head/shoulders close-up | **Tertiary** |
| `apollo-pedestal.jpg` | Front + back on pedestal | Use with caution (2 instances may confuse tools) |

### Avoid these (contextual scenes, other objects):

- `apollo-delivery-scene.png`
- `apollo-warehouse-scene.png`
- `apollo-with-bin.png`, `apollo-with-boxes.png`, `apollo-with-commercial-box.png`
- `apollo-team-photo.jpeg`
- `apollo-software-suite.png`

---

## Sources

- [Rodin Gen-2 on fal.ai](https://fal.ai/models/fal-ai/hyper3d/rodin/v2) — API pricing, parameters, multi-image support
- [Rodin Gen-2 on Replicate](https://replicate.com/hyper3d/rodin)
- [Rodin on Scenario](https://help.scenario.com/en/articles/rodin-hyper3d-models-the-essentials) — Gen-1 vs Gen-2, mesh density options
- [Hyper3D Gen-2 API Docs](https://developer.hyper3d.ai/api-specification/rodin-generation-gen2) — Official API spec
- [Rodin ComfyUI Integration](https://docs.comfy.org/tutorials/partner-nodes/rodin/model-generation)
- [Rodin Gen-2 Review 2026](https://gaga.art/blog/rodin-gen-2-review/)
- [Comparing 3D Generation Models (Scenario)](https://help.scenario.com/en/articles/comparing-generative-3d-models/) — Hunyuan, Tripo, Rodin, Trellis benchmarks
- [KREA 3D Objects](https://www.krea.ai/3d) — Available engines, features
- [KREA Pricing](https://www.krea.ai/pricing) — Tier breakdown, compute units
- [KREA 3D model breakdown](https://www.threads.com/@libman.studio/post/DH_KOFTogBQ/) — Engine comparison inside KREA
- [Tripo v3.0 Ultra Guide](https://swiftwand.com/en/tripo-v3-ultra-ai-3d-model-generation-text-to-3d-blender-integration-monetization-2026/)
- [Meshy AI Review](https://digitalsoftwarelabs.com/ai-reviews/meshy-ai/)
- [TRELLIS.2 GitHub](https://github.com/microsoft/TRELLIS.2)
- [Hunyuan3D 2.1 GitHub](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1)
- [Best AI 3D Modeling Tools 2026](https://www.travisvermilye.com/ai-3d-modeling/)
