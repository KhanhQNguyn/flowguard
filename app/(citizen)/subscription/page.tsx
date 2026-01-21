'use client'

import { useState } from 'react'
import { ArrowLeft, Crown, Calendar, CreditCard, CheckCircle2, XCircle, Download, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePremium } from '@/lib/premium-context'
import { SUBSCRIPTION_PLANS, type BillingHistory } from '@/lib/subscription'
import { Button } from '@/components/ui/button'
import { PremiumModal } from '@/components/premium-modal'

const mockBillingHistory: BillingHistory[] = [
  {
    id: '1',
    date: '2026-01-01',
    amount: 29.99,
    currency: 'USD',
    plan: 'Premium (Yearly)',
    status: 'paid',
    invoiceUrl: '#'
  },
  {
    id: '2',
    date: '2025-12-01',
    amount: 2.99,
    currency: 'USD',
    plan: 'Premium (Monthly)',
    status: 'paid',
    invoiceUrl: '#'
  }
]

export default function SubscriptionPage() {
  const router = useRouter()
  const { subscription, isPremium, isTrialActive, cancelSubscription } = usePremium()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [autoRenew, setAutoRenew] = useState(subscription.autoRenew)

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === subscription.tier) || SUBSCRIPTION_PLANS[0]

  const handleCancelSubscription = () => {
    cancelSubscription()
    setShowCancelDialog(false)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Subscription</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Plan Card */}
        <div className={`rounded-2xl p-6 ${
          isPremium || isTrialActive
            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
            : 'bg-white border-2 border-gray-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {(isPremium || isTrialActive) && <Crown className="w-5 h-5 text-yellow-300" />}
                <h2 className="text-2xl font-bold">
                  {subscription.tier === 'trial' ? 'Premium Trial' : currentPlan.name}
                </h2>
              </div>
              {isTrialActive && (
                <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    {subscription.trialDaysRemaining} days remaining
                  </span>
                </div>
              )}
            </div>
            {(isPremium || isTrialActive) && (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
          </div>

          {subscription.tier === 'free' ? (
            <div className="space-y-3">
              <p className="text-gray-600">You're currently on the free plan</p>
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Upgrade to Premium
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className={isPremium || isTrialActive ? 'text-white/80' : 'text-gray-600'}>
                  {subscription.tier === 'trial' ? 'Trial ends' : 'Renews on'}
                </span>
                <span className="font-semibold">
                  {formatDate(subscription.trialEndsAt || subscription.expiryDate)}
                </span>
              </div>
              {isPremium && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Billing cycle</span>
                  <span className="font-semibold capitalize">{subscription.billingCycle}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trial Warning */}
        {isTrialActive && subscription.trialDaysRemaining <= 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">
                Your trial ends in {subscription.trialDaysRemaining} days
              </p>
              <p className="text-xs text-yellow-700 mb-2">
                Upgrade now to continue enjoying premium features
              </p>
              <Button
                onClick={() => setShowUpgradeModal(true)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-white rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Your Features</h3>
          <div className="space-y-3">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        {isPremium && (
          <div className="bg-white rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/2027</p>
                </div>
              </div>
              <button className="text-sm text-purple-600 font-medium hover:text-purple-700">
                Update
              </button>
            </div>
          </div>
        )}

        {/* Auto-Renewal */}
        {isPremium && (
          <div className="bg-white rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Auto-Renewal</h3>
                <p className="text-sm text-gray-500">Automatically renew your subscription</p>
              </div>
              <button
                onClick={() => setAutoRenew(!autoRenew)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  autoRenew ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRenew ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Billing History */}
        {(isPremium || subscription.tier === 'free') && mockBillingHistory.length > 0 && (
          <div className="bg-white rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
            <div className="space-y-3">
              {mockBillingHistory.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      bill.status === 'paid' ? 'bg-green-100' : bill.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {bill.status === 'paid' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : bill.status === 'pending' ? (
                        <Calendar className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{bill.plan}</p>
                      <p className="text-xs text-gray-500">{formatDate(bill.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">${bill.amount}</span>
                    {bill.invoiceUrl && (
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cancel Subscription */}
        {(isPremium || isTrialActive) && (
          <div className="bg-white rounded-xl p-5">
            <button
              onClick={() => setShowCancelDialog(true)}
              className="text-red-600 text-sm font-medium hover:text-red-700"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <PremiumModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCancelDialog(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-gray-600 mb-6">
              You'll lose access to premium features immediately. We'd love to keep you!
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Keep Premium
              </Button>
              <Button
                onClick={handleCancelSubscription}
                variant="destructive"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
