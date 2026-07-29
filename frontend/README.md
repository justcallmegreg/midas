# Frontend Service

> Web interface for the Midas data intelligence platform.

## Overview

The frontend provides a responsive web interface for users to interact with the data intelligence platform. It communicates with the backend API to fetch and manipulate data.

## Technology Stack

- **Framework:** [TBD - React/Vue/Angular/Svelte]
- **Build Tool:** [TBD]
- **Package Manager:** npm or yarn
- **Node:** 18+

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker

```bash
# Build image
docker build -t midas-frontend .

# Run container
docker run -p 3000:3000 midas-frontend
```

## Configuration

Environment variables for the frontend:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Backend API base URL |
| `VITE_APP_ENV` | `development` | Application environment |

## Project Structure

```
frontend/
├── src/                         # Source code
│   ├── components/              # Reusable components
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Entry point
├── public/                      # Static assets
├── tests/                       # Test files
├── Dockerfile                   # Container definition
├── package.json                 # Dependencies
├── vite.config.ts              # Build configuration (if using Vite)
└── README.md                    # This file
```

## Features (Planned)

- [ ] Data dashboard
- [ ] Search interface
- [ ] Data export functionality
- [ ] User authentication
- [ ] Real-time data updates

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Building

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## API Integration

The frontend communicates with the backend via REST API. Key endpoints:

- `GET /healthz` - Health check
- [Additional endpoints TBD]

## Deployment

### Docker Compose

Use the root `docker-compose.yml` to run the frontend with other services:

```bash
docker-compose up frontend
```

### Static Hosting

The build output in `dist/` can be deployed to any static hosting service (Vercel, Netlify, AWS S3, etc.).

## Troubleshooting

### API Connection Issues

1. Verify backend service is running: `curl http://localhost:5000/healthz`
2. Check `VITE_API_URL` environment variable
3. Review browser console for CORS errors
4. Ensure backend is properly configured for CORS

### Build Errors

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist/`
3. Check Node.js version: `node --version` (should be 18+)

## Performance Optimization

- [ ] Code splitting
- [ ] Lazy loading components
- [ ] Image optimization
- [ ] Caching strategies
- [ ] CDN integration (planned)

---

**Version:** See [VERSION.txt](../VERSION.txt)

**License:** See [COMMERCIAL_LICENSE.md](../COMMERCIAL_LICENSE.md)
