import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadHeroImage(file, uploadedByUid) {
  const ext = file.name.split('.').pop() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase()) ? ext.toLowerCase() : 'jpg'
  const path = `hero-images/${crypto.randomUUID()}.${safeExt}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: uploadedByUid ? { uploadedBy: uploadedByUid } : undefined,
  })
  const downloadURL = await getDownloadURL(storageRef)
  return { downloadURL, storagePath: path }
}

export async function deleteHeroImage(storagePath) {
  if (!storagePath) return
  try {
    await deleteObject(ref(storage, storagePath))
  } catch {
    // ignore
  }
}

