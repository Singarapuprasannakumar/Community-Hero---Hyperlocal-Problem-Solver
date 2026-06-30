# Community Hero AI — Cloud Deployment Guide

This document describes how to build, run, and host **Community Hero AI** in staging and production environments.

---

## 1. Local Docker Setup

Verify the setup locally using Docker Compose:
```bash
# Start development server
docker-compose up --build

# Start optimized production server
docker-compose -f docker-compose.prod.yml up --build
```
Once initialized, the dashboard runs at `http://localhost:3000`.

---

## 2. Cloud Platforms Hosting

### Vercel / Netlify
1. Connect repository.
2. Select **Vite / React** preset.
3. Add environment variables matching `.env.production`.
4. Deploy.

### Railway / Render / GCR
Since the repository contains a `Dockerfile` and `docker-compose.yml`, Railway and Render will automatically detect the configuration, compile the multi-stage images, and expose port `3000` automatically.
