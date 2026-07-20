# Movie & TV Streaming App

A full-stack web application built with React, Vite, Tailwind CSS, and Express. It browses trending movies and TV shows and plays them using public embed servers.

## Features
- **Browse & Search:** Discover trending movies and TV shows, or search for specific titles.
- **Multiple Servers:** Watch media using integrated fallback servers (e.g. Vidlink, EmbedSU) to bypass downtime.
- **Responsive Design:** A clean, modern UI optimized for both desktop and mobile devices.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, TypeScript

## Prerequisites
- Node.js (v18 or higher recommended)
- A TMDB API key (optional but recommended for real metadata access; falls back to mock data otherwise)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   TMDB_API_KEY=your_tmdb_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Building for Production

To build the application for production:
```bash
npm run build
```
Then start the production server:
```bash
npm run start
```
