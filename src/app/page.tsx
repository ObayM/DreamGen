'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSparkles, IoHeart, IoShareSocial, IoBookmark } from "react-icons/io5";

export default function ModernGallery() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [imageUrls, setImageUrls] = useState<
    {
      id: string;
      url: string;
    }[]
  >([]);
// linkedin
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoadingFeed(true);
    try {
      const response = await fetch("/api/get-images");
      const data = await response.json();
      setImageUrls(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoadingFeed(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to generate image");

      if (data.imageUrl) {
        const image = new Image();
        image.onload = () => {
          setGeneratedImage(data.imageUrl);
        };
        image.src = data.imageUrl;
      }

      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Input */}
      <header className="fixed top-0 w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                <IoSparkles className="text-violet-600" />
                Imagine
              </h1>
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex gap-3">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-gray-800 dark:text-gray-200 transition-all"
                  placeholder="Describe your imagination..."
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <IoSparkles className="text-lg" />
                      <span>Generate</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-8 max-w-7xl mx-auto px-4">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Generated Image (if exists) */}
          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={generatedImage}
                  alt="Latest generated"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium">Latest Creation</span>
                  <div className="flex gap-3 text-white">
                    <motion.button whileHover={{ scale: 1.1 }} className="hover:text-pink-400">
                      <IoHeart />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} className="hover:text-blue-400">
                      <IoShareSocial />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} className="hover:text-purple-400">
                      <IoBookmark />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Gallery Images */}
          {isLoadingFeed ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
              </div>
            ))
          ) : (
            imageUrls.map((image, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={index}
                className="relative group"
              >
                <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={image.url}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end gap-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button whileHover={{ scale: 1.1 }} className="hover:text-pink-400">
                      <IoHeart />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} className="hover:text-blue-400">
                      <IoShareSocial />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} className="hover:text-purple-400">
                      <IoBookmark />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-3 border-violet-500/30 rounded-full animate-pulse" />
                  <div className="absolute inset-0 border-3 border-transparent border-t-violet-600 rounded-full animate-spin" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                  Creating Your Image...
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}