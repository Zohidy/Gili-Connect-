/**
 * Converts a file to a Base64 string for storage in Firestore.
 * Note: Firestore has a 1MB limit per document.
 * @param file The file to convert
 * @returns Promise<string> The Base64 data URL
 */
export const uploadFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
