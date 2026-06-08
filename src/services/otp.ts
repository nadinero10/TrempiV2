const INFORU_TOKEN = import.meta.env.VITE_INFORU_TOKEN as string
const INFORU_USERNAME = import.meta.env.VITE_INFORU_USERNAME as string
const DEV_MODE = import.meta.env.DEV

const SMS_API_URL = "/api/sms/SendSms"

interface SmsResponse {
  StatusId: number
  StatusDescription?: string
  Message?: string
  [key: string]: unknown
}

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, "")
  if (cleaned.startsWith("0")) {
    cleaned = "+972" + cleaned.slice(1)
  }
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned
  }
  return cleaned
}

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const OTP_STORAGE_KEY = "trempi_otp_pending"

interface StoredOtp {
  phone: string
  code: string
  expiresAt: number
}

function storeOtp(phone: string, code: string) {
  const data: StoredOtp = {
    phone: normalizePhone(phone),
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  }
  sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(data))
}

function getStoredOtp(): StoredOtp | null {
  const raw = sessionStorage.getItem(OTP_STORAGE_KEY)
  if (!raw) return null
  const data: StoredOtp = JSON.parse(raw)
  if (Date.now() > data.expiresAt) {
    sessionStorage.removeItem(OTP_STORAGE_KEY)
    return null
  }
  return data
}

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const normalizedPhone = normalizePhone(phone)
  const code = generateCode()

  if (DEV_MODE) {
    console.log(`[DEV] OTP for ${normalizedPhone}: ${code} (or use 1234)`)
    storeOtp(phone, code)
    return { success: true }
  }

  const smsPayload = JSON.stringify({
    UserName: INFORU_USERNAME,
    Token: INFORU_TOKEN,
    Message: `Your Trempi verification code is: ${code}`,
    Recipients: [{ Phone: normalizedPhone }],
    Settings: { SenderName: "Trempi" },
  })

  try {
    const response = await fetch(`${SMS_API_URL}?json=${encodeURIComponent(smsPayload)}`)
    const data: SmsResponse = await response.json()

    if (data.StatusId === 1 || data.StatusId === 0) {
      storeOtp(phone, code)
      return { success: true }
    }

    return { success: false, error: data.StatusDescription || data.Message || "Failed to send SMS" }
  } catch {
    return { success: false, error: "Failed to connect to SMS service" }
  }
}

export async function verifyOtp(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
  if (DEV_MODE && code === "1234") {
    return { success: true }
  }

  const stored = getStoredOtp()

  if (!stored) {
    return { success: false, error: "Code expired. Please request a new one." }
  }

  if (stored.phone !== normalizePhone(phone)) {
    return { success: false, error: "Phone number mismatch." }
  }

  if (stored.code === code) {
    sessionStorage.removeItem(OTP_STORAGE_KEY)
    return { success: true }
  }

  return { success: false, error: "Invalid code. Please try again." }
}

export { normalizePhone }
