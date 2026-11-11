import React from "react";
import { Navigation } from "@/components/Navigation";
import { PhoneAuthForm } from "@/components/PhoneAuthForm";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-between selection:bg-red-600 selection:text-white">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-none p-0 h-auto font-bold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="bg-zinc-900/90 border border-zinc-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/10 border border-red-600/30 rounded-none mb-3 text-red-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Client / Student <span className="text-red-600">Portal</span>
              </h1>
              <p className="text-sm text-zinc-400 font-medium mt-1.5">
                Sign in with your mobile number to access courses, orders, invoices, and project milestones.
              </p>
            </div>

            <PhoneAuthForm onSuccess={() => navigate("/dashboard")} />
          </div>

          <p className="text-center text-xs text-zinc-500 mt-6 font-medium">
            © {new Date().getFullYear()} K Freelancing • Professional Web & Tech Academy
          </p>
        </motion.div>
      </main>
    </div>
  );
}
