# VphyLAB - Virtual Physics Laboratory

VphyLAB is a web-based physics simulation platform designed for university-level experimental physics education. The platform provides interactive, high-fidelity simulations of classical physics experiments with real-time data logging, visualization, and cloud storage capabilities.

## Dashboard

The central hub provides access to all experiment modules with an integrated data management system. Users can track completed sessions, view recent experiment logs, and export data in CSV format. The dashboard displays system metrics including available modules, logged sessions, and total data points recorded. Each experiment is accessible through dedicated module cards with unique identifiers and descriptions.

## Experiments

### 1. Bar Pendulum (Module O-01)

This experiment determines the acceleration due to gravity using a compound pendulum model. A uniform bar with 19 suspension holes allows measurement of oscillation periods at different distances from the center of gravity.

**Key Features:**
- Interactive bar pendulum with selectable suspension points
- Real-time oscillation simulation with smooth animation
- Digital stopwatch for precise time measurement
- Automatic calculation of time period from 20 oscillations
- Dynamic T vs L characteristic curve generation
- Theoretical value comparison with experimental data
- Observation table with dual-side measurements

**Theory:**
The experiment uses the compound pendulum equation T = 2π√((k² + l²) / gl) where k is the radius of gyration, l is the distance from center of gravity, and g is gravitational acceleration. By plotting T² against l, the acceleration due to gravity can be determined from the slope and intercept.

### 2. Optical Fibre - Numerical Aperture (Module MOD-02)

This experiment measures the light-gathering capability of an optical fiber by analyzing its acceptance cone and diffraction patterns. The simulation projects a laser beam through a fiber and measures the resulting spot diameter at various distances.

**Key Features:**
- Real-time laser spot visualization with diffraction effects
- Precision digital calipers for diameter measurement
- Adjustable projection distance control
- Engineered grid system for accurate measurements
- Automatic numerical aperture calculation
- Data telemetry panel with recorded measurements
- Cloud storage integration for experimental data

**Theory:**
Numerical aperture (NA) is calculated using NA = sin(θ) where θ is the half-angle of the acceptance cone. By measuring the spot diameter D at distance d, the angle can be determined from tan(θ) = (D/2) / d, allowing calculation of the fiber's light-gathering capacity.

### 3. Newton's Rings (Module O-21)

This experiment determines the radius of curvature of a plano-convex lens through interference pattern analysis. A microscope view shows concentric interference rings formed between a curved lens surface and a flat glass plate.

**Key Features:**
- Interactive microscope workspace with adjustable focus
- Real-time interference ring visualization
- Crosshair positioning system for ring measurement
- Observation table for recording ring diameters
- Automatic wavelength calculation from ring data
- Setup schematic diagram for experimental understanding
- Theory card with detailed mathematical derivations

**Theory:**
The radius of curvature R is calculated using the formula R = (D_n² - D_m²) / (4λ(n-m)) where D_n and D_m are diameters of the nth and mth dark rings, and λ is the wavelength of light. The experiment uses sodium light (589 nm) to create visible interference patterns.

### 4. 2D Spectrometer (Module MOD-04)

This experiment analyzes atomic emission spectra and determines wavelengths of spectral lines using a plane transmission grating. The top-down view shows a collimator, grating table, and rotatable telescope for precise angle measurements.

**Key Features:**
- Interactive spectrometer apparatus with draggable components
- Telescope and grating table with fine angle control
- Eyepiece HUD showing spectral lines in real-time
- Vernier scale readings (V1 and V2) for both sides
- Digital stopwatch for timing measurements
- Comprehensive observation table with color-coded entries
- Automatic wavelength calculation using grating equation
- Percentage error analysis against known hydrogen lines

**Theory:**
The grating equation d·sin(θ) = nλ relates the grating spacing d, diffraction angle θ, order n, and wavelength λ. By measuring angles for known spectral lines (hydrogen Balmer series), the grating constant can be verified and unknown wavelengths determined. The experiment uses a 15,000 lines per inch transmission grating.

### 5. RC Circuit Simulator (Module C-01)

This experiment studies the exponential charging and discharging behavior of a capacitor in a resistor-capacitor circuit. The simulation demonstrates time-dependent voltage changes and allows verification of RC time constant theory.

**Key Features:**
- Digital voltmeter with real-time voltage display
- Circuit control switches for power, charging, and discharging
- Capacitor dump function for instant discharge
- Integrated stopwatch for time measurements
- Observation table for recording voltage-time data
- Real-time graph plotting experimental and theoretical curves
- Results form for calculating time constant and half-life
- System constants reference panel

**Theory:**
During charging, voltage follows V(t) = V₀(1 - e^(-t/RC)) and during discharging V(t) = V₀e^(-t/RC) where RC is the time constant. The experiment uses R = 10kΩ and C = 4700μF, giving a theoretical time constant of 47 seconds. The half-life T₁/₂ = RC·ln(2) represents the time for voltage to reach half its maximum value.

## Technical Stack

**Frontend Framework:** Next.js 16.2.1 with React 19 for server-side rendering and optimal performance. The App Router architecture provides file-based routing and improved data fetching patterns.

**Styling:** Tailwind CSS 4 for utility-first styling with custom design system. Provides responsive layouts and consistent theming across all experiment modules.

**Data Visualization:** Recharts 3.8.0 for rendering interactive graphs and charts. Used extensively in RC Circuit and Bar Pendulum experiments for plotting experimental data against theoretical curves.

**Physics Simulation:** Matter.js 0.20.0 for physics engine capabilities. Custom hooks manage experiment-specific calculations and state management for real-time simulations.

**Backend Services:** Firebase 12.11.0 for cloud data storage and authentication. Enables persistent experiment logs, session tracking, and CSV export functionality across all modules.
