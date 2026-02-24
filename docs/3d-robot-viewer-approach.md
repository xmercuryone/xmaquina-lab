# 3D Robot Viewer — Approach Document

## Objective

Build interactive 3D viewers for popular humanoid robots, starting with the **Apptronik Apollo**. The viewer should achieve a premium, polished look by applying the PBR rendering techniques proven in the SorareCard3D prototype.

---

## Part 1: Lessons from SorareCard3D

### Architecture Overview

The Sorare card viewer loads a GLTF model exported from Blender containing 5 meshes (`card_front`, `card_back`, `case`, `case_logo_left`, `case_logo_right`) with 4 PBR materials and 4 textures. The scene is rendered in a React Three Fiber `<Canvas>` with ACES Filmic tone mapping and a studio environment map.

### The Holographic Formula

The card's holographic rainbow effect is not a custom shader. It emerges from standard PBR when three conditions align:

1. **Low roughness (0.1)** — creates mirror-like reflections
2. **Normal map** — perturbs surface normals so each micro-area reflects a different direction
3. **Multiple light sources** — provide different colors/angles to reflect

As the card tilts, reflection angles shift at different rates across the surface (due to the normal map), producing a rainbow sweep.

### Material Strategy

| Material | Target | Roughness | Metalness | Textures | Purpose |
|----------|--------|-----------|-----------|----------|---------|
| Material_0 | card_front | 0.1 | 0 | Diffuse + Normal | Holographic face |
| Material_1 | card_back | 0.1 | 0 | Diffuse + Normal | Holographic back |
| Node | case | 0.0 | 0 | Solid #ffc425 | Gold mirror frame |
| STL_material | case logos | 0.5 | 0.5 | Solid #8d5b1a | Brushed bronze logos |

Key insight: the card uses **zero metalness** on its main surfaces. The reflective look comes entirely from low roughness + environment map, not from metalness. This is important — metalness darkens the diffuse, which would hide the card artwork.

### Lighting Rig (7 lights)

| Type | Position | Intensity | Color | Role |
|------|----------|-----------|-------|------|
| Ambient | — | 1.7 | #ffffff | Global fill |
| Spot | [2, 3, 4] | 3.0 | #ffffff | Top-right key |
| Spot | [-2, 3, 4] | 2.5 | #ffffff | Top-left fill |
| Spot | [2, -2, 3] | 2.0 | #fff5e0 | Bottom-right warm |
| Spot | [-2, -2, 3] | 2.0 | #fff5e0 | Bottom-left warm |
| RectArea | [0, 0, 3] | 1.5 | #ffffff | Front diffuse panel |
| RectArea | [0, 0, -3] | 0.8 | #ffe8c0 | Back warm panel |

Design rationale: the 4 spot lights provide directional highlights that shift as the card rotates. The 2 rect area lights fill in broad, soft illumination. Warm tones on the lower and back lights add depth.

### Renderer Settings

- Tone mapping: `THREE.ACESFilmicToneMapping` (cinematic highlight rolloff)
- Exposure: 1.0
- Color space: `THREE.SRGBColorSpace`
- Antialiasing: enabled
- DPR: [1, 2] (retina support)

### Interaction Model

- Pointer drag to rotate with lerp smoothing (factor 0.12)
- Pointer capture for uninterrupted drag
- No orbit controls — constrained to tilt

---

## Part 2: What Transfers to a Robot Viewer

### Techniques that apply directly

| Technique | Card implementation | Robot adaptation |
|-----------|-------------------|------------------|
| GLTF model loading | `useGLTF` from drei | Same — load robot .glb |
| PBR materials with env map | `envMapIntensity: 1.0` | Same — essential for realism |
| Studio environment map | `<Environment preset="studio" />` | Same — studio works well for product shots |
| ACES Filmic tone mapping | Prevents blown-out highlights | Same — critical for white robot panels |
| Lerp-smoothed rotation | `lerp(current, target, 0.12)` | Same — smooth feel |
| GLTF preloading | `useGLTF.preload()` | Same — avoids loading flash |

### Techniques that need adaptation

