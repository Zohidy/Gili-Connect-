/**
 * Converts a file to a Base64 string for storage in Firestore.
 * Note: Firestore has a 1MB limit per document. We limit to 800KB to account for Base64 overhead.
 * @param file The file to convert
 * @returns Promise<string> The Base64 data URL
 */
/**
 * Converts a file to a Base64 string for storage in Firestore.
 * Note: Firestore has a 1MB limit per document. We limit to 800KB to account for Base64 overhead.
 * @param file The file to convert
 * @returns Promise<string> The Base64 data URL
 */
export const uploadFile = async (file: File): Promise<string> => {
  if (file.size > 800 * 1024) {
    throw new Error('File is too large. Please select an image smaller than 800KB.');
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
