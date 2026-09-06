import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Navigation } from "@/components/Navigation";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReceiptData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  amount: number;
  orderId: string;
  paymentId: string;
  date: string;
}

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    // Expecting the payment data to be passed via router state
    const state = location.state as { paymentResult: any; formData: any; selectedService: any };
    
    if (!state || !state.paymentResult || !state.paymentResult.verified) {
      // If no valid state is found (e.g., direct navigation), redirect back to home
      navigate("/");
      return;
    }

    setReceiptData({
      customerName: state.formData.fullName || "Customer",
      customerEmail: state.formData.email || "No Email",
      serviceName: state.selectedService.title,
      amount: Number(state.selectedService.numericPrice || state.formData.customAmount || 0),
      orderId: state.paymentResult.razorpayOrderId,
      paymentId: state.paymentResult.razorpayPaymentId,
      date: new Date().toLocaleString(),
    });
  }, [location, navigate]);

  const generatePDF = () => {
    if (!receiptData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text("K Freelancing", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Professional Web Development Services", 14, 30);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("PAYMENT RECEIPT", 14, 45);

    // Details
    doc.setFontSize(11);
    doc.text(`Date: ${receiptData.date}`, 14, 55);
    doc.text(`Receipt No: ${receiptData.paymentId}`, 14, 62);
    
    doc.text("Billed To:", 14, 75);
    doc.setFont("helvetica", "bold");
    doc.text(receiptData.customerName, 14, 82);
    doc.setFont("helvetica", "normal");
    doc.text(receiptData.customerEmail, 14, 89);

    // Table
    autoTable(doc, {
      startY: 100,
      head: [["Description", "Amount (INR)"]],
      body: [
        [receiptData.serviceName, `Rs. ${receiptData.amount.toLocaleString()}`],
      ],
      theme: "striped",
      headStyles: { fillColor: [0, 102, 204] },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: Rs. ${receiptData.amount.toLocaleString()}`, 14, finalY + 10);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 105, finalY + 30, { align: "center" });

    // Save
    doc.save(`Receipt_${receiptData.paymentId}.pdf`);
  };

  if (!receiptData) return null; // Will redirect in useEffect

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 max-w-lg w-full text-center border border-emerald-500/30 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50"
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for choosing K Freelancing. Your payment of <span className="font-semibold text-foreground">₹{receiptData.amount.toLocaleString()}</span> has been received successfully.
          </p>

          <div className="bg-white/5 rounded-xl p-4 mb-8 text-left border border-white/10 space-y-2 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-xs">{receiptData.orderId}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-2">
              <span className="text-muted-foreground">Payment ID</span>
              <span className="font-mono text-xs">{receiptData.paymentId}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium text-right">{receiptData.serviceName}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generatePDF}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-foreground px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
