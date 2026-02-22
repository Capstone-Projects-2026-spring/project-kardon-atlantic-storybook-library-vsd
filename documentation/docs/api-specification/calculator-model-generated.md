# Class Documentation

(generated using [Javadoc to Markdown](https://delight-im.github.io/Javadoc-to-Markdown/)) 

Storybook Library VSD project. It includes the Supabase client for backend communication, client-side logging utility, and the interactive hotspot editor component that manages local state and user actions on storybook pages.

* Author: 

## supabaseClient

**Purpose**  
This module provides the backend communication interface for the frontend.

**Data Fields**

* `supabase`  
  * Type: SupabaseClient  
  * Purpose: Initialized client for all Supabase operations.

**Methods**

* `createClient`  
  * Purpose: Creates Supabase client instance.
  * Post-conditions: Client initialized and ready for use. 
  * **Parameters:** None (uses env vars)  
  * Return Value and Output Variables: `SupabaseClient`  
  * Exceptions Thrown: Error if env vars missing
 
## Logger

**Purpose**  
This utility logs user actions and errors for debugging.

**Data Fields**

* None

**Methods**

* `log`  
  * Purpose: Logs a message with timestamp and level.
  * Pre-conditions: Console available.
  * Post-conditions: Message logged.
  * **Parameters:** `message (string), level (string, optional)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

* `logError`  
  * Purpose: Specialized error logging.
  * Pre-conditions: Console available.
  * Post-conditions: Error logged.
  * **Parameters:** message `(string), error (any, optional)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None


## HotspotInterpreter

**Purpose**  
This component interprets user input (mouse/touch events on the canvas) and converts them into hotspot behaviors (create, move, resize, delete, edit word).

**Data Fields**

* `hotspots`  
  * Type: array of objects  
  * Purpose: Holds all hotspots the user has created on the current page (each with id, word, coordinates, shape_type).

* `selectedHotspot`  
  * Type: object | null  
  * Purpose: Holds the currently selected/edited hotspot for updating word or size.

* `shapeMode`  
  * Type: string  
  * Purpose: Determines the current drawing mode ('rectangle' or 'circle').

* `isDragging`  
  * Type: boolean  
  * Purpose: Tracks whether the user is actively dragging to create a new hotspot.

* `dragStart / dragCurrent`  
  * Type: object | null  
  * Purpose: Store starting and current mouse positions during drag for coordinate calculation.

**Methods**

* `handleMouseDown`  
  * Purpose: Starts hotspot creation when user presses down on canvas.
  * Pre-conditions: Konva stage mounted and image loaded.
  * Post-conditions: Drag started, start position recorded.  
  * **Parameters:** `e (KonvaEventObject<MouseEvent>)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

* `handleMouseMove`  
  * Purpose: Updates drag preview position during hotspot creation.
  * Pre-conditions: Drag in progress (isDragging true).
  * Post-conditions: Current position updated for preview.
  * **Parameters:** `e (KonvaEventObject<MouseEvent>)`  
  * Return Value and Output Variables: void  
  * Exceptions Thrown: None

* `handleMouseUp`  
  * Purpose: Finalizes new hotspot, calculates coordinates/size, and adds to state.
  * Pre-conditions: Drag started and valid size (min 10px).
  * Post-conditions: New hotspot added to array, drag state reset.
  * **Parameters:** `None`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

* `handleHotspotClick`  
  * Purpose: Selects an existing hotspot for editing.
  * Pre-conditions: Hotspot exists in array.
  * Post-conditions: Selected hotspot updated.
  * **Parameters:** `id (string), word (string)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

* `handleDeleteHotspot`  
  * Purpose: Removes a hotspot from the list and clears selection.  
  * **Parameters:** `id (string)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

* `handleUpdateWord`  
  * Purpose: Updates vocabulary word of selected hotspot.  
  * **Parameters:** `newWord (string)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

* `handleUpdateSize`  
  * Purpose: Resizes selected hotspot (clamped 10–200).  
  * **Parameters:** `newSize (number)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

* `handleMoveHotspot`  
  * Purpose: Updates position of a hotspot after drag.  
  * **Parameters:** `id (string), newCoordinates (object)`  
  * Return Value and Output Variables: `void`  
  * Exceptions Thrown: None

## HotspotManagerment

**Purpose**  
This component manages hotspot state, rendering, and interactions on the canvas (Konva Stage/Layer).

**Data Fields**

* `image`  
  * Type: `object | null`  
  * Purpose: Loaded page image for the canvas background.

**Methods**

* `render()`  
  * Purpose: Renders the Konva canvas with image, hotspots, and drag preview.
  * Pre-conditions: Image loaded, state valid.
  * Post-conditions: Canvas updated with current state.  
  * **Parameters:** `None`  
  * Return Value and Output Variables: `JSX.Element`  
  * Exceptions Thrown: None


