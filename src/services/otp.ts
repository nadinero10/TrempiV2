const INFORU_TOKEN = import.meta.env.VITE_INFORU_TOKEN as string
const INFORU_USERNAME = import.meta.env.VITE_INFORU_USERNAME as string

const SEND_OTP_URL = "/api/otp/SendOtp"
const VERIFY_OTP_URL = "/api/otp/Authenticate"

interface SendOtpPayload {
  UserName: string
  Token: string
  PhoneNumber: string
  CodeLength?: number
  Language?: string
  SenderName?: string
}

interface VerifyOtpPayload {
  UserName: string
  Token: string
  PhoneNumber: string
  Code: string
}

interface OtpResponse {
  StatusId: number
  Message: string
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

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const normalizedPhone = normalizePhone(phone)

  const payload: SendOtpPayload = {
    UserName: INFORU_USERNAME,
    Token: INFORU_TOKEN,
    PhoneNumber: normalizedPhone,
    CodeLength: 4,
    SenderName: "Trempi",
  }

  try {
    const response = await fetch(`${SEND_OTP_URL}?json=${encodeURIComponent(JSON.stringify(payload))}`, {
      method: "GET",
    })

    if (!response.ok) {
      return { success: false, error: "Network error" }
    }

    const data: OtpResponse = await response.json()

    if (data.StatusId === 1 || data.StatusId === 0) {
      return { success: true }
    }

    return { success: false, error: data.Message || "Failed to send OTP" }
  } catch {
    return { success: false, error: "Failed to connect to OTP service" }
  }
}

export async function verifyOtp(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
  const normalizedPhone = normalizePhone(phone)

  const payload: VerifyOtpPayload = {
    UserName: INFORU_USERNAME,
    Token: INFORU_TOKEN,
    PhoneNumber: normalizedPhone,
    Code: code,
  }

  try {
    const response = await fetch(`${VERIFY_OTP_URL}?json=${encodeURIComponent(JSON.stringify(payload))}`, {
      method: "GET",
    })

    if (!response.ok) {
      return { success: false, error: "Network error" }
    }

    const data: OtpResponse = await response.json()

    if (data.StatusId === 1 || data.StatusId === 0) {
      return { success: true }
    }

    return { success: false, error: data.Message || "Invalid OTP code" }
  } catch {
    return { success: false, error: "Failed to verify OTP" }
  }
}

export { normalizePhone }
