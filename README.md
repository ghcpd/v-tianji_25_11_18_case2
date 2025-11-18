# Admin Analytics & User Management Platform

A complete, multi-page admin analytics and user management platform built with React, TypeScript, and modern front-end technologies.

## Features

- **Dashboard**: Interactive charts, graphs, and metrics with filtering capabilities
- **User Management**: Searchable, filterable, sortable user list with pagination and bulk actions
- **Reports**: Generate and download reports (PDF/CSV) with customizable metrics
- **Settings**: Manage user preferences and system configurations with validation

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation & Running

**On Unix/Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**On Windows:**
```cmd
start.bat
```

**Or manually:**
```bash
npm install
npm run dev
```

The application will open at `http://localhost:5173` (or the next available port).

## Testing

```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Main application pages
- `src/services/` - API service layer
- `src/data/` - Mock data generators
- `src/types/` - TypeScript type definitions
- `src/__tests__/` - Unit tests

## Technologies

- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.8
- React Router DOM 6.20.0
- Recharts 2.10.3
- Jest + React Testing Library

For detailed documentation, see [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md).

