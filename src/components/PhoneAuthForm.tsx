import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { 
  Loader2, 
  ShieldCheck, 
  Phone, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  User, 
  Mail, 
  BookOpen,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  supabase, 
  sendPhoneOtp, 
  verifyPhoneOtp, 
  isDevTestPhone, 
  DEV_TEST_PHONE, 
  DEV_TEST_OTP 
} from "@/lib/supabase";
import { 
  sendFirebasePhoneOtp, 
  verifyFirebasePhoneOtp 
} from "@/lib/firebaseAuth";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const POPULAR_COURSES = [
  "Full-Stack Web Application Development",
  "SaaS & MVP Product Architecture",
  "Modern UI/UX & Frontend Engineering",
  "REST API & Cloud Backend Architecture",
  "Performance Optimization & SEO Audit",
  "Cinema Camera & Production Gear Rental",
  "Custom Enterprise Solutions",
];

interface PhoneAuthFormProps {
  onSuccess?: () => void;
  className?: string;
  isModal?: boolean;
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({ onSuccess, className = "", isModal = false }) => {
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [otpBoxes, setOtpBoxes] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // Profile state for new users
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState(POPULAR_COURSES[0]);
  const [customCourse, setCustomCourse] = useState("");
  
  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  // 30-second timer countdown
  useEffect(() => {
    let interval: any = null;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Auto-focus first OTP box when entering OTP step
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Format clean E.164 phone
  const getE164Phone = () => {
    const raw = phoneDigits.replace(/\D/g, "");
    return `+91${raw}`;
  };

  // 10-digit validation
  const isValid10DigitPhone = () => {
    const raw = phoneDigits.replace(/\D/g, "");
    return raw.length === 10;
  };

  // Handle Send OTP
  const handleSendOtp = async (isResend = false) => {
    setErrorMessage(null);
    if (!isValid10DigitPhone()) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const fullPhone = getE164Phone();
    setLoading(true);

    try {
      let res: any;
      try {
        // Primary: Firebase Phone Auth (Google real-time SMS to any mobile number)
        res = await sendFirebasePhoneOtp(fullPhone);
      } catch (fbErr: any) {
        console.warn("[PhoneAuth] Firebase send error, attempting Supabase fallback:", fbErr.message);
        res = await sendPhoneOtp(fullPhone);
      }

      setStep("otp");
      setResendTimer(30);
      setCanResend(false);
      setOtpBoxes(["", "", "", "", "", ""]);

      toast({
        title: isResend ? "Code Resent!" : "OTP Dispatched! 📲",
        description: res.isDevTest 
          ? `Dev Test Mode Active: Use OTP ${DEV_TEST_OTP}` 
          : `A 6-digit verification code was sent to ${fullPhone}`,
      });
    } catch (err: any) {
      const msg = err.message || "Failed to send verification code. Please try again.";
      setErrorMessage(msg);
      toast({
        variant: "destructive",
        title: "Could not send OTP",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle individual box OTP input
  const handleOtpBoxChange = (index: number, val: string) => {
    // Only accept numeric
    const cleanChar = val.replace(/\D/g, "").slice(-1);
    const updated = [...otpBoxes];
    updated[index] = cleanChar;
    setOtpBoxes(updated);
    setErrorMessage(null);

    // Auto-advance to next box if character entered
    if (cleanChar && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 boxes are filled
    const fullCode = updated.join("");
    if (fullCode.length === 6) {
      triggerVerifyOtp(fullCode);
    }
  };

  // Handle Backspace navigation across boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpBoxes[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste support (e.g. pasting "123456" into any box)
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const updated = [...otpBoxes];
    for (let i = 0; i < 6; i++) {
      updated[i] = pastedData[i] || "";
    }
    setOtpBoxes(updated);
    setErrorMessage(null);

    // Focus on the next empty box or the 6th box
    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();

    // Auto-submit if 6 digits pasted
    if (pastedData.length === 6) {
      triggerVerifyOtp(pastedData);
    }
  };

  // Verify OTP
  const triggerVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpBoxes.join("");
    if (code.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    const fullPhone = getE164Phone();

    try {
      let verifyResult: any;
      try {
        // Primary: Firebase Phone Auth
        verifyResult = await verifyFirebasePhoneOtp(fullPhone, code);
      } catch (fbErr: any) {
        console.warn("[PhoneAuth] Firebase verify failed, attempting Supabase fallback:", fbErr.message);
        verifyResult = await verifyPhoneOtp(fullPhone, code);
      }

      const user = verifyResult.user;
      setAuthenticatedUser(user);

      // Check if profile exists in Supabase profiles table
      let existingProfile: any = null;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!error && data) {
          existingProfile = data;
        }
      } catch (dbErr) {
        console.warn("Could not query profiles from Supabase, checking local/dev mode:", dbErr);
      }

      // Also check fallback API if Supabase table is empty or offline
      if (!existingProfile && verifyResult.isDevTest) {
        const savedDevProfile = localStorage.getItem(`dev_profile_${fullPhone}`);
        if (savedDevProfile) {
          existingProfile = JSON.parse(savedDevProfile);
        }
      }

      // Check if existing user is blocked
      if (existingProfile?.is_blocked) {
        await supabase.auth.signOut();
        setErrorMessage("Your account has been suspended by an administrator. Please contact support.");
        toast({
          variant: "destructive",
          title: "Account Suspended",
          description: "Your access has been blocked. Please contact kfreelance@kfreelance.online",
        });
        setLoading(false);
        return;
      }

      // Existing User -> Go straight to dashboard!
      if (existingProfile && existingProfile.full_name) {
        login({
          id: existingProfile.id,
          fullName: existingProfile.full_name,
          email: existingProfile.email || "",
          whatsappNumber: existingProfile.phone || fullPhone,
        });

        toast({
          title: "Welcome Back! 👋",
          description: `Logged in as ${existingProfile.full_name}`,
        });

        if (onSuccess) onSuccess();
        navigate("/dashboard");
        return;
      }

      // New User -> Transition to Profile Step
      setStep("profile");
    } catch (err: any) {
      const msg = err.message || "Invalid or expired OTP. Please try again.";
      setErrorMessage(msg);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Complete Registration for New User
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    const fullPhone = getE164Phone();
    const finalCourse = course === "Other (Custom Request)" ? (customCourse.trim() || "Custom Request") : course;
    setLoading(true);

    try {
      const userId = authenticatedUser?.id || `user_${Date.now()}`;
      const profileData = {
        id: userId,
        phone: fullPhone,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase() || null,
        course: finalCourse,
        is_blocked: false,
        created_at: new Date().toISOString(),
      };

      // 1. Save to Supabase 'profiles' table (with RLS: users read/update only their own row)
      try {
        const { error } = await supabase.from("profiles").upsert(profileData);
        if (error) {
          console.warn("Supabase profiles table upsert notice:", error.message);
        }
      } catch (sbErr) {
        console.warn("Supabase profiles insert skipped/local:", sbErr);
      }

      // Save locally for dev fallback
      localStorage.setItem(`dev_profile_${fullPhone}`, JSON.stringify(profileData));

      // 2. Trigger Backend Signup Integration:
      // - Appends row to Google Sheet "Users" tab (Name, Mobile, Course, Date)
      // - Sends welcome email via Resend if email provided
      try {
        await fetch(`${API_BASE_URL}/api/users/on-signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            name: fullName.trim(),
            mobile: fullPhone,
            email: email.trim().toLowerCase() || null,
            course: finalCourse,
          }),
        });
      } catch (backendErr) {
        console.warn("Backend on-signup notification error:", backendErr);
      }

      // 3. Log into client state
      login({
        id: userId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase() || "",
        whatsappNumber: fullPhone,
      });

      toast({
        title: "Registration Complete! 🎉",
        description: `Welcome to K Freelancing, ${fullName}!`,
      });

      if (onSuccess) onSuccess();
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Could not complete registration. Please try again.";
      setErrorMessage(msg);
      toast({
        variant: "destructive",
        title: "Profile Save Failed",
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <AnimatePresence mode="wait">
        {/* ================= STEP 1: MOBILE NUMBER ================= */}
        {step === "phone" && (
          <motion.div
            key="step-phone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Mobile Number
                </label>
                <span className="text-[11px] text-zinc-500 font-medium">OTP via SMS / Phone</span>
              </div>

              {/* Prefilled +91 Indian Mobile Field */}
              <div className="flex rounded-none border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600 transition-all overflow-hidden shadow-sm">
                <div className="flex items-center gap-1.5 px-3.5 bg-zinc-100 dark:bg-zinc-800/80 border-r border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-sm select-none">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span>+91</span>
                </div>
                <Input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phoneDigits}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhoneDigits(raw);
                    setErrorMessage(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isValid10DigitPhone() && !loading) {
                      handleSendOtp();
                    }
                  }}
                  autoFocus
                  className="border-0 shadow-none focus-visible:ring-0 text-base font-semibold tracking-wider h-12 bg-transparent text-zinc-900 dark:text-white"
                />
              </div>

              {/* 10-digit validation hint */}
              <div className="flex justify-between items-center mt-1.5 text-[11px] font-medium">
                <span className={phoneDigits.length === 10 ? "text-green-600 font-semibold flex items-center gap-1" : "text-zinc-400"}>
                  {phoneDigits.length === 10 ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> 10-digit mobile verified
                    </>
                  ) : (
                    `Enter 10-digit number (${phoneDigits.length}/10)`
                  )}
                </span>
                
                {/* Dev quick test shortcut button */}
                <button
                  type="button"
                  onClick={() => {
                    setPhoneDigits("9999999999");
                    setErrorMessage(null);
                  }}
                  className="text-red-500 hover:text-red-600 hover:underline text-[10px] font-bold"
                >
                  Use Dev Test Phone
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-none text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Send OTP Button */}
            <Button
              type="button"
              onClick={() => handleSendOtp(false)}
              disabled={loading || !isValid10DigitPhone()}
              className="w-full h-12 rounded-none bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide transition-all shadow-md shadow-red-600/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending Verification Code...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-zinc-500 font-medium">
                🔒 Secured by Firebase Google SMS Gateway with instant real-time delivery.
              </p>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 2: 6-BOX OTP SCREEN ================= */}
        {step === "otp" && (
          <motion.div
            key="step-otp"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-full mb-3 text-red-600">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                Enter Verification Code
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                We sent a 6-digit OTP to <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{getE164Phone()}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline mt-1.5"
              >
                <ArrowLeft className="w-3 h-3" /> Change mobile number
              </button>
            </div>

            {/* 6 Individual Auto-Focus OTP Boxes with Paste & Auto-Submit */}
            <div>
              <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                {otpBoxes.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpBoxChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-2xl font-black rounded-none border transition-all bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      digit 
                        ? "border-red-600 bg-red-50/20 dark:bg-red-950/20 shadow-sm" 
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  />
                ))}
              </div>

              {/* Dev mode helper */}
              {isDevTestPhone(getE164Phone()) && (
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  ⚡ Dev Test Phone Detected! Fixed OTP: <strong>{DEV_TEST_OTP}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      const testArr = DEV_TEST_OTP.split("");
                      setOtpBoxes(testArr);
                      triggerVerifyOtp(DEV_TEST_OTP);
                    }}
                    className="ml-2 underline hover:text-amber-800"
                  >
                    (Auto-fill)
                  </button>
                </div>
              )}
            </div>

            {/* Error Message with clear distinction (Wrong OTP, Expired, Too Many Attempts) */}
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-none text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="button"
              onClick={() => triggerVerifyOtp()}
              disabled={loading || otpBoxes.join("").length < 6}
              className="w-full h-12 rounded-none bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide transition-all shadow-md shadow-red-600/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying Code...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            {/* 30-Second Resend Countdown Timer */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-500 font-medium">Didn't receive the code?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={() => handleSendOtp(true)}
                  disabled={loading}
                  className="font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend OTP
                </button>
              ) : (
                <span className="font-mono font-bold text-zinc-500">
                  Resend in <span className="text-red-600 font-extrabold">{resendTimer}s</span>
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: NEW USER PROFILE COMPLETION ================= */}
        {step === "profile" && (
          <motion.div
            key="step-profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-black text-sm uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Account Registration
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                Complete Your Profile
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Phone verified! Enter your details to activate your student/client dashboard.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                  <Input
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-11 rounded-none border-zinc-300 dark:border-zinc-700 font-medium bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>

              {/* Email Address (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Optional</span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-none border-zinc-300 dark:border-zinc-700 font-medium bg-white dark:bg-zinc-900"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 font-medium">
                  We'll send your PDF invoices and welcome guide here if provided.
                </p>
              </div>

              {/* Course / Service Interested */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Course / Service Interested *
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-none border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                  >
                    {POPULAR_COURSES.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-zinc-900">
                        {c}
                      </option>
                    ))}
                    <option value="Other (Custom Request)" className="bg-white dark:bg-zinc-900">
                      Other (Custom Project / Inquiries)
                    </option>
                  </select>
                </div>

                {course === "Other (Custom Request)" && (
                  <Input
                    placeholder="Specify course or project requirement..."
                    value={customCourse}
                    onChange={(e) => setCustomCourse(e.target.value)}
                    className="h-10 mt-2 rounded-none border-zinc-300 dark:border-zinc-700 font-medium bg-white dark:bg-zinc-900"
                  />
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-none text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !fullName.trim()}
                className="w-full h-12 rounded-none bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide transition-all shadow-md shadow-red-600/20 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Profile & Setting up Dashboard...
                  </>
                ) : (
                  "Complete & Go to Dashboard"
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible container for Firebase phone auth reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
};
