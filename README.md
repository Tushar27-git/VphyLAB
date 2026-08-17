<div align="center">

# ⚡ VphyLAB — Virtual Physics Laboratory

### *Next-Generation Interactive Physics Simulation & Research Portal*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Physics Engine](https://img.shields.io/badge/Simulation-60_FPS_rAF_+_Matter.js-teal?style=for-the-badge&logo=electron&logoColor=white)](https://brm.io/matter-js/)
[![Data Viz](https://img.shields.io/badge/Visualization-Recharts_3.8-22c55e?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![Cloud Storage](https://img.shields.io/badge/Telemetry-Firebase_12-FFA611?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>An advanced, web-based physics laboratory designed for university-level experimental physics, research simulation, and interactive STEM education.</strong>
</p>

---

</div>

## 🌌 About the Project

**VphyLAB** bridges the gap between theoretical physics equations and tangible laboratory apparatus. Built as a high-fidelity virtual research platform for university students, educators, and researchers, VphyLAB delivers mathematically rigorous, real-time physics simulations with zero-latency visual feedback, integrated digital instrumentation, dynamic observation logging, and instant cloud telemetry export.

The user interface is engineered with a **sleek, dark-mode research portal aesthetic** — enveloped in a deep obsidian backdrop (`#020617`) with subtle engineered radial coordinate grids, accented with radiant neon teal (`#2dd4bf`) and cobalt blue glowing indicators. The workspace embraces tactile, skeuomorphic laboratory instrumentation: digital stopwatches with millisecond precision, travelling micrometers with calibrated vernier scales, optical crosshair viewfinders with parallax panning, and dynamic analog/digital voltmeters. Typography is cleanly stratified across **Public Sans** for commanding scientific headings, **Space Grotesk** for telemetry parameters and monospaced readings, and **Inter** for effortless reading clarity.

---

## 🎯 Key Capabilities

- 🔬 **5 Rigorous Physics Experiments**: Covers classical mechanics, physical optics, wave interference, spectrometry, and circuit dynamics.
- ⚡ **Zero-Lag Simulation Engine**: Uses direct DOM writes and native `requestAnimationFrame` loops to bypass React reconciliation overhead for buttery-smooth 60 FPS physical animations.
- 📐 **True-to-Scale Virtual Instrumentation**: Precision vernier scales, micrometer screws, beam splitters, multi-gas discharge lamps, digital stopwatches, and voltmeter deflections.
- 📊 **Real-Time Characteristic Curve Plotting**: Interactive Recharts graphs with theoretical curve overlays and scatter point regressions.
- 📝 **Live Observation Tables**: Record experimental runs, calculate squared differentials and averages automatically, and eliminate manual calculation errors.
- ☁️ **Cloud Data Sync & CSV Export**: Synchronize session records to Firebase Firestore and download institution-ready CSV spreadsheets with one click.
- 📈 **Analytics & Performance Reports**: Track institutional laboratory utilization, module completion frequencies, and domain breakdown statistics.

---

## 🧪 Comprehensive Experiment Directory

```
VphyLAB Laboratory Catalog
├── Oscillation & Mechanics
│   └── 🟢 MOD-01: Bar Pendulum (Compound Pendulum Dynamics)
├── Optics & Modern Physics
│   ├── 🔵 MOD-02: Optical Fibre (Numerical Aperture & Acceptance Angle)
│   ├── 🟡 MOD-03: Newton's Rings (Interference & Lens Curvature)
│   └── 🟣 MOD-04: 2D Spectrometer (Grating Diffraction & Spectral Lines)
└── Circuits & Electronics
    └── 🔴 MOD-05: RC Circuit Simulator (Capacitive Transient Dynamics)
```

---

### 1. 🟢 MOD-01: Bar Pendulum (Module O-01)
> **Domain**: *Oscillation & Mechanics* | **Difficulty**: *Intermediate* | **Duration**: *35 – 45 mins*

Determines the acceleration due to gravity ($g$) and the radius of gyration ($k$) about the center of gravity using a symmetrical compound bar pendulum.

```
                    Hinge Pin (Pivot Axis)
                           │
       [ 1 2 3 4 5 6 7 8 9 │ 10 11 12 13 14 15 16 17 18 19 ]
         Side A (Holes 1-9)   CG   Side B (Holes 11-19)
```

#### 📐 Mathematical Formulation
The time period $T$ of a rigid uniform bar oscillating about a knife-edge suspension hole at distance $l$ from the center of gravity (C.G.) is given by:

$$T = 2\pi \sqrt{\frac{k^2 + l^2}{g \cdot l}} = 2\pi \sqrt{\frac{L'}{g}}$$

Where:
- $k = \frac{L}{\sqrt{12}}$ is the radius of gyration of the uniform bar of length $L$.
- $l$ is the distance from the knife-edge pivot to the center of gravity ($l = |n - 10| \times \Delta d$).
- $L' = \frac{k^2 + l^2}{l}$ is the length of the equivalent simple pendulum.
- $g = 4\pi^2 \frac{L'}{T^2}$ is the calculated gravitational acceleration ($9.81\text{ m/s}^2$).

#### 🎛️ Interactive Instrumentation & Controls
- **19-Hole Symmetrical Bar**: Select any suspension hole from $1$ to $19$ via slider or manual pick (Hole $10$ represents the un-oscillatable center of gravity).
- **Direct-Drive rAF Canvas**: The bar swings in an isolated animation loop driven by harmonic angle calculations ($\theta(t) = \theta_0 \cos(\omega t)$).
- **Integrated Digital Stopwatch**: Start, pause, and reset the timer; paused times snapshot the exact 20-vibration count ($T_{20}$).
- **Dynamic $T\text{ vs }l$ Characteristic Curve**: Real-time Recharts scatter plot drawing the dual-branched hyperbolic curve for Side A and Side B.
- **Observation Table & Gravitational Engine**: Logs distances and periods, computes equivalent pendulum length $L'$, and yields $g$ and $k$.

---

### 2. 🔵 MOD-02: Optical Fibre — Numerical Aperture (Module MOD-02)
> **Domain**: *Optics & Modern Physics* | **Difficulty**: *Advanced* | **Duration**: *40 – 50 mins*

Measures the light-gathering capability, acceptance angle ($\theta_{\text{max}}$), and beam divergence of step-index and graded-index optical fibres under laser excitation.

```
 Fiber Tip          Air Gap (d)             Projection Screen
    ══╦══>  ──────────────────────────>  ( ( ( Laser Spot D ) ) )
      ╚═══════════════ θ ══════════════>  [ Caliper Left | Right ]
```

#### 📐 Mathematical Formulation
The Numerical Aperture ($\text{NA}$) describes the range of angles over which the optical fiber can accept or emit light:

$$\text{NA} = \sin(\theta_{\text{max}}) = \frac{r}{\sqrt{r^2 + d^2}} = \frac{D / 2}{\sqrt{(D / 2)^2 + d^2}}$$

Where:
- $d$ is the screen projection distance from the optical fiber output facet ($\text{mm}$).
- $D$ is the measured diameter of the projected laser spot ($\text{mm}$).
- $r = D / 2$ is the spot radius.
- $\theta_{\text{max}} = \arcsin(\text{NA})$ is the maximum acceptance cone angle.

#### 🎛️ Interactive Instrumentation & Controls
- **HTML5 2D Pixel-Engine Canvas**: Displays the high-intensity red laser beam with radial Gaussian glow and outer diffraction halo.
- **Adjustable Screen Distance ($d$)**: Precision slider ranging from $5.0\text{ mm}$ to $30.0\text{ mm}$ with real-time beam divergence expansion.
- **Precision Dual-Jaw Calipers**: Drag left jaw ($-20\text{ mm}$ to $0\text{ mm}$) and right jaw ($0\text{ mm}$ to $+20\text{ mm}$) with step increments of $0.05\text{ mm}$.
- **Slide-out Telemetry Drawer**: Logs recorded diameters across projection distances and saves the aperture dataset to cloud storage.

---

### 3. 🟡 MOD-03: Newton's Rings (Module O-21)
> **Domain**: *Optics & Modern Physics* | **Difficulty**: *Intermediate* | **Duration**: *45 – 60 mins*

Analyzes circular interference fringes produced by an air film enclosed between a plano-convex lens and an optically flat glass plate to determine the wavelength of monochromatic sodium light ($\lambda$) and lens curvature radius ($R$).

```
           Microscope Objective (Travelling on Micrometer)
                                 │
                            [ 45° Plate ] <── [ Sodium Lamp 589nm ]
                                 │
                    ( Plano-Convex Lens )
                 ═══════════════════════════ Flat Glass Plate
                  ((((( Interference Rings )))))
```

#### 📐 Mathematical Formulation
For constructive and destructive interference in reflected light at normal incidence, the diameter $D_n$ of the $n^{\text{th}}$ dark ring is governed by:

$$D_n^2 = 4 n \lambda R$$

Taking two rings separated by order $m$ (e.g., $n+m$ and $n$):

$$D_{n+m}^2 - D_n^2 = 4 m \lambda R \implies \lambda = \frac{D_{n+m}^2 - D_n^2}{4 m R} \quad \text{and} \quad R = \frac{D_{n+m}^2 - D_n^2}{4 m \lambda}$$

Where:
- $\lambda = 589\text{ nm} = 5.89 \times 10^{-7}\text{ m}$ (Sodium D-line wavelength).
- $R$ is the radius of curvature of the plano-convex lens ($1.00\text{ m}$).
- $D_n, D_{n+m}$ are ring diameters measured across the micrometer crosswires.

#### 🎛️ Interactive Instrumentation & Controls
- **Apparatus Workbench**: Sodium vapor discharge lamp with power switch, $45^\circ$ glass plate beam reflector, and optical flat base.
- **Dual-Axis Travelling Microscope**:
  - **Horizontal X-Translation**: $0.00\text{ mm}$ to $50.00\text{ mm}$ micrometer screw with $0.01\text{ mm}$ Vernier steps.
  - **Focal Zoom (Y-Axis)**: $X20$ to $X200$ optical depth magnification.
- **Procedural Eyepiece HUD**: Renders concentric monochromatic interference fringes with central dark minimum, radial parabolic width thinning, parallax panning, and etched crosshairs.
- **Multi-Ring Observation Ledger**: Records left/right crosshair tangents, computes $D_n$ and $D_n^2$, and derives the slope $\frac{D_{n+m}^2 - D_n^2}{m}$.

---

### 4. 🟣 MOD-04: 2D Spectrometer (Module MOD-04)
> **Domain**: *Optics & Modern Physics* | **Difficulty**: *Advanced* | **Duration**: *50 – 65 mins*

Analyzes discrete atomic emission spectra (Hydrogen Balmer series, Mercury, Helium, Neon) and determines optical diffraction angles and grating constants using a high-precision plane transmission diffraction grating.

```
       Collimator (180° Slit) ──> [ Grating Table (Rotatable) ] ──> Telescope (0°-360°)
                                              │
                                  [ Eyepiece Viewfinder HUD ]
                                 [ Spectral Lines: Violet, Blue, Green, Red ]
```

#### 📐 Mathematical Formulation
Diffraction through a transmission grating with grating spacing $d = \frac{1}{N}$ (where $N = 15,000\text{ lines/inch} \approx 5.905 \times 10^5\text{ lines/m}$) follows:

$$(a + b) \sin(\theta) = n \lambda \implies d \sin(\theta) = n \lambda$$

For atomic Hydrogen emission, spectral lines follow the Rydberg formula:

$$\frac{1}{\lambda} = R_H \left( \frac{1}{n_1^2} - \frac{1}{n_2^2} \right)$$

Where:
- $\theta$ is the angle of diffraction ($|\text{Telescope Angle} - \text{Collimator Angle}|$).
- $n = 1, 2, \dots$ is the diffraction order.
- $R_H \approx 1.097 \times 10^7\text{ m}^{-1}$ is the Rydberg constant.

#### 🎛️ Interactive Instrumentation & Controls
- **Top-Down Protractor Disc**: $360^\circ$ circular goniometer stage with degree markings.
- **Draggable & Lockable Arms**: Independently orient and lock the collimator slit, central diffraction grating table, and viewing telescope.
- **Dual Vernier Windows ($V_1$ & $V_2$)**: Reads telescope angle $V_1$ and opposite angle $V_2 = (V_1 + 180^\circ) \bmod 360^\circ$ with $\pm 0.1^\circ$ fine stepping.
- **Real-Time Eyepiece HUD**: Disperses distinct spectral bands across the reticle as the telescope traverses diffraction angles.
- **Observation Table & Error Engine**: Compares experimental wavelengths with theoretical spectral lines and computes percentage deviation.

---

### 5. 🔴 MOD-05: RC Circuit Simulator (Module C-01)
> **Domain**: *Circuits & Electronics* | **Difficulty**: *Beginner* | **Duration**: *30 – 40 mins*

Investigates transient charging and discharging kinetics of an electrolytic capacitor in a Resistor-Capacitor (RC) network to determine the circuit time constant ($\tau$) and voltage half-life ($t_{1/2}$).

```
  [ V0 = 5V DC Supply ] ─── [ Master Switch ]
           │
      ┌────┴────┐
 [ Charging ] [ Discharging ] ─── [ R = 10 kΩ ] ─── [ C = 4700 µF ] ─── [ Ground ]
           │
    [ Voltmeter ] ─── [ Real-Time Oscilloscope Graph (V vs t) ]
```

#### 📐 Mathematical Formulation
The time-dependent voltage $V(t)$ across the capacitor during charge and discharge cycles is given by:

$$\text{Charging Phase:} \quad V(t) = V_0 \left(1 - e^{-\frac{t}{RC}}\right)$$

$$\text{Discharging Phase:} \quad V(t) = V_{\text{peak}} \, e^{-\frac{t}{RC}}$$

Where:
- $R = 10\text{ k}\Omega = 10,000\ \Omega$ (Series Resistor).
- $C = 4700\ \mu\text{F} = 0.0047\text{ F}$ (Capacitor).
- $\tau = R \cdot C = 10,000 \times 0.0047 = 47.00\text{ seconds}$ (Theoretical Time Constant).
- $t_{1/2} = \tau \cdot \ln(2) \approx 47.00 \times 0.69315 \approx 32.58\text{ seconds}$ (Voltage Half-Life).

#### 🎛️ Interactive Instrumentation & Controls
- **Dual Analog & Digital Voltmeter**: Needle deflection with glowing 7-segment numeric voltage readout.
- **Circuit Control Bank**: Master power switch, single-pole double-throw (SPDT) charge/discharge toggle, and instant capacitor charge dump button.
- **Synchronized Millisecond Stopwatch**: Zero/start/pause controls tied to circuit state.
- **Dual-Curve Oscilloscope Plot**: Recharts dynamic graph rendering experimental sample markers directly on top of theoretical exponential curves.
- **Results Calculator**: Evaluates percentage accuracy for experimental time constant $\tau_{\text{exp}}$ against the theoretical value ($47.0\text{ s}$).

---

## 💻 Tech Stack & Simulation Architecture

VphyLAB combines modern frontend engineering, high-performance animation loops, physics engines, and cloud persistence:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             VphyLAB Architecture                            │
├───────────────────────────────┬─────────────────────────────────────────────┤
│  Frontend Presentation Layer  │  Next.js 16 (App Router) + React 19         │
│  Styling & Visual Design      │  Tailwind CSS v4 + PostCSS (@theme tokens)  │
│  Mathematical & Physics Engine│  Custom React Hooks + Pure Analytical Math  │
│  Direct-DOM Simulation Loop   │  requestAnimationFrame (60 FPS, No React Lag)│
│  2D Canvas Rendering          │  HTML5 2D Context + Radial Gradient Engine  │
│  Rigid Body Physics Engine    │  Matter.js v0.20                            │
│  Scientific Data Visualization│  Recharts v3.8 (Scatter, Area, Bar, Pie)    │
│  Cloud Persistence & Auth     │  Firebase v12 (Firestore Database)          │
│  Iconography & Typography     │  Lucide React + Google Fonts                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### ⚙️ How the Simulation Engine Works

1. **Analytical Differential Modeling**:
   - Every experiment is backed by custom mathematical hooks (`useBarPendulum`, `useNumericalAperture`, `useRCCircuit`) and physics modules (`src/lib/physics/`). Rather than imprecise approximations, all formulas are computed using exact analytical solutions to classical differential equations.

2. **Direct-DOM & `requestAnimationFrame` Pipeline**:
   - For high-frequency motion (such as the swinging compound pendulum or micrometer rail panning), VphyLAB bypasses React's virtual DOM reconciliation. 
   - State coordinates are stored in mutable `useRef` instances (e.g., `angleRef`, `simTimeRef`) and written directly to DOM elements (`element.style.transform = ...`) within native `requestAnimationFrame` loops, ensuring a constant **60 frames per second** with zero garbage collection stutter.

3. **Custom HTML5 2D Canvas Engines**:
   - The Optical Fibre laser projection and travelling microscope viewfinder leverage dedicated HTML5 Canvas contexts. Pixel-mapped coordinate systems handle Gaussian laser intensity, diffraction gradients, dynamic caliper measurements, and procedural ring rendering.

4. **Synchronized Telemetry & Data Logging**:
   - Observations captured in the virtual apparatus are structured into JSON data arrays, formatted into ISO-standard tables, synced asynchronously to **Firebase Firestore**, and rendered into exportable CSV files.

---

## 🗂️ Project Directory Structure

```
d:/readmefiles/
├── public/                     # Static assets, SVG schematics, and textures
├── src/
│   ├── app/                    # Next.js 16 App Router Pages
│   │   ├── circuits/           # RC Circuit Experiment Route
│   │   │   └── rc-circuit/page.tsx
│   │   ├── data-log/           # Central Experiment Data Log & CSV Center
│   │   │   └── page.tsx
│   │   ├── experiments/        # Experiments Directory & Search Hub
│   │   │   └── page.tsx
│   │   ├── optics/             # Optics Routes
│   │   │   ├── fiber-aperture/page.tsx
│   │   │   ├── newtons-rings/page.tsx
│   │   │   └── spectrometer/page.tsx
│   │   ├── oscillation/        # Oscillation Routes
│   │   │   └── bar-pendulum/page.tsx
│   │   ├── reports/            # Lab Analytics & Performance Charts
│   │   │   └── page.tsx
│   │   ├── settings/           # Graphics, Audio & Researcher Settings
│   │   │   └── page.tsx
│   │   ├── globals.css         # Tailwind CSS v4 Theme Configuration
│   │   ├── layout.tsx          # Root Layout & Typography Definitions
│   │   └── page.tsx            # Main Research Portal Dashboard
│   ├── components/             # Reusable UI & Experiment Components
│   │   ├── experiments/        # Experiment-specific viewfinders & apparatus
│   │   │   ├── optics/         # Newton's Rings & Spectrometer HUDs
│   │   │   └── oscillation/    # Bar Pendulum tables & theory cards
│   │   ├── layout/             # PortalLayout, Sidebar & MainStage wrappers
│   │   └── shared/             # Reset buttons & shared widgets
│   ├── features/               # Domain-specific simulation hooks & state
│   │   ├── circuits/           # RC circuit hooks (useRCCircuit) & components
│   │   ├── observation/        # Generic observation table interfaces
│   │   ├── optics/             # Numerical aperture hooks (useNumericalAperture)
│   │   └── oscillation/        # Pendulum hooks (useBarPendulum)
│   └── lib/                    # Core libraries, Firebase API, physics formulas
│       ├── firebase/           # Firebase initialization & Firestore logging
│       └── physics/            # Newton's rings & spectrometer geometry solvers
├── package.json                # Project dependencies & build scripts
├── tsconfig.json               # TypeScript strict configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to set up and run VphyLAB on your local development machine:

### 📋 Prerequisites
- **Node.js**: `v18.17.0` or later (Node 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari with WebGL / HTML5 Canvas enabled

### 📥 1. Clone the Repository
```bash
git clone https://github.com/Tushar27-git/VphyLAB.git
cd VphyLAB
```

### 📦 2. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 🔧 3. Environment Setup (Optional)
VphyLAB functions out of the box with offline local storage fallbacks. To connect your own Firebase Firestore backend for persistent cloud logging, create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 💻 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🏗️ 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🏛️ Institutional Accreditation

Developed for and maintained as part of the **Core Physics Research & Undergraduate STEM Curriculum** at **Guru Tegh Bahadur Institute of Technology (GTBIT)**.

---

## 🤝 Contributing

Contributions, bug reports, and experiment module proposals are warmly welcomed!
1. Fork the Project (`https://github.com/Tushar27-git/VphyLAB/fork`)
2. Create your Feature Branch (`git checkout -b feature/NewExperimentModule`)
3. Commit your Changes (`git commit -m 'feat: add Franck-Hertz experiment simulation'`)
4. Push to the Branch (`git push origin feature/NewExperimentModule`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](file:///d:/readmefiles/LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for physics enthusiasts and researchers worldwide.</sub>
</div>
