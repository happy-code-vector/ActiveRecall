import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Check } from 'lucide-react';

interface ParentalConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantPermission: () => void;
  studentName?: string;
}

export function ParentalConsentModal({
  isOpen,
  onClose,
  onGrantPermission,
  studentName = 'your student',
}: ParentalConsentModalProps) {
  const [dataProcessingConsent, setDataProcessingConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);

  const canGrantPermission = dataProcessingConsent && termsConsent;

  const handleGrantPermission = () => {
    if (canGrantPermission) {
      onGrantPermission();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-w-[480px] mx-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div
              className="rounded-t-3xl overflow-hidden"
              style={{
                background: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderBottom: 'none',
              }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div
                  className="w-12 h-1 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                />
              </div>

              {/* Header */}
              <div className="px-6 pt-4 pb-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
                        Parental Consent Required
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors active:opacity-60"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  To analyze learning patterns for {studentName} under 18, we need your permission to process data.
                </p>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-4">
                {/* Checkbox 1 */}
                <label
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => setDataProcessingConsent(!dataProcessingConsent)}
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div
                      className="w-6 h-6 rounded-lg transition-all"
                      style={{
                        background: dataProcessingConsent
                          ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: dataProcessingConsent
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: dataProcessingConsent
                          ? '0 4px 12px rgba(139, 92, 246, 0.4)'
                          : 'none',
                      }}
                    >
                      {dataProcessingConsent && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center justify-center h-full"
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm" style={{ fontWeight: 500 }}>
                      I consent to data processing
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Allow ThinkFirst to analyze learning patterns, progress, and provide personalized insights
                    </p>
                  </div>
                </label>

                {/* Checkbox 2 */}
                <label
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => setTermsConsent(!termsConsent)}
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div
                      className="w-6 h-6 rounded-lg transition-all"
                      style={{
                        background: termsConsent
                          ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: termsConsent
                          ? '2px solid transparent'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: termsConsent
                          ? '0 4px 12px rgba(139, 92, 246, 0.4)'
                          : 'none',
                      }}
                    >
                      {termsConsent && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center justify-center h-full"
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm" style={{ fontWeight: 500 }}>
                      I agree to Terms of Service
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      By continuing, you accept our{' '}
                      <a href="#" className="text-purple-400 hover:underline">
                        Terms
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-purple-400 hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </label>
              </div>

              {/* Footer */}
              <div className="px-6 pb-8 pt-2">
                <button
                  onClick={handleGrantPermission}
                  disabled={!canGrantPermission}
                  className="w-full py-4 rounded-2xl transition-all active:scale-98 disabled:active:scale-100"
                  style={{
                    background: canGrantPermission ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
                    color: canGrantPermission ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                    fontWeight: 700,
                    cursor: canGrantPermission ? 'pointer' : 'not-allowed',
                    boxShadow: canGrantPermission
                      ? '0 4px 24px rgba(255, 255, 255, 0.2)'
                      : 'none',
                  }}
                >
                  Grant Permission
                </button>

                {/* Additional info */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Your data is encrypted and never shared with third parties
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
