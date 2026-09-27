import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Printer, 
  Plus, 
  Trash2, 
  FileText, 
  Receipt, 
  Lock, 
  Sparkles, 
  Building2, 
  User, 
  IndianRupee, 
  ArrowLeft,
  QrCode,
  Eye,
  CheckCircle2,
  Wallet,
  Image,
  Smartphone,
  MessageSquare,
  Mail,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export default function InvoiceGenerator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  // Print Mode State: "a4" | "thermal80" | "thermal58"
  const [printMode, setPrintMode] = useState<"a4" | "thermal80" | "thermal58">("a4");

  // Company Details (Your Agency)
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyName, setCompanyName] = useState("K FREELANCING");
  const [companyAddress, setCompanyAddress] = useState("123 Tech Park, Anna Nagar, Chennai - 600040");
  const [companyPhone, setCompanyPhone] = useState("+91 98765 43210");
  const [companyEmail, setCompanyEmail] = useState("contact@kfreelancing.com");
  const [companyGst, setCompanyGst] = useState("33AAAAA0000A1Z5");

  // UPI Payment Details
  const [upiId, setUpiId] = useState("kishore@upi");
  const [showQrCode, setShowQrCode] = useState(true);

  // Customer Details & Client Company Logo
  const [customerName, setCustomerName] = useState("");
  const [clientCompanyLogo, setClientCompanyLogo] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  // Invoice Details
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Math.floor(100000 + Math.random() * 900000)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState<"PAID" | "PENDING" | "PARTIAL">("PENDING");

  // Line Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Website Development & Design", qty: 1, rate: 15000 },
    { id: "2", description: "Domain & Hosting (1 Year)", qty: 1, rate: 3000 }
  ]);

  // Tax, Discount & Paid Amount
  const [taxPercent, setTaxPercent] = useState<number>(18);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(5000);
  const [notes, setNotes] = useState("Thank you for your business! Please scan the UPI QR code to pay the balance amount.");

  // Check existing admin session
  useState(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      setIsAuthenticated(true);
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (
      passcode === savedPassword || 
      passcode === "KishoreAdmin123" || 
      passcode === "admin123" || 
      passcode === "kishore2026"
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminPassword", passcode);
      toast({ title: "Access Granted", description: "Welcome to Private Invoice Generator" });
    } else {
      toast({ title: "Access Denied", description: "Invalid passcode", variant: "destructive" });
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: "", qty: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast({ title: "Notice", description: "Invoice must have at least one item." });
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const grandTotal = taxableAmount + taxAmount;
  const balanceDue = Math.max(0, grandTotal - paidAmount);

  // Payable amount for QR Code
  const payableQrAmount = balanceDue > 0 ? balanceDue : grandTotal;

  // Generate UPI QR Code URL
  const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(companyName)}&am=${payableQrAmount}&cu=INR&tn=${encodeURIComponent('Invoice ' + invoiceNo)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiString)}`;

  const handlePrint = () => {
    window.print();
  };

  // Send Invoice via WhatsApp
  const handleSendWhatsApp = () => {
    if (!customerPhone) {
      toast({ title: "Phone Required", description: "Please enter customer phone number.", variant: "destructive" });
      return;
    }
    
    const rawDigits = customerPhone.replace(/\D/g, "");
    const formattedPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

    const itemSummary = items.map((item, i) => `${i+1}. ${item.description || 'Item'} (${item.qty} x ₹${item.rate} = ₹${item.qty * item.rate})`).join("\n");

    const message = `📄 *INVOICE FROM ${companyName.toUpperCase()}*
----------------------------------
*Invoice No:* #${invoiceNo}
*Date:* ${invoiceDate}
*Client:* ${customerName || 'Valued Customer'}
----------------------------------
*ITEMS / SERVICES:*
${itemSummary}
----------------------------------
*Subtotal:* ₹${subtotal.toLocaleString()}
${taxAmount > 0 ? `*GST (${taxPercent}%):* +₹${taxAmount.toLocaleString()}\n` : ''}${discountAmount > 0 ? `*Discount (${discountPercent}%):* -₹${discountAmount.toLocaleString()}\n` : ''}*Grand Total:* ₹${grandTotal.toLocaleString()}
${paidAmount > 0 ? `*Paid / Advance:* -₹${paidAmount.toLocaleString()}\n` : ''}*BALANCE DUE:* ₹${balanceDue.toLocaleString()}
----------------------------------
${showQrCode && upiId ? `💳 *Payable via UPI ID:* ${upiId}\n----------------------------------\n` : ''}*Notes:* ${notes}

