"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, X, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function EmailVerificationBanner() {
  const { user, profile, resendVerification } = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const [sending, setSending] = useState(false)

  if (!user || !profile || profile.emailVerified || dismissed) {
    return null
  }

  const handleResendVerification = async () => {
    setSending(true)
    try {
      await resendVerification()
      alert("Verification email sent! Please check your inbox.")
    } catch (error: any) {
      alert(error.message || "Failed to send verification email")
    } finally {
      setSending(false)
    }
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <Mail className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Please verify your email address to access all features. Check your inbox for a verification link.</span>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleResendVerification} disabled={sending}>
            {sending ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <Mail className="h-3 w-3 mr-1" />}
            Resend
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
