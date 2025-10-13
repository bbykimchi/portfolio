using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Shoot : MonoBehaviour
{
    [SerializeField]
    private float _maximumForce;

    [SerializeField]
    private float _maximumForceTime;

    private float _timeMouseButtonDown;

    private Camera _camera;
    
    void Awake()
    {   
        // Gets the camera component
        _camera = GetComponent<Camera>();

    }

    // Update is called once per frame
    void Update()
    {
        // Detects mouse button press
        if (Input.GetMouseButtonDown(0))
        {
            _timeMouseButtonDown = Time.time;
        }

        // Detects mouse button release (fire event)
        if (Input.GetMouseButtonUp(0))
        {
            // Cast ray from screen center towards the scene
            Ray ray = _camera.ScreenPointToRay(Input.mousePosition);

            // Calculates force direction, force magnitude and hitpoint to trigger ragdoll effect on the hit mannequin 
            if (Physics.Raycast(ray, out RaycastHit hitInfo))
            {
                Mannequin mannequin = hitInfo.collider.GetComponentInParent<Mannequin>();

                if (mannequin != null)
                {
                    float mouseButtonDownDuration = Time.time - _timeMouseButtonDown;
                    float forcePercentage = mouseButtonDownDuration / _maximumForceTime;
                    float forceMagnitude = Mathf.Lerp(1, _maximumForce, forcePercentage);

                    Vector3 forceDirection = mannequin.transform.position - _camera.transform.position;
                    forceDirection.y = 1;
                    forceDirection.Normalize();

                    Vector3 force = forceMagnitude * forceDirection;

                    mannequin.TriggerRagdoll(force, hitInfo.point);
                }
            }
        }
    }
}
