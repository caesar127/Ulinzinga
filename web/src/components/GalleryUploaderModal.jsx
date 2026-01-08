import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadContentMutation } from "../features/content/contentApiSlice";
import { handleErrorToast2, handleSuccessToast2 } from "../utils/toasts";

const GalleryUploaderModal = ({ open, onClose, event }) => {
  const [uploadGalleryItem, { isLoading }] = useUploadContentMutation();

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const closeModal = () => {
    setFiles([]);
    setCaption("");
    setPreviews([]);
    onClose();
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return handleErrorToast2("Select at least one photo or video.");

    try {
      await uploadGalleryItem({
        eventId: event.eventSlug,
        files,
        visibilityScope: "event",
        privacy: "public",
        caption: caption.trim() || undefined,
      }).unwrap();

      handleSuccessToast2("Upload submitted for approval.");
      closeModal();
    } catch (err) {
      handleErrorToast2(err?.data?.message || "Upload failed. Try again.");
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/50" />

          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Upload to {event?.title}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {!files || files.length === 0 ? (
              <label className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600">
                  Click to upload photos or videos
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, MP4 (multiple allowed)</p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
              </label>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-3 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type.startsWith("image") ? (
                        <img
                          src={previews[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl"
                        />
                      ) : (
                        <video
                          src={previews[index]}
                          controls
                          className="w-full h-24 rounded-xl"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-full border border-gray-300 rounded-xl p-2 text-sm mb-3"
                  rows={3}
                  maxLength={500}
                />

                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="text-sm text-gray-500 hover:text-gray-700 mb-2"
                >
                  + Add more files
                </button>
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-300 rounded-xl py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!files || files.length === 0 || isLoading}
                className="flex-1 bg-black text-white rounded-xl py-2 text-sm disabled:opacity-50"
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GalleryUploaderModal;
