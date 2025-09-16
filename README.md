# Project Description

This is a Frontend Section for the GigsUniverse Application.

FYP Topic: `The Impact of the Gig Economy on Youth Employment and Career Growth`

Developed By: Soh Jia Seng TP065158

A Progressive Web App Concept is utilized in this Application. Whereas it supports multiple devices with responsive design.

## Command
- This project utilizes `pnpm` to handle relevant dependencies and improve developing performance.
- Webpack is used to handle the bundling and optimization of frontend assets to ensure efficient loading and improved performance

Download Dependencies:
```bash
pnpm install
```

Local Development:
```bash
pnpm run dev
```

Compilation:
```bash
pnpm run build
```

Running Compiled Program:
```bash
pnpm run start
```

## Setup
Note: `This Application by Default Enforces HTTPS`

- Refer .env.example for environment setup.
- This given setup is able to support tunneling or deployment on server. 

## Docker
Windows Command:
```bash
docker build ^
  -t giguniverse-frontend ^
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.gigsuniverse.studio ^
  --build-arg NEXT_PUBLIC_SITE_URL=https://gigsuniverse.studio ^
  .
```

Linux / MasOS Command:
```bash
docker build \
  -t giguniverse-frontend \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://api.gigsuniverse.studio \
  --build-arg NEXT_PUBLIC_SITE_URL=https://gigsuniverse.studio .
```

Running Docker at Port 80 -> 443 Upon HTTPS Available (Assign TLS)
```bash
docker run -d -p 80:3000 giguniverse-frontend
```
