using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

public class ARCarTestDrive : MonoBehaviour
{
    public GameObject carModel; // Assign 3D car prefab from Edmunds API export
    private ARRaycastManager raycastManager;
    private TrackableType trackableType = TrackableType.PlaneWithinPolygon;

    void Start()
    {
        raycastManager = FindObjectOfType<ARRaycastManager>();
        carModel.SetActive(false);
    }

    void Update()
    {
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            List<ARRaycastHit> hits = new List<ARRaycastHit>();
            if (raycastManager.Raycast(touch.position, hits, trackableType))
            {
                Pose hitPose = hits[0].pose;
                // Before Instantiate, fetch specs via REST (use UnityWebRequest)
  using UnityEngine.Networking;
IEnumerator LoadCarSpecs(string model) {
  using (UnityWebRequest www = UnityWebRequest.Get($"https://carapi.app/api/v1/vehicles/search?model={model}")) {
    yield return www.SendWebRequest();
    if (www.result == UnityWebRequest.Result.Success) {
      string json = www.downloadHandler.text;
      // Parse JSON (SimpleJSON lib),
      set carModel.GetComponent<Rigidbody>().mass = parsed.engine.weight;
    }
  }
  // Animate with specs (e.g., engine sound based on type)
}
StartCoroutine(LoadCarSpecs("Camry"));
                Instantiate(carModel, hitPose.position, hitPose.rotation);
                // Animate entrance: carModel.transform.localScale = Vector3.zero; LeanTween.scale(carModel, Vector3.one, 1f).setEase(LeanTweenType.easeOutBack);
            }
        }
    }
}
