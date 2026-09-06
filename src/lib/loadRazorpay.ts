/**
 * Utility to dynamically and safely load the official Razorpay Checkout SDK script on the frontend.
 * URL: https://checkout.razorpay.com/v1/checkout.js
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
