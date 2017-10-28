---

### CI328 Lecture 10 - Game Engine Development

- Self-contained Modules (Subsystems)
- Internal Communication
- Managing Complexity

---

#### Last Week Recap

- Level Design

---

#### Modules

- Graphics
- Audio
- Input
- Network
- etc.

---

#### Modules

- Important to manage complexity (like in any software)
- Split into self-contained units
- Handles low-level code and provides high-level API

---

#### Graphics

- Draw things to the screen
- Apply post-processing effects
- Visualize particles

---

#### Audio

- Sound playback
- Control volume / rate / pitch / speaker balance

---

#### Input

- Capture raw input from various sources
- Convert into game-specific context

---

#### Scripting Engine

- Allows to write game logic using a simple scripting language
- Runtime code hotswap

---

#### Physics

- Ensure entities are in valid states
- Check and handle collisions
- Simulate particle effects

---

#### AI

- Controls computer players
- Contains a collection of pathfinding / damage computation / game balancing algorithms

---

#### UI

- Provides a toolkit for UI and HUD controls
- On-screen effects and animations
- Notification system

---

#### Network

- Communicate between machines
- Read and write low-level byte data by converting to and from high-level domain objects

---

#### Event Bus

- Simple mechanism to communicate between modules
- Consists of event data structure, consumer and producer
- Can be used in any large software system

---

#### Conclusion

- Modern games use engines
- Simplifies a lot of code and provides commonly used templates

---

#### Tutorial

- Split tightly coupled code into modules and use event bus (Phaser Signal)