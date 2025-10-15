# Ragdoll Physics + Animation (Unity)

> A course project for **DH2323 Computer Graphics and Interaction** focused on integrating Unity’s ragdoll physics with character animation, emphasizing object-oriented design and practical data-structure use. This is a snapshot taken 2025-10-13 for showcase purposes; no changes have been made to the code.

## Summary
We implemented a controllable character system that:
- Toggles between keyframed animation and physical ragdoll on demand.
- Performs recovery (reverse ragdoll) using two stand-up animation paths (face-up / face-down) chosen from runtime pose analysis (hip orientation).
- Resets bone transforms to ensure a stable, natural transition into recovery animations.
- Propagates ragdoll-on-impact to nearby characters via collision mediation and thresholding to avoid false triggers.
- Provides a runtime UI to spawn/despawn mannequins for quick testing and repeatable scenarios.

## What We Built
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
- **Patterns:** Single Responsibility, explicit public methods on a cohesive controller; state enums for clarity
- **Data Structures:** `Transform[]` for bone hierarchy + `BoneTransform[]` snapshots (Position, Rotation) for face-up, face-down, and ragdoll poses
- **Debug/Tools:** Runtime UI to spawn/despawn agents (see `MannequinManagerUI.cs`)

## Technical Highlights
- **Mode Toggle:** Scripted switch between Animator-driven motion and physics simulation (Unity ragdoll colliders & rigidbodies).
- **Recovery (Reverse Ragdoll):**
  - Detect hip orientation to select face-up vs face-down stand-up clips.
  - **Bone reset then play:** interpolate bones from ragdoll snapshot to the animation's start pose over       `_timeToResetBones`, then play the stand-up state.
  - **Transform reset:** restore bone local rotations/positions before blending to avoid twisting.
- **Collision-Driven Ragdoll Propagation:**
  - Compute approximate force and direction from collisions; determine impacted limb.
  - Apply energy/impulse thresholds to prevent cascades from minor contacts.

## How to Run
1. Open the Unity project (version 2022.3.57f1).
2. Load the demo scene (RagdollScene.unity) with the mannequin setup.
3. Enter Play Mode:
   - Use the UI to spawn/despawn mannequins.
   - Toggle ragdoll/animation on a selected mannequin.
   - Observe collision-driven ragdoll propagation and recovery behavior.

## Media
<img width="269" height="179.3" alt="ragdoll1" src="https://github.com/user-attachments/assets/92cf6190-875a-4dee-a0d8-0ae9ed2befd1" />
<img width="250" height="166.7" alt="ragdollup1" src="https://github.com/user-attachments/assets/f60edeee-b33b-4967-b8e7-6b6fe1f9282b" /><br/> 


<img width="250" height="166.7" alt="ragdollup2" src="https://github.com/user-attachments/assets/4765f936-a1d6-40b5-aed1-7491cad39db2" />
<img width="265.5" height="176.8" alt="ragdollcollision" src="https://github.com/user-attachments/assets/c28925cb-652d-4238-b2e7-17a647b6bfad" />

https://github.com/user-attachments/assets/5c43480f-e065-47af-b594-38932a9d297b

## Credits & Asset Attribution
- Built in collaboration with another student (co-author: Malcolm Helasterä).
- Several assets (animations, prefabs, scene content) were imported from third-party sources because 3D modeling/animation was not the project focus. These assets are **not** original work.
- All third-party assets remain the property of their respective owners.
