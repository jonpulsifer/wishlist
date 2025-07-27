# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD.

## Workflows

### CI (`ci.yml`)
- **Triggers**: Push to main branch, Pull requests
- **Purpose**: Build and test the application
- **Features**:
  - Sets up PostgreSQL database
  - Installs dependencies with pnpm
  - Runs build process
  - Executes tests
  - Uses Node.js 22

### Lint and Type Check (`lint.yml`)
- **Triggers**: Push to main branch, Pull requests
- **Purpose**: Code quality checks
- **Features**:
  - Runs Biome linting
  - Performs TypeScript type checking
  - Fast execution (5-minute timeout)

### Deploy (`deploy.yml`)
- **Triggers**: Push to main branch
- **Purpose**: Production deployment
- **Features**:
  - Production build
  - Deployment templates for various platforms
  - Currently commented out - configure based on your hosting platform

## Required Secrets

Set up these secrets in your GitHub repository settings:

- `TURBO_TOKEN`: For Turbo cache (optional)
- `VERCEL_ID`: For Turbo team (optional)
- `NEXTAUTH_SECRET`: For NextAuth.js
- `DATABASE_URL`: Production database URL
- `DIRECT_URL`: Direct database connection URL

## Environment Setup

The workflows automatically:
1. Create PostgreSQL databases for testing
2. Copy `.env.example` to `.env` files
3. Set up Node.js environment with pnpm

## Database Setup

The CI workflow uses a PostgreSQL service container and creates a `wishlist` database for testing. The database setup script is located at `.github/scripts/create-multiple-postgresql-databases.sh`.

## Customization

### Adding Tests
Update the `test` script in `package.json` to run your actual test suite:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Deployment Configuration
Uncomment and configure the deployment steps in `deploy.yml` based on your hosting platform:
- Vercel
- Railway
- Docker
- Other platforms

### Environment Variables
Add any additional environment variables to `.env.example` and update the workflows as needed.