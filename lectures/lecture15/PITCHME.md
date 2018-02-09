---

### CI328 Lecture 15 - Multiplayer Game Architecture

- Architecture Types
- Advantages & Disadvantages

---

#### Architecture Types 1

Server-Client: (1-1)

- Server is a host and also its own client.
- Limited to two people.
- Easy to implement.

---

#### Architecture Types 2

Server-Client: (1-n)

- Server is typically a headless dedicated server.
- Very common and reasonably easy to implement.

---

#### Architecture Types 3

Server-Client: (m-n)

- Server comprises multiple machines, maybe in different locations.
- Difficult to get the implementation right.

---

#### Implementation Details 1

"Dumb" client

Client is the View / Controller and Server is the Model.

---

#### Implementation Details 2

Client-side prediction

Client interpolates movements based on input.

---

#### Implementation Details 3

Client replication

Objects and data are replicated on the client based
on replication specification.
For example, properties are only replicated when needed.

---

#### Conclusion

In a similar way to single player games, various architecture types exist.
To gain high performance it is crucial to pick the right architecture type.
