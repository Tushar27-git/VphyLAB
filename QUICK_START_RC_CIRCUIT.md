# RC Circuit Simulator - Quick Start Guide

## Access the Simulator

1. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

2. **From the Dashboard**:
   - Look for **MOD-05: RC Circuit Simulator** in the experiments grid
   - Click **INITIALIZE SIMULATION** button
   - Or use the sidebar: **Circuits & Electronics** → **RC Circuit Simulator**

3. **Direct URL**:
   ```
   http://localhost:3000/circuits/rc-circuit
   ```

## How to Use

### Step 1: Preparation
- Click the **Main Power** toggle to turn ON the circuit
- Ensure **Charging** and **Discharging** switches are OFF
- Ensure **Dump** switch is ready

### Step 2: Charging Phase
1. Click **Charging** switch to ON
2. Click **Start** on the stopwatch
3. Watch the voltmeter needle rise exponentially
4. Every 10 seconds, record the voltage:
   - Read the voltmeter value
   - Enter Time (s) and Voltage (V) in the table
   - Click **Record Current** or **Add Manual**
5. Continue until voltage reaches ~5V (saturates)
6. Click **Stop** on the stopwatch

### Step 3: Transition
1. Click **Stop** and **Reset** on the stopwatch
2. Click **Charging** switch to OFF

### Step 4: Discharging Phase
1. Click **Discharging** switch to ON
2. Click **Start** on the stopwatch
3. Watch the voltmeter needle fall exponentially
4. Record voltage readings every 10 seconds (same as charging)
5. Continue until voltage reaches ~0V
6. Click **Stop** on the stopwatch

### Step 5: Analysis
1. View the **Graph** showing your experimental data
2. The dashed line shows the theoretical exponential curve
3. Compare your data points to the theoretical curve
4. In the **Results & Validation** section:
   - Calculate and enter: Half-Life (T₁/₂), Capacitance (C), Time Constant (τ)
   - Click **Validate Results**
   - Green checkmark = Correct (within 5%)
   - Red percentage = Error (outside 5%)

## Key Values to Remember

| Parameter | Value |
|-----------|-------|
| Time Constant (τ) | 47 seconds |
| Half-Life (T₁/₂) | 32.57 seconds |
| Capacitance (C) | 0.0047 F |
| At τ (charging) | 3.16V (63.2% of 5V) |
| At T₁/₂ (charging) | 2.5V (50% of 5V) |

## Tips for Accurate Results

1. **Record data at regular intervals** (every 10 seconds recommended)
2. **Be precise** when reading the voltmeter
3. **Use the "Record Current" button** for quick, accurate entries
4. **Check the theoretical curve** to see if your data matches
5. **Calculate carefully** using the formulas:
   - T₁/₂ = 0.693 × τ
   - C = T₁/₂ / (0.693 × R)
   - τ = R × C

## Troubleshooting

### Voltmeter not moving?
- Check if Main Power is ON
- Check if Charging or Discharging switch is ON
- Try clicking **Dump** to reset, then start again

### Stopwatch not running?
- Click **Start** button (should turn amber/orange)
- Make sure a phase (Charging or Discharging) is active

### Data not appearing in graph?
- Make sure you've added observations to the table
- Check that Time and Voltage values are valid
- Try clicking **Record Current** to add current values

### Results showing high error?
- Double-check your calculations
- Verify you're using the correct formulas
- Compare your data points to the theoretical curve
- Try recording more data points for better accuracy

## Reset Everything

Click the **Reset Lab** button in the top-right corner to:
- Clear all observations
- Reset the graph
- Clear the results form
- Reset all switches to OFF
- Reset the voltmeter to 0V
- Reset the stopwatch to 00:00.0

## Formulas Used

### Charging Equation
```
V(t) = V₀(1 - e^(-t/RC))
```
Where:
- V(t) = voltage at time t
- V₀ = 5V (supply voltage)
- R = 10,000Ω
- C = 0.0047F
- t = elapsed time (seconds)

### Discharging Equation
```
V(t) = V_peak · e^(-t/RC)
```
Where:
- V(t) = voltage at time t
- V_peak = voltage at start of discharge
- R = 10,000Ω
- C = 0.0047F
- t = elapsed time (seconds)

### Key Calculations
```
τ (Time Constant) = R × C = 10,000 × 0.0047 = 47 seconds

T₁/₂ (Half-Life) = τ × ln(2) = 47 × 0.693 = 32.57 seconds

C (Capacitance) = T₁/₂ / (0.693 × R)
```

## Expected Results

### Charging Phase
- Voltage rises from 0V to ~5V
- Follows exponential curve: V(t) = 5(1 - e^(-t/47))
- At 47 seconds: V ≈ 3.16V
- At 32.57 seconds: V ≈ 2.5V

### Discharging Phase
- Voltage falls from ~5V to 0V
- Follows exponential decay: V(t) = 5 × e^(-t/47)
- At 47 seconds: V ≈ 1.84V (36.8% of 5V)
- At 32.57 seconds: V ≈ 2.5V (50% of 5V)

## Need Help?

- Check the **System Constants** panel on the left
- Review the **Theoretical Values** in the Results section
- Compare your graph to the theoretical curve (dashed line)
- Ensure your calculations match the formulas above

---

**Happy experimenting!** 🔬⚡
