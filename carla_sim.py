# carla_sim.py
import carla
import websockets
import asyncio
import json

async def stream_sim(websocket, path):
    client = carla.Client('localhost', 2000)
    world = client.get_world()
    vehicle_bp = world.get_blueprint_library().find('vehicle.tesla.model3')
    vehicle = world.spawn_actor(vehicle_bp, random.choice(world.get_map().get_spawn_points()))

    while True:
        control = carla.VehicleControl(throttle=0.5, steer=random.uniform(-1, 1))
        vehicle.apply_control(control)
        await websocket.send(json.dumps({'position': vehicle.get_transform().location.to_json()}))
        await asyncio.sleep(0.1)

start_server = websockets.serve(stream_sim, '0.0.0.0', 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
