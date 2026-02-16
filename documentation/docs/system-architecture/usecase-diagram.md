---
sidebar_position: 6
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


```
---
## Use Case 2 – Signing In (User / Caretaker)

**Goal**: As a user, I want to log into my account so I can access my saved storybooks.

```mermaid
sequenceDiagram
    participant User
    participant App as Application/Frontend
    participant Backend as Server/Backend
    participant DB as Database
    alt Successful Login
        User->>App: Open application
        App-->>User: Display landing page
        User->>App: Select "Login"
        App-->>User: Display login form
        User->>App: Enter email, password
        App->>+Backend: POST /login {email, password}
        activate Backend
        Backend->>+DB: Validate credentials (query + hash compare)
        DB-->>-Backend: Credentials valid
        Backend-->>-App: 200 OK + session/JWT token
        deactivate Backend
        App->>User: Redirect to home page with library
    else Invalid Credentials
        User->>App: Enter email, password
        App->>+Backend: POST /login {email, password}
        activate Backend
        Backend->>+DB: Validate credentials
        DB-->>-Backend: Credentials invalid
        Backend-->>-App: 401 Unauthorized + error message
        deactivate Backend
        App-->>User: Notify "Invalid credentials"
    end
```
---
## Use Case 3 – Uploading Book (User / Caretaker)

**Goal**: As a user, I want to upload a book so I can create a VSD storybook.

```mermaid
sequenceDiagram
    participant User
    participant App as Application/Frontend
    participant Backend as Server/Backend
    participant Storage as File Storage (Supabase Storage)
    Note over User,App: User must be authenticated
    User->>App: Navigate to library page
    App-->>User: Display library view
    User->>App: Select "Upload Book"
    App-->>User: Open file picker dialog
    User->>App: Choose PDF or image file(s)
    App->>+Backend: POST /upload {multipart file, metadata}
    activate Backend
    Backend->>+Storage: Upload file to bucket
    Storage-->>-Backend: Success + public URL / file ID
    Backend->>DB: Create book record (title from file?, user_id, file_url)
    DB-->>Backend: Book ID created
    Backend-->>-App: 200 OK + book ID / metadata
    deactivate Backend
    App->>User: Open uploaded book in VSD Edit Mode
```
---
