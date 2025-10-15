using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

public class BoidManager : MonoBehaviour
{
    public static BoidManager Instance { get; private set; }
    private List<Boid> m_boids = new List<Boid>();

    void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
    }
    
    public void RegisterBoid(Boid boid)
    {
        m_boids.Add(boid);
    }

    void Start()
    {
        m_boids = new List<Boid>();

        var schools = GameObject.FindObjectsOfType<School>();
        foreach (var school in schools)
        {
            school.BoidManager = this;
            m_boids.AddRange(school.SpawnFish());

        }
    }

    void FixedUpdate()
    {
        foreach (Boid boid in m_boids)
        {
            boid.UpdateSimulation(Time.fixedDeltaTime);
        }
    }

    public IEnumerable<Boid> GetNeighbors(Boid boid, float radius)
    {
        float radiusSq = radius * radius;
        foreach (var other in m_boids)
        {
            if (other != boid && (other.Position - boid.Position).sqrMagnitude < radiusSq)
                yield return other;
        }
    }
    public IEnumerable<Boid> GetPredatorsNearby(Boid boid, float radius)
    {
        float radiusSq = radius * radius;
        return m_boids.Where(b => b.Type == FishType.Predator && (b.Position - boid.Position).sqrMagnitude < radiusSq);
    }

    public IEnumerable<Boid> GetPreyNearby(Boid boid, float radius)
    {
        float radiusSq = radius * radius;
        return m_boids.Where(b => b.Type == FishType.Prey && (b.Position - boid.Position).sqrMagnitude < radiusSq);
    }
}
