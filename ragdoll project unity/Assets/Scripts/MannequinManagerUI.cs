using System.Collections.Generic;
using UnityEngine;
using TMPro; // For optional counter display

public class MannequinManagerUI : MonoBehaviour
{
    [SerializeField] private GameObject mannequinPrefab;
    [SerializeField] private Transform spawnPoint;
    [SerializeField] private TextMeshProUGUI counterText;

    private List<GameObject> mannequins = new List<GameObject>();

    public void AddMannequin()
    {
        // Calculate position offset to space mannequins horizontally
        Vector3 offset = Vector3.right * mannequins.Count * 2.0f; // Space them out
        
        // Istantiate a new mannequin at the calculated position
        GameObject newMannequin = Instantiate(mannequinPrefab, spawnPoint.position + offset, Quaternion.identity);
        mannequins.Add(newMannequin);
        UpdateCounter();
    }

    public void RemoveMannequin()
    {
        // Removes the last mannequin if there are any present
        if (mannequins.Count > 0)
        {
            GameObject toRemove = mannequins[mannequins.Count - 1];
            mannequins.RemoveAt(mannequins.Count - 1);
            Destroy(toRemove);
            UpdateCounter();
        }
    }

    private void UpdateCounter()
    {
        if (counterText != null)
        {
            // Minimum number of mannequins is 1
            counterText.text = $"Mannequins: {mannequins.Count + 1}";
        }
    }
}