'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, CreditCard, Package } from 'lucide-react';

interface ProgressTrackerProps {
  currentStep: 'cart' | 'checkout' | 'complete';
  className?: string;
}

export default function ProgressTracker({
  currentStep,
  className = '',
}: ProgressTrackerProps) {
  const steps = [
    { key: 'cart', label: 'Cart', icon: ShoppingBag },
    { key: 'checkout', label: 'Checkout', icon: CreditCard },
    { key: 'complete', label: 'Complete', icon: Package },
  ];

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex((step) => step.key === stepKey);
    const currentIndex = steps.findIndex((step) => step.key === currentStep);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(step.key);
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center gap-1 sm:gap-2">
            {/* Step Circle */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-green-600 text-white'
                  : status === 'current'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Icon className="w-3 h-3" />
              )}
            </motion.div>

            {/* Step Label */}
            <span
              className={`text-xs sm:text-sm transition-colors duration-300 ${
                status === 'completed'
                  ? 'text-green-600 font-medium'
                  : status === 'current'
                    ? 'text-amber-600 font-medium'
                    : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                className={`w-6 sm:w-8 h-0.5 transition-colors duration-300 ${
                  status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
