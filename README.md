# Hayan Bakery

A small full-stack web app with catalog, blog, auth, admin, PWA, and MongoDB.

## Run
```bash
cp .env.example .env
npm install
npm run build:css
npm run seed
npm start
# http://localhost:${PORT:-3000}
```

## Features
- Product catalog, blog, search
- Signup/login/logout (session + cookies)
- Admin panel for products and posts
- MongoDB (Mongoose)
- Security hardening (helmet, sanitize, xss, rate limit)
- PWA: manifest + service worker
- Unit tests (Jest + SuperTest)
