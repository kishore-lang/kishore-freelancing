import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

// Test phone number and fixed OTP for development testing
export const DEV_TEST_PHONE = import.meta.env.VITE_DEV_TEST_PHONE || "+919999999999";
export const DEV_TEST_OTP = import.meta.env.VITE_DEV_TEST_OTP || "123456";

export const isDevTestPhone = (phone: string) => {
  const clean = phone.replace(/[\s-]/g, "");
  const devClean = DEV_TEST_PHONE.replace(/[\s-]/g, "");
  return clean === devClean || clean === devClean.replace("+91", "") || clean === "9999999999";
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfile {
  id: string;
  phone: string;
  full_name: string;
  email?: string | null;
  course?: string | null;
  is_blocked?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Sends OTP using Supabase Auth signInWithOtp.
 * Falls back seamlessly to dev test mode for DEV_TEST_PHONE.
 */
export async function sendPhoneOtp(phoneE164: string): Promise<{ success: boolean; message: string; isDevTest?: boolean }> {
  // If test phone number in development, bypass SMS gateway
  if (isDevTestPhone(phoneE164)) {
    console.log(`[Supabase Dev Test] Using test phone ${phoneE164} with fixed OTP ${DEV_TEST_OTP}`);
    return {
      success: true,
      message: `Test OTP ${DEV_TEST_OTP} generated for development.`,
      isDevTest: true,
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneE164,
    });

    if (error) {
      // Map Supabase error codes to friendly messages
      if (error.message.toLowerCase().includes("rate limit") || error.status === 429) {
        throw new Error("Too many attempts. Please wait 60 seconds before requesting another code.");
      }
      if (error.message.toLowerCase().includes("invalid phone")) {
        throw new Error("Please enter a valid 10-digit mobile number with country code.");
      }
      if (error.message.toLowerCase().includes("sms provider") || error.message.toLowerCase().includes("gateway")) {
        throw new Error("SMS provider not configured on Supabase. Use dev test phone +91 9999999999 (OTP: 123456) or configure Twilio/MessageBird in Supabase dashboard.");
      }
      throw error;
    }

    return {
      success: true,
      message: "Verification code sent successfully to your mobile number.",
    };
  } catch (err: any) {
    console.error("sendPhoneOtp error:", err);
    throw err;
  }
}

/**
 * Verifies OTP using Supabase Auth verifyOtp.
 * Supports dev test phone with fixed OTP 123456.
 */
export async function verifyPhoneOtp(
  phoneE164: string,
  token: string
): Promise<{ success: boolean; user: any; isDevTest?: boolean }> {
  // Dev test phone verification
  if (isDevTestPhone(phoneE164)) {
    if (token.trim() !== DEV_TEST_OTP) {
      throw new Error("Incorrect verification code. For test number, use OTP: " + DEV_TEST_OTP);
    }
    const mockUser = {
      id: "dev-test-user-id-9999999999",
      phone: DEV_TEST_PHONE,
      app_metadata: { provider: "phone" },
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };
    return {
      success: true,
      user: mockUser,
      isDevTest: true,
    };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneE164,
      token: token.trim(),
      type: "sms",
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("expired")) {
        throw new Error("Verification code has expired. Please request a new OTP.");
      }
      if (msg.includes("invalid") || msg.includes("token")) {
        throw new Error("Incorrect verification code. Please check and try again.");
      }
      if (msg.includes("attempts") || msg.includes("rate") || error.status === 429) {
        throw new Error("Too many failed attempts. Please wait before trying again.");
      }
      throw error;
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (err: any) {
    console.error("verifyPhoneOtp error:", err);
    throw err;
  }
}
