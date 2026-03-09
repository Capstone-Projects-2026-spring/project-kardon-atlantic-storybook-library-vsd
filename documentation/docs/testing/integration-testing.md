---
sidebar_position: 2
---
# Integration tests

All integration tests are in src/_ _tests_ _/integration/ and use Vitest with mocked Supabase client to simulate backend calls without a real server.

Integration Test for Use Case 1 - User logs in
A user would like to log in to access their books.
Upon opening the app, the user enters their email and password. The system verifies credentials and loads the session.
Details

* Runs test_supabase_login_success
* Passes if all tests pass.

Integration Test for Use Case 2 - User creates a book
A user would like to upload and create a new storybook.
Upon selecting upload, the user enters title and image. The system saves the book to the books table.
Details

* Runs test_book_insert_success
* Passes if all tests pass.

Integration Test for Use Case 3 - User adds a hotspot
A user would like to add interactive hotspots to a page.
Upon opening the hotspot editor, the user draws a hotspot and adds a word. The system saves it to the hotspots table.
Details

* Runs test_hotspot_insert_success
* Passes if all tests pass.

Integration Test for Use Case 4 - User uploads a page image
A user would like to upload an image for a book page.
The system uploads the file to Supabase Storage and saves the URL in the pages table.
Details

* Runs test_image_upload_success
* Passes if all tests pass.

Integration Test for Use Case 5 - User clicks a hotspot
A user would like to interact with hotspots in reader/editor mode.
Upon clicking a hotspot, the system logs the action and (future) triggers TTS.
Details

* Runs test_logger_on_hotspot_click
* Passes if all tests pass.

Integration Test for Use Case 6 - Shared book is read-only
A shared user would like to view but not edit a book.
The owner shares the book. The shared user queries and attempts update.
Details

* Runs test_rls_shared_book_read_only
* Passes if all tests pass.
