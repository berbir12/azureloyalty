# Azure Breeze Resort â€” Loyalty Rewards Frontend

A React + TypeScript + Tailwind CSS frontend for the Azure Breeze Resort Google Wallet Loyalty programme.

## Tech stack

- Vite
- React 18
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion

## Getting started

Requires Node.js 18+ and the backend running on port 4000.

```sh
# Install dependencies
npm install

# Start dev server (proxies /api to localhost:4000)
npm run dev
```

Open http://localhost:8080.

## Backend

The backend lives in `../backend`. Start it first:

```sh
cd ../backend
npm start
```

## Build for production

```sh
npm run build
```

Static output is in `dist/`. Point your web server at `dist/` and proxy `/api/*` to the backend.
