# Apptronik Apollo — Visual Reference

## Source

All assets sourced from https://apptronik.com/apollo

## Specifications

| Spec | Value |
|------|-------|
| Height | 5'8" (173 cm) |
| Weight | 160 lbs (73 kg) |
| Payload | 55 lbs (25 kg) |
| Runtime | 4 hours per battery pack |
| Designation | A01 series |

## Visual Design Analysis

### Color Palette (extracted from reference photos)

| Zone | Color | Hex (approx) | Finish |
|------|-------|---------------|--------|
| Primary body panels | Warm white / light gray | #e8e4de | Matte with slight sheen |
| Chest display | Black OLED screen | #0a0a0a | Glossy glass |
| Accent stripe | Red-orange | #c83c28 | Matte |
| Joint mechanisms | Dark gunmetal | #3a3a3c | Brushed metal |
| Actuators / exposed parts | Silver-chrome | #8a8a8e | Polished metal |
| Hands / grippers | Black rubber | #1a1a1a | Matte textured |
| Head visor / eyes | Dark gray translucent | #4a4a4a | Semi-transparent |
| "A1" badge text | White on black | #ffffff | Screen/printed |
| Feet / soles | Dark gray | #2a2a2a | Matte rubber |

### Body Structure (from photos)

**Head**
- Rounded, helmet-like shape with smooth contours
- Two circular "eye" sensors recessed behind a translucent visor
- "A01" printed on top-rear of head
- Thin red-orange accent line at base of head/neck junction
- Overall friendly, approachable face design

**Torso**
- Upper chest: large black display panel showing "A1" designation
- Below display: "A01.385" serial number, "Apollo" text, Apptronik logo
- Red-orange accent stripe runs along the sides of the torso
- Back: exposed mechanical components, battery pack mounting, ventilation grid
- Three LED status indicators on upper back (visible in back view)
- Emergency stop buttons visible on back

**Arms**
- Upper arms: white panels over mechanical core
- Shoulder joints: visible rotary actuators (chrome/silver)
- Elbows: dark exposed joint mechanisms
- Forearms: mix of white panels and silver mechanical elements
- Wrists: compact rotary joints

**Hands**
- Black multi-finger grippers (not fully anthropomorphic)
- 4-5 finger design with rubber grip surfaces
- Dark construction throughout

**Legs**
- Thighs: large white panels, smooth contours
- Knees: dark mechanical joints (similar to elbows)
- Shins: white panels
- Ankles: compact dark joints
- Feet: dark, relatively compact

### Key Design Language

1. **Contrast principle**: White panels cover the structural body, dark mechanisms are visible at joints — creates a "skeleton inside armor" aesthetic
2. **Friendly face**: The two circular eyes behind the visor give Apollo a non-threatening, almost cartoon-like expression
3. **Industrial + approachable**: The design bridges industrial capability (exposed actuators, rugged joints) with consumer-friendly aesthetics (smooth panels, rounded head)
4. **Red accent**: A single red-orange stripe provides brand accent and visual break between head and torso
5. **Information display**: The chest OLED serves as an identity/status screen

## Photos Inventory

### Reference (for 3D modeling)

| File | View | Use for |
|------|------|---------|
| `photos/apollo-standing-front.png` | 3/4 front view, full body, white BG | **Primary modeling reference** — proportions, panel layout, full body |
| `photos/apollo-back-battery.png` | Back upper body, black BG | **Back detail** — battery, actuators, exposed mechanisms |
| `photos/apollo-hero-shot.png` | Head/shoulders close-up, white BG | **Head detail** — visor, eyes, face geometry, neck |
| `photos/apollo-pedestal.jpg` | Front + back on pedestal, white BG | **Multi-angle** — front and rear simultaneously |

### Context / Scene

| File | Description |
|------|-------------|
| `photos/apollo-with-bin.png` | Apollo holding a bin (shows arm articulation) |
| `photos/apollo-with-boxes.png` | Apollo with Amazon-style boxes |
| `photos/apollo-with-commercial-box.png` | Apollo with commercial package |
| `photos/apollo-delivery-scene.png` | Apollo in delivery scenario |
| `photos/apollo-warehouse-scene.png` | Apollo in warehouse environment |
| `photos/apollo-bin-detail.png` | Close-up of bin/carrying mechanism |
| `photos/apollo-software-suite.png` | Software interface screenshot |
| `photos/apollo-team-photo.jpeg` | Team photo |

### Logos

| File | Description |
|------|-------------|
| `logo/apollo-logo.png` | Apollo product logo |
| `logo/apptronik-text-logo.svg` | Apptronik wordmark |
| `logo/apptronik-footer-logo.svg` | Apptronik compact logo |

## Video References

Available on Apptronik's channels (not downloaded — link for reference only):

| Title | Platform | Description |
|-------|----------|-------------|
| Trailer Unloading | Vimeo | Apollo unloading trailers |
| Machine Tending | Vimeo | Apollo in manufacturing |
| Product Demo | YouTube | General Apollo demonstration |

## Material Zones for 3D Model

Based on visual analysis, Apollo requires **7 distinct materials**:

```
1. body_panels     — Warm white matte plastic (roughness ~0.35, metalness 0)
2. chest_display   — Black glossy glass + emissive for screen content (roughness 0.05)
3. accent_red      — Red-orange matte stripe (roughness 0.5, metalness 0)
4. joint_dark      — Dark gunmetal exposed mechanisms (roughness 0.4, metalness 0.7)
5. actuator_chrome — Silver polished metal (roughness 0.15, metalness 0.9)
6. hands_rubber    — Black matte rubber (roughness 0.85, metalness 0)
7. visor_glass     — Semi-transparent dark glass for head (roughness 0.05, transmission)
```
