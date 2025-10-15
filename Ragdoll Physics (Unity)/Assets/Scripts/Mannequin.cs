using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

// Handles ragdoll behaviour and animations for the mannequin
public class Mannequin : MonoBehaviour
{
    // Helper class for storing bone position and rotation
    private class BoneTransform
    {
        public Vector3 Position { get; set; }
        public Quaternion Rotation { get; set; }
    }
     // Possible mannequin states
    private enum MannequinState
    {
        Walking,
        Ragdoll,
        StandingUp,
        ResettingBones
    }

    [SerializeField]
    private Camera _camera;
    [SerializeField]
    private string _faceUpStandUpStateName;
    [SerializeField]
    private string _faceDownStandUpStateName;
    [SerializeField]
    private string _faceUpStandUpClipName;
    [SerializeField]
    private string _faceDownStandUpClipName;
    [SerializeField]
    private float _timeToResetBones;

    private Rigidbody[] _ragdollRigidbodies;
    private MannequinState _currentState = MannequinState.Walking;
    private Animator _animator;
    private CharacterController _characterController;
    private float _timeToWakeUp;
    private Transform _hipsBone;
    private BoneTransform[] _faceUpStandUpBoneTransforms;
    private BoneTransform[] _faceDownStandUpBoneTransforms;
    private BoneTransform[] _ragdollBoneTransforms;
    private Transform[] _bones; 
    private float _elapsedResetBonesTime;
    private bool _isFacingUp;
    void Awake()
    {
        if (_camera == null)
        {
            _camera = Camera.main; // Auto-assign main camera if not set
        }
        _ragdollRigidbodies = GetComponentsInChildren<Rigidbody>();
        _animator = GetComponent<Animator>();
        _characterController = GetComponent<CharacterController>();
        _hipsBone = _animator.GetBoneTransform(HumanBodyBones.Hips);

        _bones = _hipsBone.GetComponentsInChildren<Transform>();

        // Initialize bone transform arrays
        _faceUpStandUpBoneTransforms = new BoneTransform[_bones.Length];
        _faceDownStandUpBoneTransforms = new BoneTransform[_bones.Length];
        _ragdollBoneTransforms = new BoneTransform[_bones.Length];

        for (int boneIndex = 0; boneIndex < _bones.Length; boneIndex++)
        {
            _faceUpStandUpBoneTransforms[boneIndex] = new BoneTransform();
            _faceDownStandUpBoneTransforms[boneIndex] = new BoneTransform();
            _ragdollBoneTransforms[boneIndex] = new BoneTransform();
        }
        // Store bone transforms for stand-up animations
        PopulateAnimationStartBoneTransforms(_faceUpStandUpClipName, _faceUpStandUpBoneTransforms);
        PopulateAnimationStartBoneTransforms(_faceDownStandUpClipName, _faceDownStandUpBoneTransforms);
        
        DisableRagdoll();
        RegisterBoneCollisions();
    }

    // Update is called once per frame
    void Update()
    {
        // State machine controlling mannequin behavior
       switch (_currentState)
       {
        case MannequinState.Walking:
            WalkingBehaviour();
            break;
        case MannequinState.Ragdoll:
            RagdollBehaviour();
            break;
        case MannequinState.StandingUp:
            StandingUpBehaviour();
            break;
        case MannequinState.ResettingBones:
            ResettingBonesBehaviour();
            break;
       }
    }

    // Triggers ragdoll with applied force at hit point
    public void TriggerRagdoll(Vector3 force, Vector3 hitPoint)
    {
        EnableRagdoll();

        Rigidbody hitRigidbody = FindHitRigidbody(hitPoint);

        hitRigidbody.AddForceAtPosition(force, hitPoint, ForceMode.Impulse);

        _currentState = MannequinState.Ragdoll;
        _timeToWakeUp = Random.Range(3, 7);
    }

    // Registers collision proxies for all bones
    public void RegisterBoneCollisions()
    {
        foreach (var rb in _ragdollRigidbodies)
        {
            RagdollBoneCollisionProxy proxy = rb.gameObject.AddComponent<RagdollBoneCollisionProxy>();
            proxy.Initialize(this);
        }
    }

    // Handles collisions between mannequins
    public void HandleBoneCollision(Collision collision)
{
    if (_currentState != MannequinState.Ragdoll)
        return;

    Mannequin otherMannequin = collision.collider.GetComponentInParent<Mannequin>();

    if (otherMannequin != null && otherMannequin != this)
    {
        if (otherMannequin._currentState != MannequinState.Ragdoll)
        {
            if (collision.impulse.magnitude < 10f)
                return; // Ignore small bumps

            Vector3 forceDir = (otherMannequin.transform.position - transform.position).normalized;
            Vector3 force = forceDir * (collision.impulse.magnitude * 1f); // Adjust multiplier for effect
            Vector3 contactPoint = collision.contacts[0].point;

            otherMannequin.TriggerRagdoll(force, contactPoint);
        }
    }
}

    // Finds closest rigidbody to hit point
    private Rigidbody FindHitRigidbody(Vector3 hitpoint)
    {
        Rigidbody closestRigidbody = null;
        float closestDistance = 0;

        foreach (var rigidbody in _ragdollRigidbodies)
        {
            float distance = Vector3.Distance(rigidbody.position, hitpoint);

            if (closestRigidbody == null || distance < closestDistance)
            {
                closestDistance = distance;
                closestRigidbody = rigidbody;
            }
        }

        return closestRigidbody;
    }
    
    // Disables ragdoll physics and enables animation/character controller
    private void DisableRagdoll()
    {
        foreach (var rigidbody in _ragdollRigidbodies)
        {
            rigidbody.isKinematic = true;
        }

        _animator.enabled = true;
        _characterController.enabled = true;
    }

