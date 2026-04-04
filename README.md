# 🧪 VphyLAB: Virtual Physics Laboratory

Welcome to **VphyLAB**, a high-precision, interactive virtual environment for physics experimentation. This platform is designed to provide students and researchers with a seamless digital interface for exploring complex physical phenomena through advanced simulations and data-driven analysis.

---

## ⚡ Quick Start: How to Open

To launch the virtual laboratory on your local machine, follow these simple steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 20 or higher recommended)
- [npm](https://www.npmjs.com/) (installed alongside Node.js)

### Installation & Execution
1.  **Clone the Repository** and navigate to the project directory.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Launch the Development Server**:
    ```bash
    npm run dev
    ```
    *Alternatively, on Windows, you can simply run the `start.bat` file.*
4.  **Access the Lab**:
    Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔬 Core Experiment Modules (Prominent Features)

Our virtual lab currently supports four specialized experimental modules:

| Module | Experiment | Description |
| :--- | :--- | :--- |
| **MOD-01** | **Bar Pendulum** | Analyze the simple harmonic motion of a rigid bar. Determine the radius of gyration and calculate the precise value of acceleration due to gravity ($g$). |
| **MOD-02** | **Optical Fibre** | Explore wave propagation in optical waveguides. Measure the numerical aperture (NA) and the acceptance angle using high-fidelity spatial simulations. |
| **MOD-03** | **Newton's Rings** | Observe the interference pattern created by light reflection between two surfaces. Measure the diameters of the rings to calculate the wavelength of light. |
| **MOD-04** | **2D Spectrometer** | A dual-window simulation for analyzing light spectra. Measure the prism's refractive index and calculate dispersive power with micrometric precision. |

---

## 🛠️ Technology Stack & Analysis

VphyLAB is built using a modern, scalable web architecture designed for performance and interactivity:

-   **Frontend Framework**: [Next.js 16](https://nextjs.org/) (React 19) for a blazing-fast, server-side rendered user interface.
-   **Physics Engine**: [Matter.js](https://brm.io/matter-js/) for accurate, deterministic physical simulations.
-   **Data Visualization**: [Recharts](https://recharts.org/) for real-time plotting of experimental observations.
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for a sleek, responsive, and hardware-accelerated UI design.
-   **Icons**: [Lucide React](https://lucide.dev/) for intuitive visual navigation.
-   **Backend (Optional)**: [Firebase Integration](https://firebase.google.com/) for persistent data storage and laboratory logging.

---

## 📂 Project Structure Overview

The codebase is organized following best-in-class React/Next.js conventions:

-   `src/app`: Contains the application routing and main entry points.
-   `src/components/experiments`: Houses the logic and UI for specific simulations (Optics, Oscillations, etc.).
-   `src/features`: Logic hooks and feature-specific utilities for experiments.
-   `src/lib`: Shared helper functions and global configurations.
-   `public`: Static assets, including simulation textures and icons.

---

## 🚀 Advanced Deployment

To build a production-ready version of the laboratory:

```bash
npm run build
npm start
```

*This project was developed with a focus on educational integrity and interactive excellence.*

