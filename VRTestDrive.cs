using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

public class VRTestDrive : MonoBehaviour
{
    public ActionBasedController driverHand; // Assign VR controller
    public WheelCollider steeringWheel;

    void Update()
    {
        float steerInput = driverHand.transform.localRotation.eulerAngles.y; // Steer via rotation
        steeringWheel.steerAngle = steerInput * 30f; // Shiny HUD update
        // Integrate AI sim: Call CARLA bridge for scenario
    }
}
