import { useState, useCallback } from 'react';

/**
 * Manages the working image list for a product form.
 *
 * Existing images arrive as `{ public_id, url }` objects; newly dropped files are
 * read into base64 data-URL strings (what the backend's create/update expects).
 * `removeImage` uses an immutable filter — the old modals spliced the array in
 * place, which mutated React state.
 */
export function useImageList(initial = []) {
  const [imageList, setImageList] = useState(initial);

  const addFiles = useCallback((files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImageList((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = useCallback((index) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return { imageList, setImageList, addFiles, removeImage };
}

export default useImageList;
