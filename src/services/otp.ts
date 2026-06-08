const INFORU_TOKEN = import.meta.env.VITE_INFORU_TOKEN as string
const INFORU_USERNAME = import.meta.env.VITE_INFORU_USERNAME as string

const SEND_OTP_URL = "/api/otp/SendOtp"
const VERIFY_OTP_URL = "/api/otp/Authenticate"

interface OtpResponse {
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

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
  const normalizedPhone = normalizePhone(phone)

  const payload = JSON.stringify({
    UserName: INFORU_USERNAME,
    Token: INFORU_TOKEN,
    PhoneNumber: normalizedPhone,
    CodeLength: 4,
    SenderName: "Trempi",
  })

  try {
    const response = await fetch(`${SEND_OTP_URL}?json=${encodeURIComponent(payload)}`)

    const data: OtpResponse = await response.json()

    if (data.StatusId === 1 || data.StatusId === 0) {
      return { success: true }
    }

    const errMsg = data.StatusDescription || data.Message || "Failed to send OTP"

    if (data.StatusId === -403) {
      return { success: false, error: "OTP service not yet enabled. Contact InforU support." }
    }

    return { success: false, error: errMsg }
  } catch {
    return { success: false, error: "Failed to connect to OTP service" }
  }
}

export async function verifyOtp(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
  const normalizedPhone = normalizePhone(phone)

  const payload = JSON.stringify({
    UserName: INFORU_USERNAME,
    Token: INFORU_TOKEN,
    PhoneNumber: normalizedPhone,
    Code: code,
  })

  try {
    const response = await fetch(`${VERIFY_OTP_URL}?json=${encodeURIComponent(payload)}`)

    const data: OtpResponse = await response.json()

    if (data.StatusId === 1 || data.StatusId === 0) {
      return { success: true }
    }

    return { success: false, error: data.StatusDescription || data.Message || "Invalid OTP code" }
  } catch {
    return { success: false, error: "Failed to verify OTP" }
  }
}

export { normalizePhone }
