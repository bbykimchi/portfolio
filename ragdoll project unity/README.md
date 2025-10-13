# Ragdoll Physics + Animation (Unity)

A course project for **DH2323 Computer Graphics and Interaction** focused on integrating Unity’s ragdoll physics with character animation, emphasizing object-oriented design and practical data-structure use. This is a snapshot taken 2025-10-13 for showcase purposes; no changes have been made to the code.

## Summary
We implemented a controllable character system that:
- Toggles between keyframed animation and physical ragdoll on demand.
- Performs recovery (reverse ragdoll) using two stand-up animation paths (face-up / face-down) chosen from runtime pose analysis (hip orientation).
- Resets bone transforms to ensure a stable, natural transition into recovery animations.
- Propagates ragdoll-on-impact to nearby characters via collision mediation and thresholding to avoid false triggers.
- Provides a runtime UI to spawn/despawn mannequins for quick testing and repeatable scenarios.

## What We built
**Classes & Scripts (`Assets/Scripts`)**
- `Mannequin` — single, cohesive controller implementing the state machine (Walking, Ragdoll, ResettingBones, StandingUp), ragdoll enable/disable, bone reset & alignment, recovery selection, and collision handling.
- `RagdollBoneCollisionProxy` — lightweight per-bone proxy that forwards `OnCollisionEnter` to the owning `Mannequin`.
- `MannequinManagerUI.cs` - runtime UI for adding/removing characters to stress-test collisions and recovery.
- `Shoot.cs` - handles triggering ragdoll physics for mannequins (on mouse click).

**Runtime Data**
- `Transform[] _bones` (rooted at hips) enumerating all bones.
- `BoneTransform[]` snapshots (`Position`, `Rotation`) for:
  - face-up stand-up pose
  - face-down stand-up pose
  - current ragdoll pose (for interpolation)
- State enum: `Walking`, `Ragdoll`, `ResettingBones`, `StandingUp`.

## Key Technologies
- **Language & Engine:** C#, Unity (Animator/Mecanim, Rigidbody/Collider/Joint, Physics)
- **Patterns:** Single Responsibility, explicit interfaces, state enums; data-oriented hot paths for collision checks
- **Data Structures:** `Dictionary<Transform, BoneData>`, arrays/lists for pose snapshots, lightweight structs for collision events, enums for state/mode
- **Debug/Tools:** Runtime UI to spawn/despawn agents

## Technical Highlights
- **Mode Toggle:** Scripted switch between Animator-driven motion and physics simulation (Unity ragdoll colliders & rigidbodies).
- **Recovery (Reverse Ragdoll):**
  - Detect hip orientation to select face-up vs face-down stand-up clips.
  - **Partial-clip entry:** start later in the animation for better continuity.
  - **Transform reset:** restore bone local rotations/positions before blending to avoid twisting.
- **Collision-Driven Ragdoll Propagation:**
  - Compute approximate force and direction from collisions; determine impacted limb.
  - Apply energy/impulse thresholds to prevent cascades from minor contacts.

## How to Run
1. Open the Unity project.
2. Load the demo scene (RagdollScene.unity) with the mannequin setup.
3. Enter Play Mode:
   - Use the UI to spawn/despawn mannequins.
   - Toggle ragdoll/animation on a selected mannequin.
   - Observe collision-driven ragdoll propagation and recovery behavior.

## Results & Media

## Credits & Asset Attribution
- Built in collaboration with another student (co-author: Malcolm Helasterä).
- Several assets (animations, prefabs, scene content) were imported from third-party sources because 3D modeling/animation was not the project focus. These assets are **not** original work.
- All third-party assets remain the property of their respective owners.
