import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from './firebase'

export async function uploadCategoryImage(categoryId, file) {
  const ext = file.name.split('.').pop() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase()) ? ext.toLowerCase() : 'jpg'
  const path = `category-images/${categoryId}/${crypto.randomUUID()}.${safeExt}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  const downloadURL = await getDownloadURL(storageRef)
  await updateDoc(doc(db, 'categories', categoryId), {
    image: downloadURL,
    updatedAt: serverTimestamp(),
  })
  return downloadURL
}

export async function removeCategoryImageFromStorage(imageUrl) {
  if (!imageUrl || !imageUrl.includes('firebasestorage')) return
  try {
    const u = new URL(imageUrl)
    const pathMatch = u.pathname.match(/\/o\/(.+)/)
    if (!pathMatch) return
    const filePath = decodeURIComponent(pathMatch[1].replace(/\+/g, ' '))
    await deleteObject(ref(storage, filePath))
  } catch {
    /* ignore */
  }
}
