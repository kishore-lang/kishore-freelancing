import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth } from "./firebase";
import { DEV_TEST_PHONE, DEV_TEST_OTP, isDevTestPhone } from "./supabase";

let globalRecaptchaVerifier: RecaptchaVerifier | null = null;
let activeConfirmationResult: ConfirmationResult | null = null;

/**
 * Resets the reCAPTCHA verifier and cleans up any existing DOM elements.
 */
export function resetRecaptchaVerifier(containerId = "recaptcha-container") {
  if (globalRecaptchaVerifier) {
    try {
      globalRecaptchaVerifier.clear();
    } catch (e) {
      console.warn("[Firebase] Error clearing RecaptchaVerifier:", e);
    }
    globalRecaptchaVerifier = null;
  }

  // Remove existing container element from DOM to avoid "already rendered" errors
  const el = document.getElementById(containerId);
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

/**
 * Gets the existing RecaptchaVerifier or creates a fresh one with a clean DOM container.
 */
export function getOrCreateRecaptchaVerifier(containerId = "recaptcha-container"): RecaptchaVerifier {
  // If a valid verifier already exists, reuse it
  if (globalRecaptchaVerifier) {
    return globalRecaptchaVerifier;
  }

  // Ensure any previous stale container is removed
  resetRecaptchaVerifier(containerId);

  // Create a brand new DOM container on document.body
  const container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);

  globalRecaptchaVerifier = new RecaptchaVerifier(auth, container, {
    size: "invisible",
    callback: () => {
      console.log("[Firebase] Invisible reCAPTCHA validated successfully.");
    },
    "expired-callback": () => {
      console.warn("[Firebase] reCAPTCHA expired. Resetting...");
      resetRecaptchaVerifier(containerId);
    }
  });

  return globalRecaptchaVerifier;
}

/**
 * Sends a real-time SMS OTP using Firebase Phone Auth.
 * Falls back to dev test bypass for DEV_TEST_PHONE (+91 9999999999).
 */
export async function sendFirebasePhoneOtp(
  phoneE164: string
): Promise<{ success: boolean; message: string; isDevTest?: boolean }> {
  // Check if test phone number in dev mode
  if (isDevTestPhone(phoneE164)) {
    console.log(`[Dev Test Mode] Using test phone ${phoneE164} with fixed OTP ${DEV_TEST_OTP}`);
    return {
      success: true,
      message: `Dev Test Mode Active. Use OTP: ${DEV_TEST_OTP}`,
      isDevTest: true,
    };
  }

  try {
    let verifier = getOrCreateRecaptchaVerifier("recaptcha-container");
    console.log(`[Firebase Phone Auth] Requesting real-time SMS for: ${phoneE164}`);

    let confirmationResult: ConfirmationResult;
    try {
      confirmationResult = await signInWithPhoneNumber(auth, phoneE164, verifier);
    } catch (innerErr: any) {
      // Auto-retry once if grecaptcha collision detected
      if (innerErr?.message && innerErr.message.includes("already been rendered")) {
        console.warn("[Firebase] reCAPTCHA already rendered collision detected. Resetting container and retrying...");
        resetRecaptchaVerifier("recaptcha-container");
        verifier = getOrCreateRecaptchaVerifier("recaptcha-container");
        confirmationResult = await signInWithPhoneNumber(auth, phoneE164, verifier);
      } else {
        throw innerErr;
      }
    }

    activeConfirmationResult = confirmationResult;

    return {
      success: true,
      message: `A 6-digit verification code was sent to ${phoneE164}`,
    };
  } catch (error: any) {
    console.error("[Firebase Phone Auth Error]", error);

    // Reset recaptcha verifier on failure so next attempt starts clean
    resetRecaptchaVerifier("recaptcha-container");

    const code = error?.code || "";
    const msg = error?.message || "";
    let friendlyMessage = msg || "Failed to send verification SMS. Please try again.";

    if (msg.includes("already been rendered")) {
      friendlyMessage = "Security verification refreshed. Please click Send OTP again.";
    } else if (code === "auth/invalid-phone-number") {
      friendlyMessage = "Invalid phone number format. Please enter a valid 10-digit mobile number.";
    } else if (code === "auth/unauthorized-domain") {
      const currentHost = typeof window !== "undefined" ? window.location.hostname : "your domain";
      friendlyMessage = `This domain (${currentHost}) is not authorized in Firebase Console. Please add "${currentHost}" under Authentication > Settings > Authorized domains in console.firebase.google.com.`;
    } else if (code === "auth/too-many-requests") {
      friendlyMessage = "Too many requests. Please wait a few moments before requesting another OTP.";
    } else if (code === "auth/quota-exceeded") {
      friendlyMessage = "Daily SMS limit reached on this project. Please contact support.";
    } else if (code === "auth/operation-not-allowed") {
      friendlyMessage = "Phone Authentication is not enabled in Firebase Console. Please ensure Phone provider is toggled ON under Authentication > Sign-in method.";
    } else if (code === "auth/captcha-check-failed") {
      friendlyMessage = "reCAPTCHA verification failed. Please try again.";
    } else if (code === "auth/network-request-failed") {
      friendlyMessage = "Network error. Please check your internet connection.";
    }

    throw new Error(friendlyMessage);
  }
}

/**
 * Verifies the 6-digit OTP code entered by the user.
 */
export async function verifyFirebasePhoneOtp(
  phoneE164: string,
  otpCode: string
): Promise<{ success: boolean; user: any; isDevTest?: boolean }> {
  // Test bypass
  if (isDevTestPhone(phoneE164)) {
    if (otpCode.trim() !== DEV_TEST_OTP) {
      throw new Error(`Incorrect verification code. For test number use: ${DEV_TEST_OTP}`);
    }
    return {
      success: true,
      user: {
        id: "dev-test-user-9999999999",
        uid: "dev-test-user-9999999999",
        phone: DEV_TEST_PHONE,
        phoneNumber: DEV_TEST_PHONE,
        created_at: new Date().toISOString(),
      },
      isDevTest: true,
    };
  }

  if (!activeConfirmationResult) {
    throw new Error("No active OTP session found. Please request a new verification code.");
  }

  try {
    const userCredential = await activeConfirmationResult.confirm(otpCode.trim());
    const firebaseUser = userCredential.user;

    return {
      success: true,
      user: {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        phone: firebaseUser.phoneNumber || phoneE164,
        phoneNumber: firebaseUser.phoneNumber || phoneE164,
        created_at: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.error("[Firebase OTP Verify Error]", error);

    const code = error?.code || "";
    let friendlyMessage = "Verification failed. Please check the code and try again.";

    if (code === "auth/invalid-verification-code") {
      friendlyMessage = "Incorrect 6-digit verification code. Please check your SMS and try again.";
    } else if (code === "auth/code-expired") {
      friendlyMessage = "Verification code has expired. Please click Resend to receive a fresh OTP.";
    }

    throw new Error(friendlyMessage);
  }
}

/**
 * Signs out the current Firebase user.
 */
export async function logoutFirebaseAuth() {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn("Error signing out Firebase user:", err);
  }
}
