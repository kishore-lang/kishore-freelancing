import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";
import { PhoneAuthForm } from "./PhoneAuthForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 text-black dark:text-white border-zinc-200 dark:border-zinc-800 rounded-none p-0 overflow-hidden shadow-2xl">
        <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900/50">
          <DialogHeader className="mb-6 text-left">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2 text-zinc-900 dark:text-white">
              <ShieldCheck className="text-red-600 w-7 h-7" /> Client / Student Login
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400 font-medium">
              Access your project dashboard, active bookings, and course records via Supabase Phone OTP.
            </DialogDescription>
          </DialogHeader>

          <PhoneAuthForm isModal onSuccess={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
