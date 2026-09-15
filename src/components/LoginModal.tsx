import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Phone, User, Mail, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const { login } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setStep("phone");
      setPhone("");
      setOtp("");
      setFullName("");
      setEmail("");
      setLoading(false);
    } else {
      // Initialize recaptcha when modal opens
      if (!window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {
              // reCAPTCHA solved
            }
          });
        } catch (e) {
          console.error("Recaptcha error", e);
        }
      }
    }
  }, [isOpen]);

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      toast({ title: "Invalid Phone Number", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
      toast({ title: "OTP Sent!", description: "Check your messages." });
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error sending OTP", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      
      // Successfully authenticated with Firebase. Now check our database.
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.isNewUser) {
          setStep("profile");
        } else {
          login(data.user);
          toast({ title: "Welcome back!", description: "You are successfully logged in." });
          onClose();
        }
      } else {
        throw new Error(data.message);
      }
      
    } catch (error: any) {
      console.error(error);
      toast({ title: "Invalid OTP", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!fullName || !email) {
      toast({ title: "Required", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone, fullName, email })
      });
      const data = await res.json();
      
      if (data.success) {
        login(data.user);
        toast({ title: "Profile Created!", description: "Welcome to K Freelancing." });
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white text-black border-black/10 rounded-none p-0 overflow-hidden">
        <div className="bg-zinc-50 p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-red-600" /> Client Portal
            </DialogTitle>
            <DialogDescription className="text-zinc-600 font-medium">
              Log in securely using your phone number.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input 
                    placeholder="Enter Phone Number" 
                    className="pl-10 h-12 rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-medium"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div id="recaptcha-container"></div>
                <Button 
                  className="w-full h-12 rounded-none bg-black text-white hover:bg-red-600 font-bold"
                  onClick={handleSendOtp}
                  disabled={loading || phone.length < 10}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send OTP"}
                </Button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <Input 
                  placeholder="Enter 6-digit OTP" 
                  className="h-12 text-center text-lg tracking-widest rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-bold"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <Button 
                  className="w-full h-12 rounded-none bg-black text-white hover:bg-red-600 font-bold"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Login"}
                </Button>
                <Button variant="ghost" className="w-full rounded-none font-medium text-zinc-500" onClick={() => setStep("phone")}>
                  Change Phone Number
                </Button>
              </motion.div>
            )}

            {step === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <p className="text-sm font-bold text-red-600 mb-2">New user? Please complete your profile.</p>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input 
                    placeholder="Full Name" 
                    className="pl-10 h-12 rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-medium"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <Input 
                    placeholder="Email Address" 
                    type="email"
                    className="pl-10 h-12 rounded-none border-zinc-300 focus:border-red-600 focus:ring-red-600 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full h-12 rounded-none bg-red-600 text-white hover:bg-black font-bold mt-2"
                  onClick={handleCompleteProfile}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Registration"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
