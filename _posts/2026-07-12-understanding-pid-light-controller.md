---
layout: post
title: "Understanding the PID Algorithm: A Light-Intensity Controller Example"
date: 2026-07-12 10:00:00
description: What P, I and D really do, worked out on a camera-brightness loop that talks to a light source over I2C.
tags: control-systems pid embedded 
categories: control
related_posts: false
toc:
  beginning: true
---

## What is a PID controller?

A **PID controller** is a feedback loop that keeps some measured quantity at a target value. It looks at the difference between where you *want* to be and where you *are*, and continuously adjusts an actuator to close that gap. The name comes from the three ways it reacts to that difference: **P**roportional, **I**ntegral, and **D**erivative.

PID is everywhere — a room heater holding a temperature, cruise control holding a speed, a motor holding an RPM. The idea is always the same: measure, compare, correct, repeat.

<!-- IMAGE PLACEHOLDER: generic PID block diagram -->
{% include figure.liquid loading="eager" path="assets/img/pid/pid_block.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">Block diagram of a PID controller in a closed loop.</div>

## The example we'll use

Instead of a heater, we'll control **image brightness**.

- A **constant light source** whose brightness is commanded over **I2C** in the range **0–255**. This is our **actuator**.
- A **camera** grabs a frame, and we take the **average grey level** of the image (also 0–255). This average is our **sensor reading**.
- We want the average to sit at **200**.

So the loop is:

> read frame → compute average intensity → compare with 200 → send a new brightness value over I2C → repeat.

If the image is too bright, we dim the light. If it's too dark, we push more. Nothing else changes the scene, so brightness is the one knob we turn.

<!-- IMAGE PLACEHOLDER: your closed-loop diagram (camera -> avg -> PID -> I2C -> light) -->
{% include figure.liquid loading="eager" path="assets/img/pid/loop_example.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">Our closed loop: camera average feeds the PID, which writes brightness back over I2C.</div>

## The vocabulary

| Term | Meaning | In our system |
|------|---------|---------------|
| **SP** (Set Point) | the value we want | 200 |
| **PV** (Process Variable) | the value we measure | average grey level, 0–255 |
| **SP high / SP low** | an acceptable band around the set point | e.g. 190–210 |
| **e** (error) | how far off we are | `e = SP − PV` |
| **CO** (Controller Output) | what we send to the actuator | brightness, 0–255 |

**SP high** and **SP low** define a tolerance band. If the PV lands inside 190–210 we're happy and
treat the target as met; this "deadband" stops the controller from constantly dithering the light
over tiny, meaningless errors.

## What P, I and D actually do

Each term looks at the error differently:

- **P — Proportional (the present).** Output proportional to *how big* the error is right now. Big error → big push. Fast, but on its own it leaves a permanent gap (it eases off exactly as it gets close).
- **I — Integral (the past).** Adds up error over time. Even a small leftover error keeps accumulating until the output grows enough to erase it. This is what removes the permanent gap.
- **D — Derivative (the future).** Looks at *how fast* the error is changing and damps sudden moves, reducing overshoot and oscillation.

The actuator then moves by the **sum** of these three contributions. In our loop that sum *is* the
brightness value we write over I2C, clamped to 0–255.

## Assumptions when writing a PID

A basic PID quietly assumes:

1. The plant is roughly **linear** near the operating point (more brightness → brighter image, in proportion).
2. The actuator responds in a **consistent direction** (increasing the command never darkens the image).
3. The loop runs at a **fixed sampling interval** $\Delta t$ (here, one camera/I2C cycle).
4. The sensor gives a **usable PV every cycle** (a valid frame average).
5. The output **saturates** to a physical range (0–255), which we must clamp.
6. Sensor **noise** is small or filtered — important, because the D term amplifies noise.

## The mathematics

In continuous time, the controller output is:

$$
CO(t) = K_p\, e(t) \;+\; K_i \int_0^{t} e(\tau)\, d\tau \;+\; K_d\, \frac{d e(t)}{dt}
$$

where $e(t) = SP - PV(t)$ and $K_p, K_i, K_d$ are the gains we tune.

Software runs in discrete steps, so we use the **discrete form**. With sample $k$ and interval $\Delta t$:

$$
e_k = SP - PV_k
$$

$$
CO_k = K_p\, e_k \;+\; K_i \sum_{j=0}^{k} e_j\,\Delta t \;+\; K_d\, \frac{e_k - e_{k-1}}{\Delta t}
$$

Reading it left to right: the **P** term scales the current error, the **I** term is a running sum of
all past errors, and the **D** term is the change in error since the last frame.

## How the error corrects the PV

The sign of the error decides the direction:

- **Image too dark**, PV = 0 → `e = 200 − 0 = +200` → large positive output → light brightens → PV rises.
- **Image too bright**, PV = 255 → `e = 200 − 255 = −55` → output driven down (toward 0) → light dims → PV falls.

As PV approaches 200, `e` shrinks, so the P and D contributions fade to nearly zero. At that point the
**integral term alone** holds the steady brightness needed to *stay* at 200 — this is why a P-only
controller can't fully get there.

### Worked example (Kp = 0.6, Ki = 0.25, Kd = 0.1)

> **Assumption — the light doesn't respond instantly.** A real light source plus camera
> can't jump to a new brightness in a single frame; they *settle* toward the commanded value.
> We model this with a simple first-order lag: each cycle the PV moves **40%** of the way from
> its current value toward the new command:
>
> $$ PV_{k+1} = PV_k + 0.4\,\big(CO_k - PV_k\big) $$
>
> So even when `CO` is driven to 0, the measured average doesn't become 0 immediately.
> For example, starting over-bright at `PV₀ = 255` with `CO₀ = 0`:
> `PV₁ = 255 + 0.4·(0 − 255) = 153`, which is why the next error is `e = 200 − 153 = 47`,
> not 200. (Set the factor to 1.0 for an instant-response plant; the loop then reaches the
> target faster but overshoots harder.)

**Starting dark (PV = 0):** first cycle `e = 200`, so `P = 0.6·200 = 120`, `I = 0.25·200 = 50`, `D = 0`,
giving `CO = 170`. The light jumps up and the image starts brightening:

| cycle | e | P | I | D | CO (brightness) | PV |
|------:|----:|----:|----:|----:|----:|----:|
| 0 | 200 | 120 | 50 | 0 | 170 | 0 |
| 2 | 97 | 58 | 107 | −4 | 162 | 103 |
| 5 | 45 | 27 | 151 | −1 | 177 | 155 |
| 10 | 16 | 10 | 182 | 0 | 192 | 184 |
| 20 | 2 | 1 | 198 | 0 | 199 | 198 |
| 39 | 0 | 0 | 200 | 0 | 200 | 200 |

**Starting over-bright (PV = 255):** first cycle `e = −55`, `CO` goes negative and clamps to **0** (light off),
so the image darkens fast; the loop then climbs back up to 200:

| cycle | e | P | I | D | CO (brightness) | PV |
|------:|----:|----:|----:|----:|----:|----:|
| 0 | −55 | −33 | 0 | 0 | 0 | 255 |
| 1 | 47 | 28 | 12 | 10 | 50 | 153 |
| 5 | 81 | 49 | 101 | −1 | 148 | 119 |
| 10 | 33 | 20 | 163 | −1 | 182 | 167 |
| 20 | 4 | 3 | 195 | 0 | 198 | 196 |
| 39 | 0 | 0 | 200 | 0 | 200 | 200 |

Notice how in both cases the **integral term grows toward ~200** and ends up carrying the whole output,
while P and D die away. That is the integral quietly removing the steady-state error.

<!-- IMAGE PLACEHOLDER: PV vs cycle response curves for both cases -->
{% include figure.liquid loading="eager" path="assets/img/pid/response_curve.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">PV converging to SP = 200 from a dark start and an over-bright start.</div>

## Coding it in Python

A minimal discrete PID for this loop:

```python
import time

SP = 200                         # target average grey level
Kp, Ki, Kd = 0.6, 0.25, 0.1
integ, e_prev = 0, 0

while True:
    pv = read_avg_intensity()    # mean of frame, 0-255
    e = SP - pv
    integ += e
    co = Kp*e + Ki*integ + Kd*(e - e_prev)
    co = max(0, min(255, co))    # clamp to actuator range
    set_brightness_i2c(int(co))  # write brightness over I2C
    e_prev = e
    time.sleep(0.05)
```

`read_avg_intensity()` returns your frame average; `set_brightness_i2c()` writes the byte to the light
over I2C. One practical fix worth adding later: freeze `integ` when `co` is clamped (anti-windup), so the
integral doesn't keep piling up while the actuator is already maxed out.

## Do you always need all three terms?

You can use any subset — each has a personality:

- **P only** — fast and simple, but leaves a permanent **steady-state offset**; it never quite reaches the set point.
- **PI** — the workhorse. P gives speed, I removes the offset. Best choice for our brightness loop.
- **PD** — fast with less overshoot, but still has offset. Good for positioning tasks where a small offset is fine.
- **PID** — all three; needed when you want speed *and* zero offset *and* damped overshoot.
- **I only** — no offset, but very sluggish and prone to oscillation. Rarely used alone.
- **D only** — produces **no output at steady state** (constant error → zero derivative), so it can't hold a set point. Never used by itself.

For our controller, **PI or PID** is the right call: we care about hitting exactly 200, so we need the integral.

## Tuning methods

Tuning means choosing $K_p, K_i, K_d$:

- **Manual (trial and error).** Raise $K_p$ until the response is quick but starts to oscillate, add $K_i$ to kill the offset, then add a little $K_d$ to calm overshoot. Fast to start, good enough for many systems.
- **Ziegler–Nichols.** Increase $K_p$ until the loop oscillates steadily; record that gain and its period, then read the P/PI/PID gains from the standard table. A systematic starting point.
- **Cohen–Coon.** Uses the plant's step response (gain, time constant, dead time); better for loops with delay.
- **Software auto-tune / relay method.** The controller perturbs the plant and fits the gains automatically — common in industrial controllers.

## Wrapping up

PID is three simple reactions — to the **present** (P), the **past** (I), and the **likely future** (D) —
summed into one actuator command. In our example that command is a 0–255 brightness written over I2C,
and the loop steadily drives the image average to 200 regardless of whether it started pitch black or
blown out. Start with P, add I to remove the offset, sprinkle D if you need to tame overshoot, and tune
from there.
