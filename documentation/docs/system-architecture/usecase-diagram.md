---
sidebar_position: 3
---

# Use Case Diagrams

Sequence diagrams showing the data flow for all use cases. One sequence diagram corresponds to one use case and different use cases should have different corresponding sequence diagrams.

---

## Use Case 1 – Account Creation (User / Caretaker)

**Goal**: As a user, I want to create an account so I can save and manage my storybooks.

```mermaid
sequenceDiagram
    participant User
    participant App as Application/Frontend
    participant Backend as Server/Backend
    participant DB as Database
    User->>App: Open application
    App-->>User: Display landing page
    User->>App: Select "Register"
    App-->>User: Display registration form
    User->>App: Enter username, email, password
    App->>+Backend: POST /register {username, email, password}
    activate Backend
    Backend->>+DB: Check for existing user (query)
    DB-->>-Backend: No existing user
    Backend->>DB: Insert new user record
    DB-->>Backend: Insertion successful
    Backend-->>-App: 201 Created + confirmation
    deactivate Backend
    App-->>User: Show confirmation message
    App->>User: Redirect to home/library page
