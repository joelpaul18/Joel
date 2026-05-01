# Deployment

This project has two deployable apps:

- `frontend`: Vite + React, best deployed to Vercel.
- `backend`: Express + MongoDB, deploy to Render/Railway/Fly.io.

## Backend

Use the `backend` folder as the service root.

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Environment variables:

```bash
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

After the backend is live, copy its public URL.

## Frontend

Use the `frontend` folder as the Vercel project root.

Build command:

```bash
npm run build
```

Output directory:

```bash
dist
```

Environment variables:

```bash
VITE_API_URL=https://your-backend-host-url
```

The frontend includes `vercel.json` so React routes like `/blog/some-post` and `/joel/dashboard` work after refresh.
