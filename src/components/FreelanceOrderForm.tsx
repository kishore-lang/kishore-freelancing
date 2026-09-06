import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Info,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { ServiceItem } from "./ServiceCard";
import { loadRazorpayScript } from "@/lib/loadRazorpay";

const formSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required (at least 2 characters)."),
    email: z.string().email("Please enter a valid email address."),
    whatsappNumber: z
      .string()
      .min(10, "Please enter a valid WhatsApp number (at least 10 digits).")
      .regex(/^[0-9+\s-]+$/, "WhatsApp number can only contain digits, spaces, +, and -"),
    selectedService: z.string().min(1, "Please select a service above."),
    projectRequirements: z
      .string()
      .min(10, "Please describe your project requirements (at least 10 characters)."),
    customAmount: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.selectedService === "Custom Project") {
      const num = Number(data.customAmount);
      if (!data.customAmount || isNaN(num) || num <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid positive amount in INR for your custom project.",
          path: ["customAmount"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface FreelanceOrderFormProps {
  selectedService: ServiceItem | null;
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

interface PaymentResultState {
  status: "verified_success" | "verification_failed" | "cancelled" | "failed" | "network_error";
  orderId?: string;
  paymentId?: string;
  amountInRupees?: number;
  serviceName?: string;
  message?: string;
  isPlaceholderKey?: boolean;
}

export const FreelanceOrderForm = ({
  selectedService,
  services,
  onSelectService,
}: FreelanceOrderFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResultState | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsappNumber: "",
      selectedService: selectedService?.title || "",
      projectRequirements: "",
      customAmount: "",
    },
  });

  // Keep form in sync when selectedService prop changes from parent card selection
  useEffect(() => {
    if (selectedService) {
      form.setValue("selectedService", selectedService.title, { shouldValidate: true });
      if (!selectedService.isCustom) {
        form.setValue("customAmount", "");
      }
    }
  }, [selectedService, form]);

  const watchCustomAmount = form.watch("customAmount");
  const watchSelectedService = form.watch("selectedService");

  // Determine current service object
  const currentServiceObj = services.find((s) => s.title === watchSelectedService) || selectedService;

  // Compute final displayed amount
  const getDisplayAmount = () => {
    if (!currentServiceObj) return "₹0";
    if (currentServiceObj.isCustom) {
      const num = Number(watchCustomAmount);
      if (watchCustomAmount && !isNaN(num) && num > 0) {
        return `₹${num.toLocaleString("en-IN")}`;
      }
      return "₹ (Enter Amount)";
    }
    return currentServiceObj.price;
  };

  /**
   * Sends payment details to backend POST /api/verify-payment for HMAC-SHA256 signature verification.
   */
  const handleVerifyPayment = async (
    orderId: string,
    paymentId: string,
    signature: string,
    amountInRupees: number,
    serviceName: string,
    isPlaceholderKey = false
  ) => {
    setLoadingText("Verifying Payment Signature...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.verified) {
        setPaymentResult({
          status: "verified_success",
          orderId: data.payment.orderId || orderId,
          paymentId: data.payment.paymentId || paymentId,
          amountInRupees: amountInRupees,
          serviceName: serviceName,
          isPlaceholderKey: isPlaceholderKey,
        });

        toast({
          title: "Payment Verified! 🎉",
          description: "Payment verification successful.",
          duration: 6000,
        });
      } else {
        setPaymentResult({
          status: "verification_failed",
          orderId: orderId,
          paymentId: paymentId,
          message: data.message || "Payment signature verification failed.",
        });

        toast({
          title: "Payment Verification Failed",
          description: data.message || "Signature verification failed.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setPaymentResult({
        status: "network_error",
        message: "Payment verification could not be completed. Backend server unavailable.",
      });

      toast({
        title: "Verification Network Error",
        description: "Could not connect to backend server for verification.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoadingText("");
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setLoadingText("Creating Order...");
    setPaymentResult(null);

    try {
      const serviceObj = services.find((s) => s.title === data.selectedService) || selectedService;
      
      const payload = {
        serviceId: serviceObj?.id || "custom-project",
        serviceName: data.selectedService,
        amount: serviceObj?.numericPrice || Number(data.customAmount) || 0,
        customerName: data.fullName,
        customerEmail: data.email,
        whatsappNumber: data.whatsappNumber,
        projectRequirements: data.projectRequirements,
        customAmount: data.customAmount,
      };

      // 1. Create Backend Razorpay Order
      const response = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to create Razorpay Order.");
      }

      // Check if placeholder keys are used in server/.env
      const isPlaceholder =
        !orderData.keyId ||
        orderData.keyId === "rzp_test_placeholder_key_id" ||
        orderData.keyId.includes("placeholder");

      if (isPlaceholder) {
        // If placeholder keys are used, simulate Razorpay payment response and verify via POST /api/verify-payment
        toast({
          title: "Placeholder Test Key Detected",
          description: "Add your real Razorpay TEST keys from dashboard.razorpay.com into server/.env to launch the live Razorpay modal. Verifying test order...",
          duration: 7000,
        });

        const mockPaymentId = `pay_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const mockSignature = `sig_test_${Date.now()}`;

        await handleVerifyPayment(
          orderData.order.id,
          mockPaymentId,
          mockSignature,
          orderData.order.amountInRupees,
          orderData.order.serviceName,
          true
        );
        return;
      }

      // 2. Load Razorpay Checkout SDK Script
      setLoadingText("Loading Payment...");
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout SDK. Please check your internet connection.");
      }

      // 3. Configure Razorpay Checkout Options for Real Test Keys
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount, // in paise
        currency: orderData.order.currency,
        name: "Kishore Freelance Services",
        description: orderData.order.serviceName,
        order_id: orderData.order.id,
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.whatsappNumber,
        },
        theme: {
          color: "#00f0ff", // Neon Cyan Cyberpunk theme
        },
        handler: async function (razorpayResp: any) {
          // Send payment details to backend POST /api/verify-payment
          await handleVerifyPayment(
            razorpayResp.razorpay_order_id || orderData.order.id,
            razorpayResp.razorpay_payment_id,
            razorpayResp.razorpay_signature,
            orderData.order.amountInRupees,
            orderData.order.serviceName
          );
        },
        modal: {
          onDismiss: function () {
            setIsSubmitting(false);
            setLoadingText("");
            setPaymentResult({
              status: "cancelled",
              message: "Payment checkout window was closed before completion.",
            });
            toast({
              title: "Payment Cancelled",
              description: "You closed the checkout window.",
            });
          },
        },
      };

      // 4. Instantiate and Open Razorpay Checkout Modal
      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (failureResponse: any) {
        setIsSubmitting(false);
        setLoadingText("");
        const errorDetail = failureResponse.error?.description || "Payment process failed.";
        setPaymentResult({
          status: "failed",
          message: errorDetail,
        });
        toast({
          title: "Payment Failed",
          description: errorDetail,
          variant: "destructive",
        });
      });

      rzp.open();
    } catch (error: any) {
      setIsSubmitting(false);
      setLoadingText("");
      toast({
        title: "Checkout Error",
        description: error.message || "Could not initiate payment checkout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div id="order-form-section" className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mb-8 border-b border-white/10 pb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="text-primary w-6 h-6" />
          <span>Project Order Details</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Fill in your details below to request a service and launch Razorpay Checkout.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">Full Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="bg-background/50 border-white/10 focus:border-primary rounded-xl h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      className="bg-background/50 border-white/10 focus:border-primary rounded-xl h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Number */}
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">WhatsApp Number *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
                      {...field}
                      className="bg-background/50 border-white/10 focus:border-primary rounded-xl h-11"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Required for direct project updates and notifications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Service Selector */}
            <FormField
              control={form.control}
              name="selectedService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">Selected Service *</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        const matched = services.find((s) => s.title === e.target.value);
                        if (matched) onSelectService(matched);
                      }}
                      className="w-full h-11 px-3 rounded-xl border border-white/10 bg-background/90 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                    >
                      <option value="" disabled>-- Select a Service --</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.title} className="bg-background text-foreground">
                          {s.title} ({s.price})
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Custom Amount Input if Custom Project is selected */}
          {currentServiceObj?.isCustom && (
            <FormField
              control={form.control}
              name="customAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-semibold">Custom Amount (INR ₹) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 5000"
                      {...field}
                      className="bg-background/50 border-white/10 focus:border-primary rounded-xl h-11"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Enter the agreed custom price in Indian Rupees.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Project Requirements */}
          <FormField
            control={form.control}
            name="projectRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold">Project Requirements / Details *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your project vision, target features, timelines, or links to reference sites..."
                    rows={4}
                    {...field}
                    className="bg-background/50 border-white/10 focus:border-primary rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pricing Summary Card */}
          <div className="glass-card rounded-2xl p-5 border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-1">
                Order Summary
              </div>
              <div className="text-lg font-semibold text-foreground">
                Service: <span className="text-primary">{currentServiceObj?.title || "None Selected"}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs uppercase font-medium text-muted-foreground tracking-wider mb-1">
                Total Payable Amount
              </div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {getDisplayAmount()}
              </div>
            </div>
          </div>

          {/* Information Banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
            <p className="text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-secondary/50">
              Submitting will initiate the Razorpay Checkout process. Payment signatures are cryptographically verified by our Node.js backend.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 text-base font-bold rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent text-background shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transition-all duration-300 hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {loadingText || "Processing..."}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* PHASE 7: SIGNATURE VERIFICATION RESULT CARD DISPLAY */}
      {paymentResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-8 glass-card p-6 rounded-2xl border space-y-4 ${
            paymentResult.status === "verified_success"
              ? "border-emerald-500/40 bg-emerald-500/5"
              : paymentResult.status === "verification_failed"
              ? "border-destructive/40 bg-destructive/5"
              : "border-muted-foreground/30 bg-white/5"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              {paymentResult.status === "verified_success" && (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              )}
              {paymentResult.status === "verification_failed" && (
                <AlertCircle className="w-6 h-6 text-destructive" />
              )}
              {(paymentResult.status === "cancelled" || paymentResult.status === "failed") && (
                <XCircle className="w-6 h-6 text-muted-foreground" />
              )}
              {paymentResult.status === "network_error" && (
                <AlertCircle className="w-6 h-6 text-amber-400" />
              )}

              <span className="font-bold text-lg text-foreground">
                {paymentResult.status === "verified_success" && "Payment Verified"}
                {paymentResult.status === "verification_failed" && "Payment Verification Failed"}
                {paymentResult.status === "cancelled" && "Payment Cancelled"}
                {paymentResult.status === "failed" && "Payment Failed"}
                {paymentResult.status === "network_error" && "Payment verification could not be completed."}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {paymentResult.status === "verified_success" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                  HMAC VERIFIED ✓
                </span>
              )}
            </div>
          </div>

          {/* Details for Verified Payment */}
          {paymentResult.status === "verified_success" && (
            <>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                Payment verification successful.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Service Name</span>
                  <span className="font-medium text-foreground">{paymentResult.serviceName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Total Paid</span>
                  <span className="font-bold text-primary text-base">
                    ₹{paymentResult.amountInRupees?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Razorpay Order ID</span>
                  <code className="font-mono text-xs bg-black/40 px-2 py-1 rounded text-cyan-400 border border-cyan-500/30">
                    {paymentResult.orderId}
                  </code>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Razorpay Payment ID</span>
                  <code className="font-mono text-xs bg-black/40 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30">
                    {paymentResult.paymentId}
                  </code>
                </div>
              </div>
            </>
          )}

          {/* Details for Verification Failure / Cancelled / Network Error */}
          {paymentResult.status !== "verified_success" && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {paymentResult.message || "Payment process did not result in a verified payment."}
            </p>
          )}

          {/* Notice for placeholder keys */}
          {paymentResult.razorpayOrderId?.startsWith("order_test_") && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs sm:text-sm text-amber-500/90 leading-relaxed">
                <strong className="font-semibold text-amber-400">Notice:</strong> Using placeholder test keys in <code className="bg-black/30 px-1 py-0.5 rounded">server/.env</code>. 
                To launch the live interactive Razorpay popup modal, add your Key ID & Key Secret from <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-100">dashboard.razorpay.com</a>.
              </p>
            </div>
          )}

          {/* Important Security & Status Limitations Note */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-white/10 flex items-start gap-2">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              {paymentResult.status === "verified_success"
                ? "ℹ️ Cryptographic HMAC-SHA256 signature verified by backend server. Database persistence (MySQL) will be connected in Phase 8."
                : "ℹ️ Payment signature verification failed or was cancelled. No order has been verified."}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
