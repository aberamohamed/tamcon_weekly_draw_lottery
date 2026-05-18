'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface OtpInputProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export function OtpInput({
  value = '',
  onChange,
  length = 6,
  disabled = false,
}: OtpInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize inputRefs array length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Derive the digits array directly from the controlled `value` prop
  const digits = Array(length)
    .fill('')
    .map((_, i) => value[i] || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!val) return;

    // Grab only the last entered character to allow overriding existing values
    const lastChar = val.slice(-1);

    // Only allow digits
    if (!/^\d$/.test(lastChar)) return;

    // Build the new value string by updating the character at `index`
    const newValue = Array(length)
      .fill('')
      .map((_, i) => {
        if (i === index) return lastChar;
        return value[i] || '';
      })
      .join('');

    onChange?.(newValue);

    // Auto-focus next input field
    if (index < length - 1 && lastChar !== '') {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      
      const currentDigit = value[index] || '';

      if (currentDigit) {
        // If current box has value, clear it
        const newValue = Array(length)
          .fill('')
          .map((_, i) => {
            if (i === index) return '';
            return value[i] || '';
          })
          .join('');
        onChange?.(newValue);
      } else if (index > 0) {
        // If current box is empty, clear previous box and focus it
        const newValue = Array(length)
          .fill('')
          .map((_, i) => {
            if (i === index - 1) return '';
            return value[i] || '';
          })
          .join('');
        onChange?.(newValue);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedData = e.clipboardData.getData('text').trim();
    // Only process if it consists entirely of digits
    if (!/^\d+$/.test(pastedData)) return;

    const pastedDigits = pastedData.slice(0, length);
    onChange?.(pastedDigits);

    // Focus on the last filled input, or the very last input if complete
    const focusIndex = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex gap-2.5 sm:gap-3 justify-center items-center">
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = digit !== '';

          return (
            <motion.div
              key={index}
              whileHover={{ scale: disabled ? 1 : 1.04 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={disabled}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className={cn(
                  "w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono rounded-xl border transition-all duration-300 outline-none select-none caret-transparent text-transparent",
                  isFocused
                    ? "border-[#2D338B] bg-white ring-4 ring-[#2D338B]/10 shadow-[0_0_15px_rgba(45,51,139,0.15)] scale-[1.03]"
                    : isFilled
                    ? "border-[#2D338B]/40 bg-zinc-50 shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300",
                  disabled && "opacity-50 cursor-not-allowed bg-zinc-100 border-zinc-200"
                )}
                autoComplete="one-time-code"
              />
              
              {/* Dynamic Sliding/Scaling Bottom Indicator Bar */}
              {isFocused && !disabled && (
                <motion.div
                  layoutId="active-otp-bar"
                  className="absolute bottom-1.5 left-3 right-3 h-1 bg-[#2D338B] rounded-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}

              {/* Floating Pulse Dot for empty focused state */}
              {isFocused && !isFilled && !disabled && (
                <motion.span
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#2D338B] rounded-full pointer-events-none"
                />
              )}

              {/* Animate digit insertion */}
              <AnimatePresence>
                {isFilled && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center text-2xl font-bold font-mono text-zinc-900 pointer-events-none"
                  >
                    {digit}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
