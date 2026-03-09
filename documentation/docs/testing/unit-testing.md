---
sidebar_position: 1
---
# Unit tests

## **supabaseClient initializes without errors**

- **Description**: Verify that the Supabase client is created correctly from environment variables.
- **Pre-conditions**: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in `.env`.
- **Test Steps**:
  1. Import supabase from the client file.
  2. Check if supabase is defined and has expected methods.
- **Expected Results**: supabase is a valid SupabaseClient object with auth/from/storage methods.
- **Post-conditions**: No errors during initialization; client ready for use.

## **logger.log formats and logs message correctly**

- **Description**: Ensure log messages are formatted with timestamp and level.
- **Pre-conditions**: None.
- **Test Steps**:
  1. Spy on console.log.
  2. Call log('Test message', 'INFO').
  3. Verify console output.
- **Expected Results**: console.log called with "[timestamp] [INFO] Test message".
- **Post-conditions**: Message appears in console with correct format; no errors.

## **logger.logError logs error with details**

- **Description**: Verify error logging includes message and optional error object.
- **Pre-conditions**: None.
- **Test Steps**:
  1. Spy on console.log.
  2. Call logError('Failed to load', new Error('Network')).
  3. Verify console output.
- **Expected Results**: console.log called with "[timestamp] [ERROR] Failed to load" and Error object.
- **Post-conditions**: Error details logged; no crash.

## **logger.logHotspotClick records word**

- **Description**: Check that hotspot click events are logged with the word.
- **Pre-conditions**: None.
- **Test Steps**:
  1. Spy on console.log.
  2. Call logHotspotClick('apple').
  3. Verify output.
- **Expected Results**: Log contains "User clicked hotspot: \"apple\"".
- **Post-conditions**: Click event logged; no errors.

## **EditorPage adds hotspot correctly**

- **Description**: Verify adding a hotspot updates state.
- **Pre-conditions**: wordInput has a value.
- **Test Steps**:
  1. Set wordInput = "cat".
  2. Call addHotspot().
  3. Check hotspots array.
- **Expected Results**: New hotspot added with word "cat" and current page.
- **Post-conditions**: hotspots length increased by 1; wordInput cleared.

## **EditorPage removes hotspot correctly**

- **Description**: Ensure removing a hotspot updates state.
- **Pre-conditions**: hotspots array has at least one item.
- **Test Steps**:
  1. Set hotspots with one item (id: 123).
  2. Call removeHotspot(123).
  3. Check hotspots.
- **Expected Results**: hotspots array is empty.
- **Post-conditions**: Hotspot removed; no errors.

## **EditorPage saves comment**

- **Description**: Verify saving a comment updates state.
- **Pre-conditions**: comment input has text.
- **Test Steps**:
  1. Set comment = "Great page!".
  2. Call saveComment().
  3. Check savedComment.
- **Expected Results**: savedComment = "Great page!" and alert shown.
- **Post-conditions**: Comment saved in state.

## **Logger logs book selection**

- **Description**: Ensure book selection is logged.
- **Pre-conditions**: None.
- **Test Steps**:
  1. Spy on console.log.
  2. Call logBookSelection("The Very Hungry Caterpillar").
  3. Verify output.
- **Expected Results**: Log contains "User selected book: \"The Very Hungry Caterpillar\"".
- **Post-conditions**: Selection event logged.

## **HotspotEditor handleMouseUp creates hotspot (if component still used)**

- **Description**: Verify hotspot creation on mouse up.
- **Pre-conditions**: Drag in progress with valid size.
- **Test Steps**:
  1. Set dragStart and dragCurrent.
  2. Call handleMouseUp().
  3. Check hotspots.
- **Expected Results**: New hotspot added with calculated coordinates.
- **Post-conditions**: Drag state reset; hotspots updated.

### Notes
- Tests 1 to 4 target supabaseClient.js and logger.js (Jest mocks used for Supabase).
- Tests 5 to 8 target the current hotspot logic in `EditorPage` inside `App.jsx`.
- Tests 9 and 10 cover logging and any remaining HotspotEditor.jsx functionality.
