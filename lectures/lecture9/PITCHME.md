---

### CI328 Lecture 9 - Level Building

- Content Generation
- Simple Text / Custom Data Structure
- Level Parsing

---

#### Last Week Recap

- AI

---

#### Content Generation

- Manual
- Procedural (auto)
- Hybrid (auto + manual refinement)

---

#### Manual Levels

- Use an editor, e.g. Tiled Map Editor
- High quality levels
- Slow

---

#### Auto Levels

- Define what a "good level" is
- Write an algorithm to generate "levels"
- Use algorithm parameters to control "goodness"
- Fast

---

#### Hybrid

- Generate some number of "good" levels
- Play through the levels or let AI play
- Pick best ones and manually refine

---

#### Level Design

- Integrate tutorials as part of gameplay / story
- Do not dump all information from start, only on a need-to-know basis
- Consider AI and points of interest

---

#### Difficulty

Player scaling vs world scaling

- Increase linearly
- Use a sine wave, increasing min/max each time
- Define own curve

---

#### Serialization

- Automatic
- Manual
- Check points

---

#### Data Structure

- Simple 2D array text
- Intermediate ".xml", ".json"
- Custom binary format

---

#### Generate Mario level - Case Study

- Procedurally generate a platformer level

---

#### Conclusion

- Level design significantly affects gameplay
- Important to get "right"
- Common patterns exist

---

#### Tutorial

- Integrate design points in your levels