using UnityEngine;
using System.Collections;

public enum FishType { Prey, Predator }
public class Boid : MonoBehaviour 
{
    public FishType Type;
    public School School { get; set; }

    public Vector3 Position;
    public Vector3 Velocity;
    public Vector3 Acceleration;

    private Boid lockedPrey = null;
    private float timeOnPrey = 0f;
    private float preyEscapeTime = 5f;
    private float timeSinceEscape = 0f;
    private float predatorCooldown = 7f;
    
    
    void Start()
    {
        Velocity = Random.insideUnitSphere * 2;
        Type = School.GetSchoolType() == School.SchoolType.Prey ? FishType.Prey : FishType.Predator;
        BoidManager.Instance.RegisterBoid(this);
    }

    public void UpdateSimulation(float deltaTime)
    {
        //Clear acceleration from last frame
        Acceleration = Vector3.zero;

        //Apply forces
        Acceleration += (Vector3)School.GetForceFromBounds(this);
        Acceleration += GetConstraintSpeedForce();
        Acceleration += GetSteeringForce();
        Acceleration += GetPursuitForce();

        //Step simulation
        Velocity += deltaTime * Acceleration;
        Position +=  0.5f * deltaTime * deltaTime * Acceleration + deltaTime * Velocity;
    }

    Vector3 GetSteeringForce()
    {
        Vector3 cohesionForce = Vector3.zero;
        Vector3 alignmentForce = Vector3.zero;
        Vector3 separationForce = Vector3.zero;
        Vector3 averageVelocity = Vector3.zero;
        Vector3 averagePosition = Vector3.zero;
        Vector3 fleeForce = Vector3.zero;
        
        int alignmentCount = 0;
        int cohesionCount = 0;

        //Boid forces
        foreach (Boid neighbor in School.BoidManager.GetNeighbors(this, School.NeighborRadius))
        {
            float distance = (neighbor.Position - Position).magnitude;

            //Separation force
            if (distance < School.SeparationRadius)
            {
                separationForce += School.SeparationForceFactor * ((School.SeparationRadius - distance) / distance) * (Position - neighbor.Position);
            }

            if (distance < School.AlignmentRadius)
            {
                averageVelocity += neighbor.Velocity;
                alignmentCount++;
            }

            if (distance < School.CohesionRadius)
            {
                averagePosition += neighbor.Position;
                cohesionCount++;
            }
            //Calculate average position/velocity here
        }
         
        //Set cohesion/alignment forces here
        if (alignmentCount > 0)
        {
            averageVelocity /= alignmentCount;
            alignmentForce = School.AlignmentForceFactor * (averageVelocity - Velocity);
        }

        if (cohesionCount > 0)
        {
            averagePosition /= cohesionCount;
            cohesionForce = School.CohesionForceFactor * (averagePosition - Position);
        }

        if (Type == FishType.Prey)
        {
            foreach (Boid predator in School.BoidManager.GetPredatorsNearby(this, School.DetectionRadius))
            {
                fleeForce = (Position - predator.Position).normalized * 8.0f;
                cohesionForce = 0.2f * cohesionForce;
                alignmentForce = 0.2f * alignmentForce;
                
            }
        }        

        return alignmentForce + cohesionForce + separationForce + fleeForce;
    }

    Vector3 GetConstraintSpeedForce()
    {
        Vector3 force = Vector3.zero;

        //Apply drag
        force -= School.Drag * Velocity;

        float vel = Velocity.magnitude;
        if (vel > School.MaxSpeed)
        { 
            //If speed is above the maximum allowed speed, apply extra friction force
            force -= (20.0f * (vel - School.MaxSpeed) / vel) * Velocity;
        }
        else if (vel < School.MinSpeed)
        {
            //Increase the speed slightly in the same direction if it is below the minimum
            force += (5.0f * (School.MinSpeed - vel) / vel) * Velocity;
        }

        return force;
    }

    Vector3 GetPursuitForce()
    {
        
        Vector3 pursuitForce = Vector3.zero;

        if (Type == FishType.Predator)
        {
            Vector3 bestPreyPosition = Vector3.zero;
            float highestPriority = float.NegativeInfinity;

            if (lockedPrey != null)
            {
                timeOnPrey += Time.deltaTime;

                if (timeOnPrey >= preyEscapeTime)
                {
                    lockedPrey = null;
                    timeOnPrey = 0f;
                    timeSinceEscape = 0f;
                } else {
                    bestPreyPosition = lockedPrey.Position;
                }
            }

            if (lockedPrey == null && timeSinceEscape < predatorCooldown)
            {
                timeSinceEscape += Time.deltaTime;
                pursuitForce = Vector3.zero;
            }

            if (lockedPrey == null && timeSinceEscape >= predatorCooldown) 
            {
                Vector3 preyCenterOfMass = Vector3.zero;
                int preyCount = 0;

                foreach (Boid prey in School.BoidManager.GetPreyNearby(this, School.DetectionRadius))
                {
                    preyCenterOfMass += prey.Position;
                    preyCount++;

                }

                if (preyCount > 0)
                {
                    preyCenterOfMass /= preyCount;
                    foreach (Boid prey in School.BoidManager.GetPreyNearby(this, School.DetectionRadius))
                    {
                        Vector3 ci = prey.Position;
                        Vector3 cp = Position;
                        Vector3 cgi = ci - preyCenterOfMass;
                        Vector3 cgp = cp - preyCenterOfMass;
                        float beta = 0.5f;
                        float priority = -(ci -cp).magnitude - beta * (cgi.magnitude - cgp.magnitude);

                        if (priority > highestPriority)
                        {
                            highestPriority = priority;
                            bestPreyPosition = prey.Position;
                            lockedPrey = prey;
                            timeOnPrey = 0f;
                        }
                    }
                }
            }

            if (bestPreyPosition != Vector3.zero)
            {
                pursuitForce = (bestPreyPosition - Position).normalized * 10.0f;
            }
                
        }

        return pursuitForce;
    }

}
