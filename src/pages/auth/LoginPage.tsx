import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, ArrowRight, ShieldCheck, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/providers/I18nProvider"
import { useAuth } from "@/providers/AuthProvider"

type Step = "phone" | "otp"

export default function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { sendOtpToPhone, verifyOtpAndSignIn } = useAuth()

  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return

    setError("")
    setLoading(true)
    try {
      await sendOtpToPhone(phone)
      setStep("otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) return

    setError("")
    setLoading(true)
    try {
      await verifyOtpAndSignIn(phone, otp, fullName || undefined)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-b from-muted/30 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <Link to="/">
            <img src="/trempi-logo.png" alt="Trempi" className="mx-auto h-10 w-auto" />
          </Link>
        </div>

        <Card className="shadow-lg border-0 shadow-primary/5">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">
              {step === "phone" ? t("auth.otp.title") : t("auth.otp.verifyTitle")}
            </CardTitle>
            <CardDescription>
              {step === "phone" ? t("auth.otp.subtitle") : t("auth.otp.verifySubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {step === "phone" ? (
                <motion.form
                  key="phone-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("auth.otp.phone")}</Label>
                    <div className="relative">
                      <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="05X-XXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="ps-10 h-12 rounded-xl"
                        dir="ltr"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t("auth.otp.fullName")}</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t("auth.otp.fullNamePlaceholder")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground">{t("auth.otp.fullNameHint")}</p>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white"
                    disabled={loading || !phone.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t("auth.otp.sendCode")}
                        <ArrowRight className="ms-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                      <ShieldCheck className="h-6 w-6 text-secondary" />
                    </div>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {phone}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">{t("auth.otp.code")}</Label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="• • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="h-14 rounded-xl text-center text-2xl tracking-[0.5em] font-mono"
                      dir="ltr"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white"
                    disabled={loading || otp.length < 4}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="me-2 h-4 w-4" />
                        {t("auth.otp.verify")}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setStep("phone"); setOtp(""); setError("") }}
                    >
                      {t("auth.otp.changePhone")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSendOtp}
                      disabled={loading}
                    >
                      {t("auth.otp.resend")}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("auth.otp.terms")}
        </p>
      </motion.div>
    </div>
  )
}
