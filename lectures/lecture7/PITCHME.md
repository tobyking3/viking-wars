---

### CI328 Lecture 7 - Game World

- ECS (Entity Component System)
- Queries

---

#### Last Week Recap

- Good Programming Practices

---

#### ECS - Entity

- **Everything** is an entity
- Without extra information an entity is like an object without fields and methods
- The most primitive entity is just an `int`

---

#### ECS - Component

- Holds data & behaviour
- Defines an entity
- Self-contained, but may depend on other components (e.g. view depends on position)

---

#### ECS - System

- Holds a collection of components of the same type
- Performs bulk operations

---

#### ECS - Example Component


```
class MoveableComponent extends Component {

    constructor() {
        this.x = 0.0;
        this.y = 0.0;
    }
}

```

---

#### ECS - Example Entity


```
let entity = new Entity();

// now entity knows about its position and that it can move
entity.addComponent(new MoveableComponent());
```

---

#### Advantages

- Composition over Inheritance (no inheritance hell, all objects are at the same level)
- Can mix components easily, e.g. add `AIComponent` to player entity,
add `PlayerComponent` to enemy entity
- Scaling and management (each component has a clearly defined dependency) 

---

#### Disadvantages

- Redundant iteration (recall collision checks)
- More verbose API:
```
entity.getComponent(MoveableComponentType).velocity = new Vec2();
```
- Need to manage communication between components

---

#### ECS - Updating

Every component defines an update:


```
class MoveableComponent extends Component {

    constructor(velocity) {
        this.x = 0.0;
        this.y = 0.0;
        this.velocity = velocity;
    }
    
    update(tpf) {
        x += velocity.x * tpf;
        y += velocity.y * tpf;
    }
}

```

---

#### ECS - Example Update


```
let entity = new Entity();
entity.addComponent(new MoveableComponent(new Vec2(100, 50)));
```

Whenever `update()` is called, `entity` moves.
Each update is called by the corresponding System,
but who controls the Systems?

---

#### ECS - Game World

- Collection of Systems (which are a collection of entities)
- _Can_ be a collection of entities based on its architecture (e.g. Entity Component Control mechanism)
- Responsible for entity updates and queries

---

#### Conclusion

- ECS - a powerful pattern in game dev
- Entities - just generic objects
- Components - add "flavour" to entities
- Systems - update components

---

#### Tutorial

- Implement ECS in your game, otherwise continue working on your game
