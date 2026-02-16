---
sidebar_position: 6
---

## Algorithms
### Object detection
- Detect clicks on VSD objects
- Each object is stored as a region: x coordinate, y coordinate, width, and height
1. Click coordinates (x1, y1)
2. Iterates through VSD objects on current page
3. Checks if click is inside the object's region

Given (x,y) as top left corner, w = width, and h = height 

If x1 >= x and x1 <= x + w and x1 >= y and y1 <= y + h

Then the click was inside the object's region, trigger the text-to-speech

Time complexity = O(n)
n = number of objects on page

### Canvas annotation
- User can create a new object on storybook page
1. Mouse click (x1, y1)
2. Dynamic rectangle preview
3. Mouse click (x2, y2)
4. Store region in database
Time Complexity = O(1)

### State Synchronization
- State -> UI -> User Event -> State Update -> Re-render
1. Compare previous componentree with new tree
2. Compute minimal changes
3. Apply batched document object model (DOM) updates
Time Complexity = O(n)

### Authentication and Security
- Supabase Auth uses bcrypt hashing algorithm
hash(inputPassword) == storedHash
1. Server generates JSON Web Token
2. Token signed using secret key
3. Client stores token
4. API request that includes Authorization: Bearer <JWT>
Server takes care of signature validity and expiration timestamp

### Database Query
- Relational database indexing
- Primary keys: book_id, page_id, and object_id
Queries are optimized using B-tree indexing
Time Complexity = O(logn)

### Neural Network in Text-To-Speech - finish with 11labs
- The system does not train its own neural network
- The system integrates with a pretrained deep learning speech model provided by ElevenLabs
1. Text encoding: input text is tokenized and converted into numerical embeddings.
2. Acoustic feature prediction: encoded text is passed through a decoder network to model rhythm.
3. Neural vocoder: converts the previous data into a raw audio waveform.
4. Speaker conditioning: encodes speech characteristics.

The system sends text and voice parameters to ElevenLabs API and receives an audio response.

Time Complexity = constant time external API call

### Audio Playback
- After audio is returned
1. Create audio object
2. Load binary stream
3. Decode into playable
4. Play through browser audio
Asynchronous and non-blocking

Time Complexity = O(n)
