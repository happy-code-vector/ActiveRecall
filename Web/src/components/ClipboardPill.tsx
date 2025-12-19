/**
 * ClipboardPill Component
 * Displays detected clipboard text for quick input
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clipboard, X } from 'lucide-react';
import { ANIMATION_DURATION, EASING } from '../utils/animationTiming';

interface ClipboardPillProps {
  text: string | null;
  truncatedText: string | null;
  hasText: boolean;
  onPaste: (text: string) => void;
  onDismiss: () => void;
}

export function ClipboardPill({
  text,
  truncatedText,
  hasText,
  onPaste,
  onDismiss,
}: ClipboardPillProps) {
  if (!hasText || !text || !truncatedText) {
    return null;
  }

  const handlePaste = () => {
    onPaste(text);
    onDismiss();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{
          duration: ANIMATION_DURATION.STANDARD / 1000,
          ease: EASING.EASE_OUT.replace('cubic-bezier(', '').replace(')', '').split(', ').map(Number),
        }}
        className="mb-3"
      >
        <button
          onClick={handlePaste}
          className="group relative flex items-center gap-2 px-3 py-2 rounded-full 
                     bg-zinc-800/80 border border-zinc-700/50 
                     hover:bg-zinc-700/80 hover:border-zinc-600/50
                     transition-colors duration-150
                     text-sm text-zinc-300 hover:text-white
                     backdrop-blur-sm shadow-lg"
          aria-label={`Paste from clipboard: ${truncatedText}`}
        >
          <Clipboard className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
          
          <span className="max-w-[200px] truncate">
            {truncatedText}
          </span>
          
          <span className="text-xs text-zinc-500 group-hover:text-zinc-400">
            Tap to paste
          </span>
          
          <button
            onClick={handleDismiss}
            className="ml-1 p-1 rounded-full hover:bg-zinc-600/50 transition-colors"
            aria-label="Dismiss clipboard suggestion"
          >
            <X className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
          </button>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

export default ClipboardPill;
