---

### CI328 Lecture 5 - Game Physics

- Collision Detection Techniques

---

#### Last Week Recap

- Game Maths

---

#### Representing Game Objects

- Objects have dimensions, e.g. width, height, depth
- Objects have an _anchor_ (position)

---

#### Game Physics

- Speed matters (functions get called many times in one frame)
- Need not be precise, just good enough
- Can utilise game specifics (e.g. platformer, tile based)

---

#### Collision Detection Phases

- Broad phase
- Narrow phase

---

#### AABB (Axis Aligned Bounding Box)

- Very fast
- Very easy to implement
- Extends to n dimensions
- Works in cases without rotations

---

#### SAT (Separating Axis Theorem)

- Slower
- Easy to implement
- Extends to n dimensions
- Works in cases with rotations

---

#### Grids

- Fast
- Easy to implement
- Extends to n dimensions
- Works in tile / grid based cases, as broad phase

---

#### Space Partioning (e.g. Quadtree)

- Speed depends on use case
- Harder to get "right"
- Extends to n dimensions
- Works only as broad phase

---

#### Pixel-level / Bitmap

- Very slow
- Relatively easy to implement
- Works only in 2D
- Works in cases with rotations

---

#### Continuous / Sweeping

- Slower
- Harder to get "right"
- Extends to n dimensions
- Mainly for fast moving objects or simulations

---

#### Special Cases

- Circle-circle collision
- Polygon clipping

---

#### Applying Concepts

- Demo AABB
- Demo SAT

---

#### High-level Usage

Old school

```java
if (obj1.collidesWith(obj2)) {
    // do smth
}
```

Modern

```java
addHandler(type1, type2, (obj1, obj2) -> {
    // do smth
})
```

---

#### Conclusion

- Physics, same as maths, very important for games
- Don't have to get exactly right
- Cheap and cheerful algorithms exist

---

#### Tutorial

- Use collision callbacks in your game