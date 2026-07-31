# Frontend

React frontend application for the Midas financial management system.

**Status:** Under development (v0.1.0)

## Overview

This directory contains the React frontend application for the Midas financial management system. It provides a user interface for managing accounts, transfers, sources, and sinks.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run preview
```

The application will be available at `http://localhost:5173` (dev) or `http://localhost:3000` (production).

## Docker

```bash
# Build Docker image
docker build -t midas-frontend .

# Run container
docker run -p 3000:3000 midas-frontend
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.jsx       # Main layout wrapper
│   ├── Header.jsx       # Application header
│   ├── Sidebar.jsx      # Navigation sidebar
│   └── ...
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── Transfers.jsx
│   ├── Settings.jsx     # Settings page with sub-views
│   └── ...
├── api/                 # API client functions
│   ├── client.js        # Axios client configuration
│   └── accounts.js      # Account API calls
├── hooks/               # Custom React hooks
├── App.jsx              # Main app component
└── index.css            # Global styles
```

## Features

- 📊 Dashboard with financial overview
- 💳 Account management (Settings > Accounts)
- 💸 Transfer tracking and management
- 🔄 Reclaimable transfer support
- 📈 Reports and analytics
- ⚙️ Settings and preferences

## Development

For detailed development information, see the root [README.md](../README.md).

## License

See [LICENSE.md](../LICENSE.md) for licensing information.
