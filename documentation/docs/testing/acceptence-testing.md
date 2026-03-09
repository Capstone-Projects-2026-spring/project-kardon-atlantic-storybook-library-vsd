---
sidebar_position: 4
---
# Acceptance test

All acceptance tests are in src/__tests__/acceptance/ and use Vitest + React Testing Library to simulate user scenarios 

Acceptance Test for Use Case 1 - User logs in
A user would like to log in to access their books.
Upon opening the app, the user enters email and password. The system verifies credentials and loads the session.
Details

* Runs test_user_login_success
* Passes if all tests pass.

Acceptance Test for Use Case 2 - User creates a book and adds hotspot
A user would like to create a book and add interactive hotspots to a page.
Upon upload, the book is saved. In the editor, the user draws a hotspot and adds a word.
Details

* Runs test_book_creation_success
* Runs test_hotspot_add_success
* Passes if all tests pass.

Acceptance Test for Use Case 3 - User clicks hotspot and logs action
A user would like to interact with hotspots in editor/reader mode.
The user clicks a hotspot. The system logs the action (and future TTS).
Details

* Runs test_hotspot_click_logs_word
* Passes if all tests pass.

Acceptance Test for Use Case 4 - Shared book is read-only
A shared user would like to view but not edit a book.
The owner shares the book. The shared user views pages/hotspots but cannot edit.
Details

* Runs test_shared_book_read_only_rls
* Passes if all tests pass.

Manual Tests
These scenarios require a real browser and user interaction and were tested manually.

User logs in with valid credentials

1. Open the app in a browser
2. Enter email and password
3. Submit login

Observed Result: Passed, user authenticated and redirected to book library.

User adds hotspot to page

1. Open hotspot editor for a book page
2. Drag to create hotspot
3. Enter word (e.g., "apple")
4. Save

Observed Result: Passed, hotspot appears on canvas and saves to Supabase.

User clicks hotspot

1. Open editor/reader with hotspots
2. Click a hotspot

Observed Result: Passed, logger records "User clicked hotspot: \"apple\"", (future TTS plays word).

Shared user views book

1. Owner shares book with another user
2. Shared user opens shared book link
3. Attempt to edit hotspot

Observed Result: Passed, shared user sees pages/hotspots but cannot edit (RLS enforced).
