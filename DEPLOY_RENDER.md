# Deploy to Render (Server + Client)

This guide deploys the Node.js API (server) and the React frontend (client) to Render using a single blueprint file.

## 1) Prerequisites
- A MongoDB connection string (MongoDB Atlas recommended)
- Render account

## 2) One-click deploy with blueprint
1. Commit the `render.yaml` at the repo root (already included).
2. Push your repo to GitHub/GitLab.
3. On Render, click "New +" → "Blueprint" → connect this repo.
4. Set environment variables during the blueprint creation:
   - For `ecommerce-analytics-server` service:
     - `MONGODB_URI` = your MongoDB connection string
     - (Optional) `CACHE_TTL_SECONDS` = 60
5. Click "Apply" to create both services.

This will:
- Build and start the backend at `https://<server>.onrender.com`
- Build and publish the static frontend at `https://<client>.onrender.com`

## 3) Make the client call the backend in production
The frontend uses `axios` with baseURL `/api` (same-origin). For a static site, add a reverse proxy so `/api/*` calls the server.

Create `client/public/_redirects` with the following content and commit:
```
/api/*  https://<YOUR_SERVER_SERVICE>.onrender.com/api/:splat  200
```
Replace `<YOUR_SERVER_SERVICE>` with your actual Render server service host. Then redeploy the client.

Notes:
- The `_redirects` file is copied by Vite from `public/` to the built `dist/`.
- After the first server deploy, grab the server URL from the service dashboard.

## 4) Seed the database (optional)
From local machine (pointing to the same DB URL used on Render):
```
cd server
# set MONGODB_URI to the same cluster used in Render
set MONGODB_URI="your-uri" && node src/seed.js  # Windows cmd
# or: MONGODB_URI="your-uri" node src/seed.js   # PowerShell/bash
```

## 5) Environment variables
Backend (Web Service):
- `PORT` (Render sets this automatically; we set 5000 in render.yaml but Render will override. Using Express, it still binds correctly.)
- `MONGODB_URI`
- `NODE_ENV=production`
- `CACHE_TTL_SECONDS` (optional)

Client (Static Site):
- No envs required if using `_redirects` proxy.
- Alternatively, switch axios to read `import.meta.env.VITE_API_URL` and set a Render env var.

## 6) Health check
- Backend: visit `https://<server>.onrender.com/api/health` → `{ "status": "ok" }`
- Client: visit `https://<client>.onrender.com` and navigate through the dashboard

## 7) Troubleshooting
- CORS: Not an issue when proxying via `_redirects`. If calling cross-origin directly, ensure backend CORS allows the client origin.
- Cold starts: Free tier may sleep; first request may be slower.
- 404 on API from client: Ensure `_redirects` was added and the client redeployed. Verify the server URL.

## 8) Manual (no blueprint)
You can also create two services manually:
- Web Service → root `server/`, Build: `npm install`, Start: `node src/server.js`, set envs.
- Static Site → root `client/`, Build: `npm install && npm run build`, Publish: `dist`, add `_redirects`.
