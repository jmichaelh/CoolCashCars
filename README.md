# Cool Cash Cars

A web app for browsing, researching, and purchasing cars using CarAPI.app, with AR/VR test drives and AI simulations.

## Setup
1. Install Node.js 22.16.0 and npm 10.9.2.
2. Run `npm install`.
3. Build: `npm run build`.
4. Deploy: `npm run deploy` (requires `wrangler login`).
5. CARLA: Run `carla_sim.py` on an external server (e.g., AWS EC2) with CARLA installed.

## Deployment
- URL: `https://cool-cash-cars.workers.dev`
- Test API: `curl https://cool-cash-cars.workers.dev/api/vehicles?make=Toyota`
- WebSocket: `ws://your-ec2-ip:8765` (CARLA)

## Features
- Browse vehicles with CarAPI.app.
- View detailed specs with VIN decode.
- AR test drive (WebXR, client-side).
- Purchase via Carvana affiliate links.
- AI simulations via CARLA (external).

## Mockups
- Browsing: [Figma](https://www.figma.com/community/file/1135952322923156642)
- Research: [Figma](https://www.figma.com/community/file/1336220709189798406)
- AR: [Figma](https://freebiesui.com/figma-freebies/figma-app-designs/car-setup-app-design/)
