# Predator-Prey Fish Schooling Simulation (Unity)

A course project for **DD1354 Models and Simulation** focused on implementing boids and simulating predator-prey behavior. This is a snapshot taken on 2025-10-15 for showcase purposes; no changes have been made to the original code.


## Summary
This simulation explores predator-prey dynamics in schooling fish. The school's of fish are implemented using classic Boids. A predator identifies and pursues peripheral prey i.e. those farthest from the school's center of mass. Prey flee the attack, temporarily weakening cohesion and alignment to create confusion. The interaction follows a readable loop:

**detect → select periphery → pursue → escape/cooldown → regroup**


## What We Built
- **Boids:** Implemented a Boids-based schooling system, balancing separation, alignment and cohesion forces. Tuneable forces allow for fast iteration and believable group motion.
- **Peripheral Targeting (Strategy P):** Predator computes the school's center of mass and targets the most *peripheral* prey.
- **Stateful Pursuit Loop:** Target lock for a pursuit window of _N_ seconds, then enters cooldown to allow regrouping.
- **Prey Flee Response:** Prey add a fleeing force when a predator enters detection radius and cohesion/alignment are suppressed while fleeing.
- **Tunable Parameters:** Radii, force weights, pursuit/cooldown timings for fast iteration.
- **Research-backed Basis:** The simulation has been implemented from literature detailing predator behavior. 


## Key Technologies
- **Language & Engine:** C#, Unity
- **AI/Simulation:** Boids steering (separation, alignment, cohesion), neighborhood queries, center of mass calculation, priority-based target selection
- **Design:** Clear separation of **agent logic** (`Boid`) and **orchestration** (`BoidManager`), with data-driven knobs for iteration


## Project Structure
```
Assets/
  Scripts/
    Boid.cs            
    BoidManager.cs     
    Fish.cs
    School.cs
  Scenes/
    SharkSim.unity         # demo scene
ProjectSettings/
...
```

## How to Run
1. Open the Unity project (version 2022.3.57f1).
2. Load the demo scene (SharkSim.unity).
3. Enter Play Mode:
      Tune parameters to observe change in predator-prey behavior.


## Tunable Parameters
- `CohesionForceFactor` & `CohesionRadius` - adjusts cohesion force
- `SeparationForceFactor` & `SeparationRadius` - adjusts separation force
- `AlignmentForceFactor` & `AligmentRadius` - adjusts aligment force
- `MaxSpeed` & `MinSpeed` - max/min speed of school
- `DetectionRadius` - determines radius in which school detects school of other type(e.g. radius where fish detect shark and v.v.)


## Results & Media
- Produces a readable cycle: predator disrupts school, chases peripheral prey, then backs off; prey regroup before re-engagement.

https://github.com/user-attachments/assets/9ce1d8e7-91ee-4e11-a28a-58e1da919be8


## References
- Nishimura — *A predator’s selection of an individual prey from a group* (peripheral-priority selection)
- Li & Shao — *Simulation Study on Fish Schooling Behavior* (steering/group effects)


## Credits & Asset Attribution
- Built in collaboration with another student (co-author: Malcolm Helasterä).
- Several assets (3D models, materials) were imported from third-party sources for visualization (or included in the course assets). These assets are **not** original work.
- All third-party assets remain the property of their respective owners.
