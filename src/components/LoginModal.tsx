import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Loader2, ShieldCheck, Mail, Phone, ArrowLeft, RefreshCw, CheckCircle2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [step, setStep] = useState<"identifier" | "otp" | "profile">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [sentDestination, setSentDestination] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setStep("identifier");
      setIdentifier("");
      setSentDestination("");
      setOtp("");
      setFullName("");
      setEmail("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleSendOtp = async () => {
    const trimmed = identifier.trim();
    if (!trimmed) {
      toast({
        title: "Required",
        description: "Please enter your mobile number or email address.",
        variant: "destructive",
      });
      return;
    }

    const isEmail = trimmed.includes("@");
    const digitsOnly = trimmed.replace(/\D/g, "");

    if (!isEmail && digitsOnly.length < 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send verification code.");
      }

      setSentDestination(data.targetEmail || data.targetPhone || trimmed);
      setStep("otp");
      toast({
        title: "Code Dispatched!",
        description: data.message || "Your 6-digit login code has been sent.",
      });
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      toast({
        title: "Could not send code",
        description: error.message || "Failed to connect to authentication server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.trim().replace(/\D/g, "");
    if (cleanOtp.length < 6) {
      toast({
        title: "Incomplete Code",
        description: "Please enter the full 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          otp: cleanOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Verification code is incorrect or expired.");
      }

      if (data.isNewUser) {
        // Pre-fill email if they entered an email as identifier
        if (identifier.includes("@")) {
          setEmail(identifier.trim().toLowerCase());
        }
        setStep("profile");
      } else {
        login(data.user);
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${data.user.full_name || data.user.email}!`,
        });
        onClose();
      }
    } catch (error: any) {
      console.error("Verification Error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code entered. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!fullName.trim() || !email.trim()) {
      toast({
        title: "Required",
        description: "Please enter your name and email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          otp: otp.trim(),
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create customer profile.");
      }

      login(data.user);
      toast({
        title: "Welcome to K Freelancing!",
        description: "Your customer account has been registered successfully.",
      });
      onClose();
    } catch (error: any) {
      console.error("Profile Registration Error:", error);
      toast({
        title: "Registration Error",
        description: error.message || "Could not complete account setup.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white text-black border-black/10 rounded-none p-0 overflow-hidden shadow-2xl">
        <div className="bg-zinc-50 p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-red-600 w-7 h-7" /> Client Portal
            </DialogTitle>
            <DialogDescription className="text-zinc-600 font-medium">
              Access your project dashboard, invoices, and service milestones.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === "identifier" && (
              <motion.div
                key="step-identifier"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1.5">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    {identifier.includes("@") ? (
                      <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    ) : (
                      <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    )}
                    <Input
                      placeholder="e.g. 9876543210 or your@email.com"
                      className="pl-11 h-12 rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-medium text-base bg-white"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading) {
                          handleSendOtp();
                        }
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5 font-medium">
                    We will send a 6-digit login verification code via WhatsApp / Email.
                  </p>
                </div>

                <Button
                  className="w-full h-12 rounded-none bg-black text-white hover:bg-red-600 font-bold transition-colors"
                  onClick={handleSendOtp}
                  disabled={loading || identifier.trim().length < 4}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" /> Sending Verification Code...
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-red-50/70 border border-red-200/60 p-3 text-center">
                  <p className="text-xs text-zinc-600 font-medium">
                    Enter the 6-digit verification code sent to
                  </p>
                  <p className="text-sm font-bold text-red-700 tracking-wide mt-0.5 break-all">
                    {sentDestination || identifier}
                  </p>
                </div>

                <div>
                  <Input
                    placeholder="• • • • • •"
                    className="h-14 text-center text-2xl tracking-[0.45em] rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-black bg-white"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !loading) {
                        handleVerifyOtp();
                      }
                    }}
                  />
                </div>

                <Button
                  className="w-full h-12 rounded-none bg-black text-white hover:bg-red-600 font-bold transition-colors"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.replace(/\D/g, "").length < 6}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" /> Verifying Code...
                    </span>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    className="text-xs font-semibold text-zinc-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                    onClick={() => {
                      setStep("identifier");
                      setOtp("");
                    }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Change Number / Email
                  </button>

                  <button
                    type="button"
                    className="text-xs font-semibold text-zinc-500 hover:text-red-600 flex items-center gap-1 transition-colors disabled:opacity-50"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Resend Code
                  </button>
                </div>
              </motion.div>
            )}

            {step === "profile" && (
              <motion.div
                key="step-profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-zinc-100 p-3 border border-zinc-200">
                  <p className="text-xs font-bold text-black flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" /> Verified Successfully!
                  </p>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Please provide your name and email to finish setting up your Client Account.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    <Input
                      placeholder="e.g. Kishore"
                      className="pl-11 h-12 rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-medium bg-white"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
                    <Input
                      placeholder="your@email.com"
                      type="email"
                      className="pl-11 h-12 rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-medium bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-12 rounded-none bg-red-600 text-white hover:bg-black font-bold mt-2 transition-colors"
                  onClick={handleCompleteProfile}
                  disabled={loading || !fullName.trim() || !email.trim()}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" /> Completing Setup...
                    </span>
                  ) : (
                    "Complete Registration & Enter Dashboard"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
