---

### CI328 Lecture 14 - Multiplayer Games

- Semester Overview
- Introduction to multiplayer
- Assessment

---

#### Feedback from Semester 1

- Assignments
- References
- Importance of Feedback

---

#### Structure

- Fewer lectures / more tutorials to facilitate learning
- Multiplayer Game Architecture
- Application Layer Architecture
- Data Structures
- Error Handling / Latency

---

#### Architecture Types

Server-Client: (1-1), (1-n), (m-n)

Implementation details: "dumb" client, client-side prediction, client replication

---

#### Data Structures

- Basic Concepts
- Serialization / Deserialization
- Efficiency
- Performance
- Security

---

#### Multiplayer Types

- Co-op
- PvP (Solo, Teams)
- MMO

---

#### General Problems

Question: what problems do we deal with when writing a network based game?

---

#### General Problems

- Code complexity
- Lag
- Out of sync game objects, i.e. invalid state
- Hardware problems (we don't have 100% control over the connection)

---

#### Possible Solutions

- Libraries exist to deal with complex code
- Client can predict behaviour + immediate game response, e.g. animation
- Authorative server
- Robust code to handle exceptions

---

#### Assignment

- A multiplayer game (Server - any language, Client - JS)
- Recommended 2 students per team, min 1, max 3
- 60% of the module
- Released 1-2 weeks of Sem 2

---

#### Conclusion

- Do not underestimate the complexity of multiplayer
