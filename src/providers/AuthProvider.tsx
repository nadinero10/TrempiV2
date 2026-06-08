import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { ReactNode } from "react"
import type { User, Session } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"
import { supabase } from "@/lib/supabase"
import { sendOtp, verifyOtp, normalizePhone } from "@/services/otp"

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  sendOtpToPhone: (phone: string) => Promise<void>
  verifyOtpAndSignIn: (phone: string, code: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const PHONE_PASSWORD_SALT = "trempi_otp_verified_2026"

function phoneToEmail(phone: string): string {
  const normalized = normalizePhone(phone).replace(/\+/g, "")
  return `p${normalized}@trempi.app`
}

function phoneToPassword(phone: string): string {
  const normalized = normalizePhone(phone)
  return `${PHONE_PASSWORD_SALT}_${normalized}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    setProfile(data)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const sendOtpToPhone = useCallback(async (phone: string) => {
    const result = await sendOtp(phone)
    if (!result.success) {
      throw new Error(result.error || "Failed to send OTP")
    }
  }, [])

  const verifyOtpAndSignIn = useCallback(async (phone: string, code: string, fullName?: string) => {
    const result = await verifyOtp(phone, code)
    if (!result.success) {
      throw new Error(result.error || "Invalid OTP code")
    }

    const email = phoneToEmail(phone)
    const password = phoneToPassword(phone)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
            phone: normalizePhone(phone),
          },
        },
      })

      if (signUpError) throw signUpError

      const { error: signInRetry } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInRetry) throw signInRetry
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser) {
      await supabase.from("profiles").upsert({
        id: currentUser.id,
        phone: normalizePhone(phone),
        full_name: fullName || profile?.full_name || "",
      }, { onConflict: "id" })
    }
  }, [profile])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  return (
    <AuthContext value={{
      user,
      session,
      profile,
      loading,
      sendOtpToPhone,
      verifyOtpAndSignIn,
      signOut,
    }}>
      {children}
    </AuthContext>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
