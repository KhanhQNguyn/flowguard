"use client";

import { useState } from "react";
import { X, Check, Sparkles, Crown } from "lucide-react";
import { usePremium } from "@/lib/premium-context";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription";
import { Button } from "@/components/ui/button";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
}

export function PremiumModal({ open, onClose, feature }: PremiumModalProps) {
  const { updateSubscription, startTrial, subscription } = usePremium();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const premiumPlan = SUBSCRIPTION_PLANS.find((p) => p.id === "premium");
  if (!premiumPlan) return null;

  const canStartTrial =
    subscription.tier === "free" && !subscription.trialEndsAt;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateSubscription("premium", billingCycle);
    setIsProcessing(false);
    onClose();
  };

  const handleStartTrial = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    startTrial();
    setIsProcessing(false);
    onClose();
  };

  if (!open) return null;

  const price =
    billingCycle === "yearly" ? premiumPlan.priceYearly : premiumPlan.price;
  const savingsPercent = Math.round(
    (1 - premiumPlan.priceYearly / (premiumPlan.price * 12)) * 100,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 modal-overlay"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl modal-content">
        <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-300" />
            </div>
            <h2 className="text-2xl font-bold">Go Premium</h2>
          </div>

          {feature && (
            <p className="text-sm text-white/90">
              This feature requires a premium subscription
            </p>
          )}

          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-xs text-white/80 mb-1">Join our community</p>
            <p className="text-lg font-bold">1,247 Premium Members</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Trial Banner */}
          {canStartTrial && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Try Premium Free for 7 Days
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    Get full access to all premium features. Cancel anytime.
                  </p>
                  <Button
                    onClick={handleStartTrial}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? "Starting Trial..." : "Start Free Trial"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Toggle */}
          <div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Monthly
              </button>
              <div className="relative">
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    billingCycle === "yearly"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Yearly
                </button>
                <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">
                  Save {savingsPercent}%
                </span>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900">
                ${price}
                <span className="text-lg text-gray-500 font-normal">
                  /{billingCycle === "yearly" ? "year" : "month"}
                </span>
              </div>
              {billingCycle === "yearly" && (
                <p className="text-sm text-green-600 mt-1">
                  Just ${(premiumPlan.priceYearly / 12).toFixed(2)}/month billed
                  annually
                </p>
              )}
            </div>
          </div>

          {/* Features List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Premium Features
            </h3>
            <div className="space-y-2.5">
              {premiumPlan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-6 pt-4 border-t bg-white">
          <div className="space-y-3">
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-base font-semibold"
            >
              {isProcessing
                ? "Processing..."
                : `Upgrade to Premium - $${price}`}
            </Button>

            <button
              onClick={onClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Maybe Later
            </button>
          </div>

          {/* Fine Print */}
          <p className="text-xs text-gray-500 text-center mt-3">
            Cancel anytime. No questions asked. Secure payment processed.
          </p>
        </div>
      </div>
    </div>
  );
}
