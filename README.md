# Virtual Physics Lab

An advanced, interactive physics laboratory built for the web. This project provides a set of virtual modules for conducting standard physics experiments, featuring real-time simulations, data visualization, and a premium, modern UI.

## 🚀 Experiments Available

The lab currently includes the following interactive modules:

- **MOD-01: Bar Pendulum**  
  Investigate the time period of a bar pendulum and determine acceleration due to gravity ($g$).

- **MOD-02: Optical Fibre**  
  Study the numerical aperture and acceptance angle of a specialized optical fibre array.

- **MOD-03: Newton's Rings**  
  Observe interference patterns and determine the specific wavelength of sodium light.

- **MOD-04: 2D Spectrometer**  
  Use a high-precision spectrometer to measure angles of a prism and determine dispersive power.

## 🛠️ Tech Stack

This project is built using modern web technologies to ensure a highly responsive and visually rich experience:

- **Framework:** [Next.js (v16)](https://nextjs.org/) & [React (v19)](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS (v4)](https://tailwindcss.com/)
- **Physics Engine:** [Matter.js](https://brm.io/matter-js/) (for 2D physics simulations)
- **Data Visualization:** [Recharts](https://recharts.org/) (for rendering real-time experimental observation data)
- **Backend/Database:** [Firebase](https://firebase.google.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Utilities:** `clsx`, `tailwind-merge`

## ⚙️ Getting Started

First, ensure you have Node.js installed. Then, navigate to the project directory and install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. Select an experiment from the main dashboard to begin initializing the simulation.

## 💡 Project Structure

- `src/app/` - Next.js App Router containing pages and routing.
- `src/features/` - Contains the core logic, simulations, and UI for different domains:
  - `oscillation/` - Code for the Bar Pendulum experiment.
  - `optics/` - Code for optical experiments (Fibre, Newton's Rings, Spectrometer).
  - `observation/` - Tools for data collection, logging, and charts.
- `src/components/` - Reusable, modular UI components used across the laboratory.
- `src/lib/` - Shared utilities and helper functions.
