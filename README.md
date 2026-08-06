# Student Professional Portfolio - Practical 3: API Integration

An interactive, responsive React portfolio application built using Vite, React Router v6, and Tailwind CSS.

## Features
- **Client-Side Routing**: Home, Projects, Contact pages, with a Custom 404 handler.
- **Theme Toggle**: Dark/Light mode state stored in `localStorage`.
- **Dynamic Projects (GitHub API)**: Fetches repository feed dynamically from the GitHub REST API.
  - Interactive Search Filter by repository name or description.
  - Loading State Indicator (CSS animated spinner).
  - Robust Error Message display with a manual "Retry Fetch" option.
  - Dynamic visual styling (repository language tags, stars count, and unique card gradients).

## Setup and Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Developer Server**:
   ```bash
   npm run dev
   ```
3. **Build Application**:
   ```bash
   npm run build
   ```

## API Details
- **Base Endpoint**: `https://api.github.com/users/joshimanthan/repos`
- **Rate Limits**: Unauthenticated rates are limited to 60 requests per hour by GitHub. In case of rate limits, the UI gracefully renders a rate error state with a recovery retry button.
