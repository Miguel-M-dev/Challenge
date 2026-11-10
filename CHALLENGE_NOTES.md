# Day 2 — Neon Skyline Heist

Work is on branch `challenge`. The game opens at level 8 so you can try the bonus first. Press **N** to cycle levels, **R** to restart, **H** for hitboxes, and **T** for tuning. You can also append `?level=4` (or 5, 6, 7, 8) to the game URL. Change START_LEVEL back to 1 if your instructor wants the original starting screen.

| Level | What changed | How to play |
| --- | --- | --- |
| 4 — Sentry Post | Added the exact sentry and heart definitions and their S/h legend entries. | Jump over sentries or bait them into a gap. The heart adds one life. |
| 5 — Fixer Upper | Moved the spawn enemy farther away; opened the coin chamber; added three one-way escape steps inside the gem pit; opened the flag cage. All seven coins and the gem remain. | Grab the chamber coin, three upper coins, the pit gem and three coins on the right. Climb out using the ledges, then jump up to the flag. |
| 6 — The Wall | MAX_AIR_JUMPS changed from 0 to 1. | Hold the first jump, release near its peak, then press again to clear the wall. |
| 7 — Low Ceiling | Kept exactly the same tuning as level 6. | Run to the edge, tap jump for a short hop, release, then tap again over the gap. Holding jump too long reaches the spikes. |
| 8 — Neon Skyline Heist | Original 120-column neon rooftop adventure with 33 treasures, four enemy types, a lower vault, high caches, hearts, power-ups and a final tower. | Use the rooftop route or descend into the vault. The vault has escape steps. Double-jump up the final tower. |

Only one tuning value differs from defaults: `MAX_AIR_JUMPS: 1` (par 1). For the default-tuning Challenge 2 demonstration, press T and set MAX_AIR_JUMPS to 0; reload afterwards to restore the saved setting. All other values already match the defaults.

The bonus uses mint platform edges, purple ledges, pink hazards, a pale cyan player and a gold flag against a dark violet sky. The original engine and first three maps are unchanged.

## Verification and remaining evidence

Run `node tests/challenges.cjs` from the project folder. These checks run the actual movement and collision code at 60 Hz, validate all maps, and search terrain routes. They check that all eight Fixer Upper treasures can be collected on a route to the flag with default tuning. They also check routes through the wall, ceiling and bonus maps. They do not simulate moving enemies, pickup buffs or browser rendering, and are not a substitute for playing the game.

You still need to capture real **Level complete!** screenshots for the assignment: level 4 after collecting the heart; level 5 showing the +500 all-treasure bonus; and levels 6 and 7 using the same saved tuning. No completion screenshots have been fabricated.
