import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from './firebase'

const IMAGES = 'images'

export async function listProductImages(productId) {
  const snap = await getDocs(collection(db, 'products', productId, IMAGES))
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  list.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0
    const tb = b.createdAt?.toMillis?.() ?? 0
    return tb - ta
  })
  return list
}

export async function uploadProductImage(productId, file, uploadedByUid) {
  const ext = file.name.split('.').pop() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase()) ? ext.toLowerCase() : 'jpg'
  const path = `product-images/${productId}/${crypto.randomUUID()}.${safeExt}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file, { contentType: file.type })
  const downloadURL = await getDownloadURL(storageRef)

  const col = collection(db, 'products', productId, IMAGES)
  const docRef = await addDoc(col, {
    downloadURL,
    storagePath: path,
    isPrimary: false,
    createdAt: serverTimestamp(),
    uploadedBy: uploadedByUid,
  })

  const images = await listProductImages(productId)
  if (images.length === 1) {
    await setPrimaryImage(productId, docRef.id)
  }

  return { id: docRef.id, downloadURL, storagePath: path }
}

export async function deleteProductImage(productId, imageId, imageData) {
  if (imageData?.storagePath) {
    try {
      await deleteObject(ref(storage, imageData.storagePath))
    } catch {
      // already deleted
    }
  }
  await deleteDoc(doc(db, 'products', productId, IMAGES, imageId))

  const productRef = doc(db, 'products', productId)
  const remaining = await listProductImages(productId)
  const primary = remaining.find((i) => i.isPrimary) || remaining[0]
  await updateDoc(productRef, {
    primaryImageUrl: primary?.downloadURL || null,
  })
}

export async function setPrimaryImage(productId, imageId) {
  const images = await listProductImages(productId)
  const batch = writeBatch(db)
  for (const img of images) {
    const r = doc(db, 'products', productId, IMAGES, img.id)
    batch.update(r, { isPrimary: img.id === imageId })
  }
  const chosen = images.find((i) => i.id === imageId)
  batch.update(doc(db, 'products', productId), {
    primaryImageUrl: chosen?.downloadURL || null,
  })
  await batch.commit()
}
