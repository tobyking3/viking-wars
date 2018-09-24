---

### CI328 Lecture 2 - Game Architecture

- Assignment
- Generic Architecture of Games

---

#### Assignment

- On StudentCentral

---

#### Question

- How do you design a game?
- Example: Mario

---

#### Game Design

- From idea to design
- What are the required aspects?
- What do you want your game to be?

---

#### Genre

- Platformer / RPG / casual / arcade / side-scroller
- The game genre has a profound effect on its design *and* implementation

---

#### Style

- Modern / retro / contemporary / cartoon
- The style affects the general feel and aesthetic design
- Especially assets will be affected

---

#### Software Design

- Now think about an application lifecycle
- How does the app start?
- What are the processes (behind scenes) that happen during start?

---

#### Game Architecture (Start)

- Entry point (take control from environment)
- Sanity check your environment (hardware, software)

---

#### Game Architecture (Init)

- Load settings
- Create contexts
- Load resources
- Load data

---

#### Game Architecture (Post Init)

- Main Menu
- Options (Audio, Video, Controls, etc)

---

#### Game Architecture (Main Loop)

- Input
- Update
- Render

---

#### Game Architecture (Cleanup)

- Save data
- Unload resources
- Destroy contexts 

---

#### Game Architecture (Exit)

- Return control to environment

---

#### Case Study (Mario) (Start)

Sanity check happens at command-line phase.
We don't know if UI is available.

```java
start() {
    if (!graphics.isPresent()) {
        exitWithError("Graphics not supported")
    }
    
    if (!audio.isPresent()) {
        exitWithError("Audio not supported")
    }
}
```

---

#### Case Study (Mario) (Init)

We know hardware / software is available.

```java
init() {
    // keep user notified
    startSplashScreen()

    // load settings, e.g. resolution, vsync, volume
    
    // use settings to create contexts, e.g. rendering context
    
    // load resources, e.g. images, sounds
    
    // load data, e.g. player level, map, enemies
}
```

---

#### Case Study (Mario) (Main Loop)

Simple conceptual old school loop.

```java
loop() {
    while (!exit) {
        // capture input
        input.isKeyPressed(Key.W)
        input.isButtonPressed(Mouse.LMB)
        
        // handle input
        if (Key.W) {
            // jump
        }
        
        for (e : entities) {
            update(e)
        }
        
        // handle collisions, invalid placement
        updatePhysics()
        
        for (e : entities) {
            render(e)
        }
    }
}
```

---

#### Case Study (Mario) (Main Loop)

Modern (framework-style) loop. Anything missing?

```java
loop() {
    while (!exit) {

    }
}
```

---

#### Case Study (Mario) (Main Loop)

Where did it all go? Callbacks!

```java
onKey(Key.W, { 
    // jump
})

onCollision(PLAYER, COIN, {
    // handle collision
})
```

---

#### Case Study (Mario) (Cleanup / Exit)

```java
exitGame() {
    // save player level, map, enemies

    // unload (release) image files, sound files
    
    // destroy contexts, e.g. renderer
    
    exit(0)
}
```

---

#### Conclusion

- Assignment
- One architecture design, infinitely many implementations

---

#### Next Week

- Project Management
- Phaser Architecture

---

#### Tutorial

- Create a GitHub repo for the assignment
- Deploy a static webpage
- Explore ideas for assignment
- Design your game architecture (use GitHub issues)