    // Enables ragdoll physics and disables animation/character controller
    private void EnableRagdoll()
    {
        foreach (var rigidbody in _ragdollRigidbodies)
        {
            rigidbody.isKinematic = false;
        }

        _animator.enabled = false;
        _characterController.enabled = false;
    }

    // Rotates mannequin to face camera while walking
    private void WalkingBehaviour()
    {
        Vector3 direction = _camera.transform.position - transform.position;
        direction.y = 0;
        direction.Normalize();

        Quaternion toRotation = Quaternion.LookRotation(direction, Vector3.up);
        transform.rotation = Quaternion.RotateTowards(transform.rotation, toRotation, 20 * Time.deltaTime);
    }

    // Ragdoll physics and timer countdown
    private void RagdollBehaviour()
    {
        _timeToWakeUp -= Time.deltaTime;

        if (_timeToWakeUp <= 0)
        {   
            _isFacingUp = _hipsBone.forward.y > 0;

            AlignRotationToHips();
            AlignPositionToHips();

            PopulateBoneTransforms(_ragdollBoneTransforms);

            _currentState = MannequinState.ResettingBones;
            _elapsedResetBonesTime = 0;
        }
    }

    // Handles stand-up animation state transition
    private void StandingUpBehaviour()
    {
        if (_animator.GetCurrentAnimatorStateInfo(0).IsName(GetStandUpStateName()) == false)
        {
            _currentState = MannequinState.Walking;
        }
    }

    // Interpolates bones from ragdoll pose to animation pose
    private void ResettingBonesBehaviour()
    {
        _elapsedResetBonesTime += Time.deltaTime;
        float elapsedPercentage = _elapsedResetBonesTime / _timeToResetBones;

        BoneTransform[] standUpBoneTransforms = GetStandUpBoneTransforms();
        for (int boneIndex = 0; boneIndex < _bones.Length; boneIndex++)
        {
            _bones[boneIndex].localPosition = Vector3.Lerp(
                _ragdollBoneTransforms[boneIndex].Position,
                standUpBoneTransforms[boneIndex].Position,
                elapsedPercentage);
            
            _bones[boneIndex].localRotation = Quaternion.Lerp(
                _ragdollBoneTransforms[boneIndex].Rotation,
                standUpBoneTransforms[boneIndex].Rotation,
                elapsedPercentage);
        }

        if (elapsedPercentage >= 1)
        {
            _currentState = MannequinState.StandingUp;
            DisableRagdoll();

            _animator.Play(GetStandUpStateName(), 0, 0);
        }
    }

    // Aligns mannequin's rotation to hips direction
    private void AlignRotationToHips()
    {
        Vector3 originalHipsPosition = _hipsBone.position;
        Quaternion originalHipsRotation = _hipsBone.rotation;

        Vector3 desiredDirection = _hipsBone.up;

        if (_isFacingUp)
        {
            desiredDirection *= -1;
        }
        desiredDirection.y = 0;
        desiredDirection.Normalize();

        Quaternion fromToRotation = Quaternion.FromToRotation(transform.forward, desiredDirection);
        transform.rotation *= fromToRotation;

        _hipsBone.position = originalHipsPosition;
        _hipsBone.rotation = originalHipsRotation;
    }

    // Aligns mannequin's position to hips bone and ground
    private void AlignPositionToHips()
    {
        Vector3 originalHipsPosition = _hipsBone.position;
        transform.position = _hipsBone.position;

        Vector3 positionOffset = GetStandUpBoneTransforms()[0].Position;
        positionOffset.y = 0;
        positionOffset = transform.rotation * positionOffset;
        transform.position -= positionOffset;

        if (Physics.Raycast(transform.position, Vector3.down, out RaycastHit hitInfo))
        {
            transform.position = new Vector3(transform.position.x, hitInfo.point.y, transform.position.z);
        }
        _hipsBone.position = originalHipsPosition;
    }

    // Stores current local positions and rotations of bones
    private void PopulateBoneTransforms(BoneTransform[] boneTransforms)
    {
        for (int boneIndex = 0; boneIndex < _bones.Length; boneIndex++)
        {
            boneTransforms[boneIndex].Position = _bones[boneIndex].localPosition;
            boneTransforms[boneIndex].Rotation = _bones[boneIndex].localRotation;
        }
    }

    // Samples start poses from stand-up animation clips
    private void PopulateAnimationStartBoneTransforms(string clipName, BoneTransform[] boneTransforms)
    {
        Vector3 positionBeforeSampling = transform.position;
        Quaternion rotationBeforeSampling = transform.rotation;

        foreach (AnimationClip clip in _animator.runtimeAnimatorController.animationClips)
        {
            if (clip.name == clipName)
            {
                clip.SampleAnimation(gameObject, 0);
                PopulateBoneTransforms(boneTransforms);
                break;
            }
        }

        transform.position = positionBeforeSampling;
        transform.rotation = rotationBeforeSampling;
    }

    // Gets correct state name based on facing direction
    private string GetStandUpStateName()
    {
        return _isFacingUp ? _faceUpStandUpStateName : _faceDownStandUpStateName;
    }

    // Gets correct bone transforms for stand-up 
    private BoneTransform[] GetStandUpBoneTransforms()
    {
        return _isFacingUp ? _faceUpStandUpBoneTransforms : _faceDownStandUpBoneTransforms;
    }

    
}

// Proxy script to forward collision events to mannequin
public class RagdollBoneCollisionProxy : MonoBehaviour
{
    private Mannequin _mannequin;

    public void Initialize(Mannequin mannequin)
    {
        _mannequin = mannequin;
    }

    private void OnCollisionEnter(Collision collision)
    {
        _mannequin.HandleBoneCollision(collision);
    }
}
