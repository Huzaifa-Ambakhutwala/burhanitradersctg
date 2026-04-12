import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { db, storage } from './firebase'

/**
 * Deletes every product document, its image subcollection, and Storage objects.
 * Admin-only; call from UI after confirmation.
 */
export async function deleteAllProducts(onProgress) {
  const productsSnap = await getDocs(collection(db, 'products'))
  const total = productsSnap.docs.length
  let done = 0

  for (const pDoc of productsSnap.docs) {
    const productId = pDoc.id
    const imagesSnap = await getDocs(collection(db, 'products', productId, 'images'))
    for (const img of imagesSnap.docs) {
      const data = img.data()
      if (data.storagePath) {
        try {
          await deleteObject(ref(storage, data.storagePath))
        } catch {
          /* already removed */
        }
      }
      await deleteDoc(doc(db, 'products', productId, 'images', img.id))
    }
    await deleteDoc(doc(db, 'products', productId))
    done += 1
    onProgress?.(done, total)
  }
}
