import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Camera, ArrowRight } from 'lucide-react';

interface ProfileSetupScreenProps {
  onComplete: (profileData: { displayName: string; avatarUrl?: string }) => void;
  userType: 'student' | 'parent';
}

export function ProfileSetupScreen({ onComplete, userType }: ProfileSetupScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleContinue = () => {
    if (displayName.trim()) {
      onComplete({
        displayName: displayName.trim(),
        avatarUrl: avatarUrl || undefined
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);
      
      // Store file for later upload after signup
      // We'll convert to base64 for temporary storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        localStorage.setItem('thinkfirst_pendingAvatar', base64);
        localStorage.setItem('thinkfirst_pendingAvatarType', file.type);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error processing avatar:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    setAvatarUrl('');
    localStorage.removeItem('thinkfirst_pendingAvatar');
    localStorage.removeItem('thinkfirst_pendingAvatarType');
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const promptText = userType === 'parent' 
    ? "Let's set up your profile"
    : "Tell us about yourself";

  const nameLabel = userType === 'parent'
    ? "Your name"
    : "What should we call you?";

  const namePlaceholder = userType === 'parent'
    ? "Enter your full name"
    : "Enter your name or nickname";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-normal filter blur-[150px] opacity-20" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-normal filter blur-[150px] opacity-20" />

      {/* Header */}
      <motion.div
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className="text-white text-3xl mb-3 leading-tight" style={{ fontWeight: 700 }}>
          {promptText}
        </h1>
        <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>
          This helps personalize your experience
        </p>
      </motion.div>

      {/* Profile Setup Form */}
      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Avatar Section */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative mb-4">
            {/* Avatar Circle */}
            <div 
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 relative"
              style={{
                background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              }}
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {displayName ? (
                    <span className="text-white text-xl font-bold">
                      {getInitials(displayName)}
                    </span>
                  ) : (
                    <User className="w-10 h-10 text-white/70" strokeWidth={2} />
                  )}
                </div>
              )}
              
              {/* Loading overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Camera Button */}
            <button
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 border-2 border-black flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4 text-white" strokeWidth={2} />
            </button>

            {/* Hidden file input */}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* Avatar Actions */}
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={isUploading}
              className="text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
            >
              {avatarUrl ? 'Change photo' : 'Add photo'}
            </button>
            {avatarUrl && (
              <>
                <span className="text-gray-600">•</span>
                <button
                  onClick={removeAvatar}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="block text-gray-400 text-sm mb-3" style={{ fontWeight: 500 }}>
            {nameLabel}
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={namePlaceholder}
            className="w-full px-4 py-4 rounded-2xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            style={{
              background: 'rgba(30, 30, 30, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '16px',
              fontWeight: 500,
            }}
            maxLength={50}
          />
          <p className="text-gray-600 text-xs mt-2">
            This is how you'll appear in the app
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          onClick={handleContinue}
          disabled={!displayName.trim() || isUploading}
          className="relative w-full rounded-full px-8 py-4 transition-all duration-300 overflow-hidden group disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: displayName.trim() && !isUploading
              ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
              : 'rgba(139, 92, 246, 0.3)',
            boxShadow: displayName.trim() && !isUploading
              ? '0 8px 32px rgba(139, 92, 246, 0.4)'
              : 'none',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={displayName.trim() && !isUploading ? { scale: 1.02 } : {}}
          whileTap={displayName.trim() && !isUploading ? { scale: 0.98 } : {}}
        >
          {/* Animated gradient background */}
          {displayName.trim() && !isUploading && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.3))',
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-white text-base" style={{ fontWeight: 600 }}>
              {isUploading ? 'Processing...' : 'Continue'}
            </span>
            {!isUploading && <ArrowRight size={20} className="text-white" />}
          </div>
        </motion.button>

        {/* Helper text */}
        <motion.p
          className="text-gray-600 text-center text-xs mt-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          You can change this later in your profile settings
        </motion.p>
      </div>
    </div>
  );
}