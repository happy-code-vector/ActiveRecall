import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Upload } from 'lucide-react';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onUpdate: (avatarUrl: string) => void;
  children: React.ReactNode;
}

export function AvatarUploader({ currentAvatar, onUpdate, children }: AvatarUploaderProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Store in localStorage (in production, upload to Supabase Storage)
      localStorage.setItem('thinkfirst_avatar', imageUrl);
      onUpdate(imageUrl);
      setShowUploadModal(false);
    }
  };

  return (
    <>
      <div className="relative group">
        {children}
        
        {/* Edit Button Overlay */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            border: '3px solid #000000',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
          }}
        >
          <Camera className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 p-6 rounded-t-[32px] backdrop-blur-xl"
              style={{
                background: 'rgba(20, 20, 20, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: '480px',
                margin: '0 auto',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>
                  Update Avatar
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Upload Options */}
              <div className="space-y-3">
                {/* Upload from Device */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div
                    className="w-full rounded-[20px] p-5 backdrop-blur-xl cursor-pointer hover:bg-white hover:bg-opacity-5 active:bg-opacity-10 transition-all"
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                        }}
                      >
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white mb-1" style={{ fontWeight: 600 }}>
                          Upload Photo
                        </div>
                        <div className="text-gray-400 text-sm">
                          Choose from your device
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Remove Photo (if avatar exists) */}
                {currentAvatar && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('thinkfirst_avatar');
                      onUpdate('');
                      setShowUploadModal(false);
                    }}
                    className="w-full rounded-[20px] p-5 backdrop-blur-xl hover:bg-white hover:bg-opacity-5 active:bg-opacity-10 transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                        }}
                      >
                        <X className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="text-left">
                        <div className="text-white mb-1" style={{ fontWeight: 600 }}>
                          Remove Photo
                        </div>
                        <div className="text-gray-400 text-sm">
                          Use default avatar
                        </div>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Bottom padding for safe area */}
              <div className="h-4" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
