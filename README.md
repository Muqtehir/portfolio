# Muqtehir Mayaleeke - Portfolio

Personal portfolio for Muqtehir Mayaleeke, a full-stack developer. The site presents selected projects, skills, background, and contact details in a responsive, interactive experience.

**Live site:** [portfolio.izzatudeenmuqtehir.workers.dev](https://portfolio.izzatudeenmuqtehir.workers.dev/)

## Features

- Project, skills, about, and contact sections
- Responsive layout with light and dark themes
- Animated interactions and a Three.js hero scene
- Resume download
- Contact form powered by EmailJS

## Tech stack

- React 19 and Vite
- Tailwind CSS
- Three.js with React Three Fiber and Drei
- Framer Motion and GSAP

## Getting started

Requirements: Node.js and npm.

```sh
cd frontend
npm install
npm run dev
```

Vite prints the local development URL when the server starts.

## Available scripts

Run these commands from `frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production site into `frontend/dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run check:placeholders` | Check portfolio data for unfinished square-bracket placeholders |

## Contact form configuration

The contact form uses EmailJS in the browser. Public identifiers have defaults for the deployed site. To use your own EmailJS service, copy `frontend/.env.example` to `frontend/.env.local` and set the `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` values. Configure the EmailJS template recipient and variables as described in the example file.

Vite environment variables are included in the client bundle. Only use EmailJS public configuration here; never put private keys or secrets in `VITE_` variables.

## Project structure

```text
frontend/
  public/       Static assets, including the resume
  scripts/      Project validation scripts
  src/
    components/ UI sections and components
    data/       Portfolio content
```
