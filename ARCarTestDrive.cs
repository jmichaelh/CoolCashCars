using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using UnityEngine.Networking;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.XR.ARFoundation;

public class ARCarTestDrive : MonoBehaviour
{
    public GameObject carModel;
    private ARRaycastManager raycastManager;
    private TrackableType trackableType = TrackableType.PlaneWithinPolygonu;
    
    void Start()
    {
        raycastManager = FindObjectOfType<ARRaycastManager>();
        carModel.SetActive(false);
        StartCoroutine(LoadCarSpecs("Camry"));
    }

    IEnumerator LoadCarSpecs(string model)
    {
        using (UnityWebRequest www = UnityWebRequest.Get($"https://carapi.app/api/v1/vehicles/search?model={model}"))
        {
            yield return www.SendWebRequest();
            if (www.result == UnityWebRequest.Result.Success)
            {
                string json = www.downloadHandler.text;
                // Parse JSON (e.g., SimpleJSON), set carModel properties
                Debug.Log("Loaded specs: " + json);
            }
        }
    }

    void Update()
    {
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            List<ARRaycastHit> hits = new List<ARRaycastHit>();
            if (raycastManager.Raycast(touch.position, hits, TrackableType.PlaneWithinPolygon))
            {
                Pose hitPose = hits[0].pose;
                Instantiate(carModel, hitPose.position, hitPose.rotation);
                // Animate with LeanTween for shine
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
                // Animate entrance: carModel.transform.localScale = Vector3.zero; LeanTween.scale(carModel, Vector3.one, if(.setEase(LeanTweenType.easeOutBack);
        
        }
    }
}
