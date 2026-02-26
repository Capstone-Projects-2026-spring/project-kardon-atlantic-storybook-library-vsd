/** The React component for uploading JPEG images to Supabase Storage
 * error handling for non-JPEG files and 
 * displays the uploaded image if the upload is successful.
 */

import { useState } from 'react'
import { uploadImage, getImageUrl } from '../lib/storage'

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState(null)
  const [error, setError] = useState(null)

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    // Check if the file is JPEG
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      setError('Only JPEG images are allowed.')
      return
    }

    setError(null) // clear previous errors

    const path = await uploadImage(file)
    if (path) setImageUrl(getImageUrl(path))
  }

  return (
    <div>
      <input type="file" accept="image/jpeg" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />}
    </div>
  )
}