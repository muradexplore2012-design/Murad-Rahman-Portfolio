import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

/**
 * Uploads an image or file to Firebase Storage with progress tracking.
 * @param file The file to upload
 * @param folder Destination folder, e.g., 'projects', 'profile', 'services'
 * @param onProgress Optional progress callback (0 - 100)
 */
export async function uploadAsset(
  file: File,
  folder = 'uploads',
  onProgress?: UploadProgressCallback
): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized. Please check your storage bucket configuration in .env");
  }

  // 1. Validate file size (max 5MB)
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("ফাইলটির সাইজ অনেক বড়। সর্বোচ্চ ৫MB সাইজের ফাইল আপলোড করতে পারবেন।");
  }

  // 2. Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf'
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP, SVG) বা PDF আপলোড করা যাবে।");
  }

  // 3. Unique file path
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${folder}/${timestamp}_${sanitizedName}`;
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) {
          onProgress(percent);
        }
      },
      (error) => {
        console.error("Storage upload failed:", error);
        let msg = "আপলোড ব্যর্থ হয়েছে।";
        if (error.code === 'storage/unauthorized') {
          msg = "অনুমতি নেই। Firebase Storage Rules এ এডমিন অনুমতি নিশ্চিত করুন।";
        } else if (error.code === 'storage/canceled') {
          msg = "আপলোড বাতিল করা হয়েছে।";
        }
        reject(new Error(msg));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