| Technique | Card approach | Robot needs |
|-----------|--------------|-------------|
| Lighting | Flat object, front-facing rig | Full 3D form, hemisphere lighting + rim light |
| Ambient intensity | 1.7 (high, for a flat reflective surface) | ~0.3-0.5 (lower, to preserve shadow contrast on 3D form) |
| Interaction | Drag-to-tilt (constrained) | Orbit controls (full 360 viewing) |
| Camera | Fixed at z=0.22, looking at origin | Dynamic, further back, with zoom |
| Normal maps | Creates holographic rainbow effect | Creates panel seam detail, not holographic |

### Techniques that don't transfer

- The holographic effect (low roughness + normal map = rainbow) is specific to flat, card-like surfaces. On a 3D robot, the same settings just produce a glossy plastic look — which is actually what we want for Apollo's white panels.

---

## Part 3: Apptronik Apollo — Material Zones

Apollo's body has distinct visual zones, each requiring a different PBR material.

### Zone Breakdown

| Zone | Parts | Roughness | Metalness | Texture approach | Visual target |
|------|-------|-----------|-----------|-----------------|---------------|
| **White body panels** | Torso, upper arms, thighs, shins | 0.15 | 0.0 | White diffuse + normal map with panel lines | Glossy injection-molded plastic |
| **Dark joints** | Elbows, knees, hips, shoulders | 0.4 | 0.7 | Dark gray (#2a2a2a) diffuse | Exposed actuators, machined aluminum |
| **Visor / head screen** | Head face area | 0.05 | 0.0 | Emissive material, blue-green glow | LED display behind glass |
| **Metallic frame** | Spine, structural members | 0.2 | 0.9 | Brushed metal normal map | Anodized aluminum |
| **Rubber / grip** | Hands, feet soles | 0.8 | 0.0 | Dark matte (#1a1a1a) | Textured rubber |
| **Accent rings** | Joint accent bands | 0.1 | 0.0 | Solid brand color | Colored plastic highlights |

### Material relationships to Sorare card

- **White body panels** are closest to `Material_0` / `Material_1` (low roughness, zero metalness, diffuse + normal). Instead of holographic rainbow, we get clean glossy plastic with subtle panel detail.
- **Dark joints** are closest to `STL_material` (mid roughness, mid metalness). The exposed mechanism look.
- **Visor** is new — requires `MeshStandardMaterial` with `emissive` and `emissiveIntensity` properties.
- **Metallic frame** has no card equivalent — high metalness for bare metal appearance.

---

## Part 4: Lighting for a 3D Humanoid

### Adapted Rig (8 lights)

The card's rig is optimized for a flat, front-facing object. A humanoid needs full-surround lighting with emphasis on form definition.

| Type | Position | Intensity | Color | Role |
|------|----------|-----------|-------|------|
| Ambient | — | 0.4 | #ffffff | Subtle global fill (low to preserve shadows) |
| Spot (key) | [3, 5, 4] | 2.5 | #ffffff | Main key light, high right |
| Spot (fill) | [-3, 3, 4] | 1.5 | #e8f0ff | Cool fill light, high left |
| Spot (back-right) | [3, 2, -3] | 1.5 | #fff5e0 | Warm back light for depth |
| Spot (back-left) | [-3, 2, -3] | 1.0 | #fff5e0 | Secondary back fill |
| Spot (rim) | [0, 4, -4] | 2.0 | #ffffff | Rim/hair light for silhouette edge |
| RectArea (front) | [0, 1, 5] | 1.0 | #ffffff | Soft front fill |
| RectArea (ground) | [0, -2, 0] | 0.3 | #e0e8ff | Simulated ground bounce |

### Key differences from card rig

1. **Lower ambient** — 0.4 vs 1.7. The card needs high ambient because it's flat and most of its surface faces the camera. A 3D form needs shadows to show depth.
2. **Rim light added** — Critical for humanoid silhouette. Without it, the robot's outline blends into the dark background.
3. **Ground bounce** — A downward-facing rect area light simulates light bouncing off the floor, filling in the underside of arms and chin.
4. **Wider distribution** — Lights placed in a hemisphere rather than clustered in front.

---

## Part 5: Interaction Design

### Primary: Orbit Controls

Replace the card's drag-to-tilt with full orbit controls from drei:

```
<OrbitControls
  enableZoom={true}
  enablePan={false}
  minDistance={1.5}
  maxDistance={4}
  minPolarAngle={Math.PI * 0.2}   // prevent going under the floor
  maxPolarAngle={Math.PI * 0.75}  // prevent going directly overhead
  autoRotate={true}
  autoRotateSpeed={0.5}
  dampingFactor={0.08}
  enableDamping={true}
/>
```

Auto-rotate stops when the user interacts, resumes after idle timeout.

### Optional: Part highlighting

On hover/click of a body section, slightly increase emissive on that zone's material and show an info tooltip. This could be a later enhancement.

### Optional: Pose presets

Pre-baked rotation states that animate the robot to specific display poses (standing, walking, reaching). Requires skeletal animation in the GLTF — future scope.

---

## Part 6: Obtaining the 3D Model

### Option A: Primitive-based prototype (recommended first step)

Build Apollo's proportions from Three.js geometry primitives:

- **Head**: RoundedBox + emissive plane for visor
- **Torso**: Tapered RoundedBox
- **Arms/Legs**: Cylinder chains with sphere joints
- **Hands/Feet**: Simplified box shapes

Advantages: fast to build, easy to iterate on materials and lighting, no external dependencies. Ship it as a "stylized" viewer while working on a detailed model.

### Option B: AI-generated mesh

Use reference photos of Apollo with a text/image-to-3D tool (Meshy, Tripo3D, Rodin Gen-2) to generate a starting mesh. Clean up in Blender: fix topology, separate into material zones, UV unwrap, export as GLTF.

Expected effort: 2-4 hours for generation + cleanup.

### Option C: Manual modeling

Model Apollo in Blender from reference photos. Most accurate result but highest effort.

Expected effort: significant, depending on detail level.

### Recommended path

Start with **Option A** to validate the viewer infrastructure (materials, lighting, interaction, page routing). Then upgrade to **Option B or C** when a proper mesh is ready — the viewer code stays the same, only the model file changes.

---

## Part 7: Component Architecture

```
src/
  components/
    SorareCard3D.tsx              # Existing card viewer
    robots/
      RobotViewer3D.tsx           # Generic robot viewer wrapper (Canvas, controls, lighting)
      RobotLighting.tsx           # Reusable 8-light humanoid rig
      ApolloModel.tsx             # Apollo-specific: loads model, applies materials
  pages/
    CardPage.tsx                  # Existing
    RobotsPage.tsx                # Gallery grid of all robots
    RobotDetailPage.tsx           # Single robot viewer + specs
  public/
    assets/
      sorare/                     # Existing card assets
      robots/
        apollo/
          apollo.glb              # Model file
          body-diffuse.png        # White panel texture
          body-normal.png         # Panel seam normal map
          metal-normal.png        # Brushed metal texture
```

### Reuse from SorareCard3D

- Canvas configuration (tone mapping, color space, DPR, antialiasing)
- Environment map setup
- Lerp utility
- GLTF loading and preloading pattern
- Material enhancement loop (`scene.traverse` to set `envMapIntensity`)

### New infrastructure

- `RobotLighting` — extracted and parameterized lighting rig
- `RobotViewer3D` — generic wrapper that accepts any robot model component
- Orbit controls instead of manual pointer rotation
- Route params for `/robots/:slug`

---

## Part 8: Future Robots

The architecture should support adding new robots by:

1. Adding a model file to `public/assets/robots/<name>/`
2. Creating a `<Name>Model.tsx` component that loads the GLTF and applies robot-specific materials
3. Adding an entry to a robots registry (name, slug, model component, description)

Potential robots after Apollo:

- **Figure 02** — similar white-panel aesthetic
- **Tesla Optimus (Gen 2)** — more metallic/industrial
- **Boston Dynamics Atlas (Electric)** — colorful panels, different proportions
- **Unitree H1** — dark, angular, sport-industrial look
- **1X NEO** — soft, fabric-covered, very different material challenge

Each robot's material setup will differ, but the viewer infrastructure (Canvas, lighting, controls, environment) stays shared.
