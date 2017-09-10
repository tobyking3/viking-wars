---

### CI328 Lecture 5 - Game Physics

- Collision Detection Techniques

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

- Broadphase
- Narrowphase

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
- Works in tile / grid based cases, as broadphase

---

#### Space Partioning (e.g. Quadtree)

- Speed depends on use case
- Harder to get "right"
- Extends to n dimensions
- Works only as broadphase

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
- Works only as broadphase

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

- Old school
```java
if (obj1.collidesWith(obj2)) {
    // do smth
}
```
- Modern
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