Thank you for your business!`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    toast({ title: "Opening WhatsApp", description: `Sending invoice summary to ${formattedPhone}` });
  };

  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Send Invoice via Automated Resend Email API
  const handleSendEmail = async () => {
    if (!customerEmail) {
      toast({ title: "Email Required", description: "Please enter customer email address.", variant: "destructive" });
      return;
    }

    setIsSendingEmail(true);
    toast({ title: "Sending Automated Email...", description: `Sending invoice directly to ${customerEmail}` });

    try {
      const pass = sessionStorage.getItem("adminPassword") || "KishoreAdmin123";
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API_BASE_URL}/api/admin/send-invoice-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${pass}`
        },
        body: JSON.stringify({
          customerEmail,
          customerName,
          invoiceNo,
          invoiceDate,
          companyName,
          companyPhone,
          companyEmail,
          companyAddress,
          companyGst,
          items,
          subtotal,
          taxPercent,
          taxAmount,
          discountPercent,
          discountAmount,
          grandTotal,
          paidAmount,
          balanceDue,
          upiId,
          notes
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Email Sent Successfully! 🚀", description: `Invoice #${invoiceNo} sent directly to ${customerEmail}` });
      } else {
        throw new Error(data.message || "Failed to send email via Resend");
      }
    } catch (error: any) {
      console.warn("Resend email automated send failed, falling back to mailto:", error);
      toast({ title: "Direct Email Failed", description: `${error.message}. Opening email app fallback...`, variant: "destructive" });
      
      // Fallback to mailto
      const subject = `Invoice #${invoiceNo} from ${companyName}`;
      const body = `Dear ${customerName || 'Customer'},\n\nInvoice No: #${invoiceNo}\nGrand Total: ₹${grandTotal.toLocaleString()}\nBalance Due: ₹${balanceDue.toLocaleString()}\n\nThank you,\n${companyName}`;
      window.open(`mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Private Invoice Portal</CardTitle>
            <p className="text-sm text-zinc-400">Enter access key to open Invoice Generator</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Enter Access Passcode..." 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)}
                className="bg-black border-zinc-800 text-white h-12"
              />
              <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold">
                Unlock Invoice Generator
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Printable Area Specific Styles */}
      <style>{`
        @media print {
          @page {
            ${printMode === "thermal58"
              ? "size: 58mm auto !important; margin: 0 !important;"
              : printMode === "thermal80"
              ? "size: 80mm auto !important; margin: 0 !important;" 
              : "size: A4 portrait !important; margin: 10mm !important;"}
          }

          html, body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: ${printMode === "thermal58" ? "58mm" : printMode === "thermal80" ? "80mm" : "100%"} !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-area {
            display: block !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            width: ${printMode === "thermal58" ? "56mm" : printMode === "thermal80" ? "78mm" : "100%"} !important;
          }

          /* A4 Mode Print Setup */
          .print-mode-a4 {
            width: 100% !important;
            max-width: 800px !important;
            margin: 0 auto !important;
            font-size: 14px !important;
          }

          /* Thermal 80mm & 58mm Mode Print Setup */
          .print-mode-thermal {
            margin: 0 auto !important;
            font-family: 'Courier New', Courier, monospace !important;
            line-height: 1.2 !important;
          }

          .print-mode-thermal table {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Header Bar - Hidden on Print */}
      <header className="no-print border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-red-500" /> Private Invoice Generator
              </h1>
              <p className="text-xs text-zinc-400">Generate A4, 80mm or 58mm Receipt format invoices instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher */}
            <div className="bg-black p-1 rounded-lg border border-zinc-800 flex items-center gap-1">
              <Button 
                size="sm" 
                variant={printMode === "a4" ? "default" : "ghost"}
                onClick={() => setPrintMode("a4")}
                className={printMode === "a4" ? "bg-red-600 text-white font-bold" : "text-zinc-400"}
              >
                <FileText className="w-4 h-4 mr-1" /> A4 Paper
              </Button>
              <Button 
                size="sm" 
                variant={printMode === "thermal80" ? "default" : "ghost"}
                onClick={() => setPrintMode("thermal80")}
                className={printMode === "thermal80" ? "bg-red-600 text-white font-bold" : "text-zinc-400"}
              >
                <Receipt className="w-4 h-4 mr-1" /> 80mm (3")
              </Button>
              <Button 
                size="sm" 
                variant={printMode === "thermal58" ? "default" : "ghost"}
                onClick={() => setPrintMode("thermal58")}
                className={printMode === "thermal58" ? "bg-red-600 text-white font-bold" : "text-zinc-400"}
              >
                <Smartphone className="w-4 h-4 mr-1" /> 58mm (2" 1k)
              </Button>
            </div>

            {/* Quick Share Buttons */}
            <Button onClick={handleSendWhatsApp} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 text-xs">
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </Button>
            <Button onClick={handleSendEmail} className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5 text-xs">
              <Mail className="w-4 h-4" /> Email
            </Button>
            <Button onClick={handlePrint} className="bg-zinc-100 text-black hover:bg-white font-bold gap-1.5 text-xs">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls (Hidden on Print) */}
        <div className="no-print lg:col-span-5 space-y-6">
          
          {/* Quick Action Banner */}
          <Card className="bg-gradient-to-r from-emerald-950/40 to-blue-950/40 border-emerald-800/40 text-white">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" /> Send Invoice to Client
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Send instant WhatsApp or Email receipt to your customer</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSendWhatsApp} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5 mr-1" /> WhatsApp
                </Button>
                <Button size="sm" onClick={handleSendEmail} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                  <Mail className="w-3.5 h-3.5 mr-1" /> Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company Settings */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-red-400">
                <Building2 className="w-4 h-4" /> Your Agency Details (Header Logo)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 font-medium">Your Agency Logo URL (Optional)</label>
                <Input 
                  placeholder="https://example.com/your-logo.png" 
                  value={companyLogo} 
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  className="bg-black border-zinc-800 h-9 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Company Name</label>
                  <Input 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Phone</label>
                  <Input 
                    value={companyPhone} 
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium">Address</label>
                <Input 
                  value={companyAddress} 
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  className="bg-black border-zinc-800 h-9 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Email</label>
                  <Input 
                    value={companyEmail} 
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium">GSTIN / Tax ID</label>
                  <Input 
                    value={companyGst} 
                    onChange={(e) => setCompanyGst(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details & Client Company Logo */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-red-400">
                <User className="w-4 h-4" /> Client / Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Customer / Client Name</label>
                  <Input 
                    placeholder="Client Name..." 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Customer Phone (WhatsApp)</label>
                  <Input 
                    placeholder="+91..." 
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-blue-400" /> Client Company Logo URL (Optional)
                </label>
                <Input 
                  placeholder="https://example.com/client-company-logo.png" 
                  value={clientCompanyLogo} 
                  onChange={(e) => setClientCompanyLogo(e.target.value)}
                  className="bg-black border-zinc-800 h-9 text-xs text-blue-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Customer Email</label>
                  <Input 
                    placeholder="email@client.com" 
                    value={customerEmail} 
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Invoice No.</label>
                  <Input 
                    value={invoiceNo} 
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="bg-black border-zinc-800 h-9 text-xs font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium">Address</label>
                <Input 
                  placeholder="Customer address..." 
                  value={customerAddress} 
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="bg-black border-zinc-800 h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* UPI Payment & Payment Status */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-400">
                <Wallet className="w-4 h-4" /> Payment Details & UPI QR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Already Paid Amount (₹)</label>
                  <Input 
                    type="number"
                    placeholder="0" 
                    value={paidAmount} 
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="bg-black border-zinc-800 h-9 text-xs font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Payment Status</label>
                  <select 
                    value={paymentStatus} 
                    onChange={(e: any) => setPaymentStatus(e.target.value)}
                    className="bg-black border border-zinc-800 rounded px-2 h-9 w-full text-xs text-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PARTIAL">PARTIAL (Advance Received)</option>
                    <option value="PAID">FULLY PAID</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium">Your UPI ID (VPA)</label>
                <Input 
                  placeholder="e.g. 9876543210@ybl or kishore@upi" 
                  value={upiId} 
                  onChange={(e) => setUpiId(e.target.value)}
                  className="bg-black border-zinc-800 h-9 text-xs font-mono font-bold text-zinc-200"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-zinc-300 font-medium">Show UPI QR Code on Invoice</span>
                <input 
                  type="checkbox" 
                  checked={showQrCode} 
                  onChange={(e) => setShowQrCode(e.target.checked)}
                  className="h-4 w-4 rounded accent-red-600 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items Control */}
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-red-400">
                <Receipt className="w-4 h-4" /> Products / Services
              </CardTitle>
              <Button size="sm" onClick={addItem} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 bg-black/50 border border-zinc-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400">Item #{idx + 1}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <Input 
                    placeholder="Item description / service name" 
                    value={item.description} 
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="bg-zinc-900 border-zinc-800 h-8 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-500">Qty</label>
                      <Input 
                        type="number" 
                        min="1" 
                        value={item.qty} 
                        onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                        className="bg-zinc-900 border-zinc-800 h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500">Rate (₹)</label>
                      <Input 
                        type="number" 
                        min="0" 
                        value={item.rate} 
                        onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        className="bg-zinc-900 border-zinc-800 h-8 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs text-zinc-400 font-medium">GST Tax (%)</label>
                  <Input 
                    type="number" 
                    value={taxPercent} 
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="bg-black border-zinc-800 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium">Discount (%)</label>
                  <Input 
                    type="number" 
                    value={discountPercent} 
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="bg-black border-zinc-800 h-9 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Live Printable Preview */}
        <div className="lg:col-span-7">
          <div className="no-print mb-3 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-red-500" /> Live Preview ({printMode.toUpperCase()} Layout)</span>
            <span>Paper: {printMode === "a4" ? "Standard A4 Document" : printMode === "thermal80" ? "80mm Thermal Roll" : "58mm Mini Thermal Roll"}</span>
          </div>

          <div ref={printRef} className="printable-area bg-white text-black p-6 md:p-8 rounded-xl shadow-2xl overflow-hidden min-h-[600px] border border-zinc-200">
            
            {/* A4 INVOICE MODE */}
            {printMode === "a4" && (
              <div className="print-mode-a4 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-zinc-200 pb-6">
                  <div>
                    {companyLogo ? (
                      <img src={companyLogo} alt="Company Logo" className="h-14 object-contain mb-2" />
                    ) : (
                      <div className="text-2xl font-black text-black tracking-tight flex items-center gap-2">
                        <Sparkles className="w-7 h-7 text-red-600" /> {companyName}
                      </div>
                    )}
                    <p className="text-xs text-zinc-600 max-w-xs mt-1">{companyAddress}</p>
                    <p className="text-xs text-zinc-600 font-medium mt-1">Phone: {companyPhone} | Email: {companyEmail}</p>
                    {companyGst && <p className="text-xs font-mono text-zinc-500 mt-0.5">GSTIN: {companyGst}</p>}
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-black text-red-600 tracking-wider">INVOICE</h2>
                    <p className="text-sm font-bold font-mono text-zinc-800 mt-1">#{invoiceNo}</p>
                    <p className="text-xs text-zinc-500 mt-1">Date: {invoiceDate}</p>
                    <div className={`mt-2 inline-block px-3 py-1 font-bold text-xs rounded-full uppercase tracking-wider ${
                      paymentStatus === "PAID" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : paymentStatus === "PARTIAL" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      STATUS: {paymentStatus}
                    </div>
                  </div>
                </div>

                {/* Customer Details & Client Logo */}
                <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200 flex justify-between items-start text-xs">
                  <div>
                    <p className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Billed To:</p>
                    {clientCompanyLogo && (
                      <img src={clientCompanyLogo} alt="Client Logo" className="h-10 object-contain mt-1 mb-1 border border-zinc-200 rounded p-1 bg-white" />
                    )}
                    <p className="font-bold text-sm text-black mt-0.5">{customerName || "Customer Name"}</p>
                    <p className="text-zinc-600 mt-0.5">{customerPhone}</p>
                    <p className="text-zinc-600">{customerEmail}</p>
                    <p className="text-zinc-600 mt-1">{customerAddress}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Payment Details:</p>
                    <p className="font-semibold text-zinc-700">UPI ID: <span className="font-mono font-bold text-black">{upiId}</span></p>
                    <p className="text-zinc-500">Currency: INR (₹)</p>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-zinc-900 text-white font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 rounded-l">#</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Rate</th>
                      <th className="py-3 px-4 text-right rounded-r">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 text-zinc-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-black">{item.description || "Service Item"}</td>
                        <td className="py-3 px-4 text-center text-zinc-700">{item.qty}</td>
                        <td className="py-3 px-4 text-right text-zinc-700">₹{item.rate.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold text-black">₹{(item.qty * item.rate).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals & UPI QR Code Section */}
                <div className="flex justify-between items-end pt-4 border-t border-zinc-200">
                  {/* UPI QR Code Block */}
                  {showQrCode && upiId ? (
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-4">
                      <img src={qrCodeUrl} alt="UPI QR Code" className="w-24 h-24 object-contain border border-zinc-300 rounded bg-white p-1" />
                      <div className="space-y-1 text-xs">
                        <p className="font-black text-black text-xs flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5 text-emerald-600" /> SCAN TO PAY BALANCE
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">GPay • PhonePe • Paytm • BHIM</p>
                        <p className="font-bold font-mono text-zinc-800 text-[11px] pt-1">{upiId}</p>
                        <p className="text-[10px] font-bold text-red-600">Payable Amount: ₹{payableQrAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  ) : <div />}

                  {/* Totals Column */}
                  <div className="w-64 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-black">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount ({discountPercent}%):</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {taxAmount > 0 && (
                      <div className="flex justify-between text-zinc-600">
                        <span>GST Tax ({taxPercent}%):</span>
                        <span>+₹{taxAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-zinc-200">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal.toLocaleString()}</span>
                    </div>
                    {paidAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Amount Paid / Advance:</span>
                        <span>-₹{paidAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black text-black pt-2 border-t-2 border-black">
                      <span>Balance Due:</span>
                      <span className={balanceDue > 0 ? "text-red-600 font-black" : "text-emerald-600 font-black"}>
                        ₹{balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer / Terms */}
                <div className="pt-6 border-t border-zinc-200 text-[11px] text-zinc-500 space-y-1">
                  <p className="font-bold text-black">Terms & Conditions:</p>
                  <p>{notes}</p>
                  <p className="pt-4 text-center text-[10px] text-zinc-400 font-mono">Computer Generated Invoice • Authorized Signatory Not Required</p>
                </div>
              </div>
            )}

            {/* THERMAL 80mm & 58mm RECEIPT MODE */}
            {(printMode === "thermal80" || printMode === "thermal58") && (
              <div className={`print-mode-thermal mx-auto font-mono text-black space-y-2 ${
                printMode === "thermal58" ? "max-w-[220px] text-[10px]" : "max-w-[320px] text-xs"
              }`}>
                {/* Header */}
                <div className="text-center space-y-1">
                  {companyLogo && <img src={companyLogo} alt="Logo" className="h-8 mx-auto object-contain mb-1" />}
                  <h2 className={`font-black uppercase tracking-wider ${printMode === "thermal58" ? "text-sm" : "text-base"}`}>{companyName}</h2>
                  <p className="text-[9px]">{companyAddress}</p>
                  <p className="text-[9px]">Ph: {companyPhone}</p>
                  {companyGst && <p className="text-[9px]">GST: {companyGst}</p>}
                </div>

                <div className="border-b border-dashed border-black my-1.5"></div>

                {/* Receipt Info & Client Logo */}
                <div className="space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="font-bold">{invoiceNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{invoiceDate}</span>
                  </div>
                  {clientCompanyLogo && (
                    <div className="py-1 text-center">
                      <img src={clientCompanyLogo} alt="Client Logo" className="h-6 mx-auto object-contain" />
                    </div>
                  )}
                  {customerName && (
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span className="font-bold">{customerName}</span>
                    </div>
                  )}
                  {customerPhone && (
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{customerPhone}</span>
                    </div>
                  )}
                </div>

                <div className="border-b border-dashed border-black my-1.5"></div>

                {/* Items */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span>Item</span>
                    <span>Total</span>
                  </div>
                  {items.map((item, idx) => (
                    <div key={idx} className="text-[10px]">
                      <div className="font-bold">{item.description || "Service"}</div>
                      <div className="flex justify-between text-[9px] text-zinc-700">
                        <span>{item.qty}x₹{item.rate}</span>
                        <span className="font-bold text-black">₹{(item.qty * item.rate).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-b border-dashed border-black my-1.5"></div>

                {/* Totals */}
                <div className="space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount ({discountPercent}%):</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>GST ({taxPercent}%):</span>
                      <span>+₹{taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-1 border-t border-black">
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                  {paidAmount > 0 && (
                    <div className="flex justify-between font-bold">
                      <span>Amount Paid:</span>
                      <span>-₹{paidAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-black pt-1 border-t-2 border-black">
                    <span>BALANCE DUE:</span>
                    <span>₹{balanceDue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Thermal UPI QR Code Block */}
                {showQrCode && upiId && (
                  <div className="pt-1.5 text-center space-y-1">
                    <div className="border-b border-dashed border-black mb-1.5"></div>
                    <p className="text-[9px] font-bold uppercase">Scan & Pay via UPI</p>
                    <img src={qrCodeUrl} alt="UPI QR" className={`mx-auto object-contain p-1 border border-black bg-white ${
                      printMode === "thermal58" ? "w-20 h-20" : "w-28 h-28"
                    }`} />
                    <p className="text-[9px] font-bold font-mono">{upiId}</p>
                    <p className="text-[9px] font-bold">Payable: ₹{payableQrAmount.toLocaleString()}</p>
                  </div>
                )}

                <div className="border-b border-dashed border-black my-1.5"></div>

                {/* Footer */}
                <div className="text-center text-[9px] space-y-0.5 pt-0.5">
                  <p className="font-bold">THANK YOU FOR YOUR BUSINESS!</p>
                  <p>Visit Again</p>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}
