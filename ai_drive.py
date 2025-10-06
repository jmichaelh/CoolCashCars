import carla
import random
import time
import requests

# Connect to CARLA server
client = carla.Client('localhost', 2000)
client.set_timeout(10.0)
world = client.get_world()

def get_vehicle_specs(model):
  response = requests.get(f'https://carapi.app/api/v1/vehicles/search?model={model}')
  if response.status_code == 200:
    return response.json()[0]  # Assume first match
        return {}
  
# Spawn ego vehicle
blueprint_library = world.get_blueprint_library()
specs = get_vehicle_specs('Camry')
vehicle_bp = world.get_blueprint_library().find('vehicle.tesla.model3')  # Fallback
vehicle_bp.set_attribute('color', specs.get('color', 'blue'))
spawn_point = random.choice(world.get_map().get_spawn_points())
vehicle = world.spawn_actor(vehicle_bp, spawn_point)

# Add RGB camera for AI input
camera_bp = blueprint_library.find('sensor.camera.rgb')
camera = world.spawn_actor(camera_bp, carla.Transform(carla.Location(x=2.5, z=0.7)), attach_to=vehicle)

# AI Control Loop (simple waypoint following)
def drive_ai():
    while True:
        # Get AI decision (e.g., from neural net)
        control = carla.VehicleControl(throttle=0.5, steer=random.uniform(-1,1))
        vehicle.apply_control(control)
        time.sleep(0.1)  # 10 FPS sim

drive_ai()  # Run in thread for Unity integration
