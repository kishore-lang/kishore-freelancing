import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Share2, 
  Copy, 
  Calendar, 
  Clock, 
  CreditCard, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  MessageSquare,
  FileText,
  Loader2,
  AlertCircle,
  Layers,
  Lock,
  ExternalLink
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface ServiceItem {
  id?: string | number;
  service_name?: string;
  title?: string;
  description?: string;
  price?: string | number;
  image_url?: string;
}

interface ProposalData {
  id?: number | string;
  slug: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  project_title: string;
  summary?: string;
  services: ServiceItem[];
  deliverables: string[];
  milestones: { title: string; timeline: string; description: string }[];
  total_amount: number;
  deposit_percentage: number;
  deposit_amount: number;
  currency: string;
  status: "draft" | "sent" | "accepted" | "deposit_paid";
  created_at: string;
}

// Fallback sample proposal if testing with an unsaved demo slug
const SAMPLE_DEMO_PROPOSAL: ProposalData = {
  slug: "demo-client",
  client_name: "Acme Innovations Ltd",
  client_email: "contact@acme.com",
  client_phone: "+91 9876543210",
  project_title: "Next.js SaaS Web Platform & Mobile MVP",
  summary: "Comprehensive design, architecture, and production delivery of an enterprise-grade SaaS web portal with real-time analytics, automated billing, and secure client role-based authentication.",
  services: [
    {
      title: "Full-Stack Web Application Development",
      description: "Modern responsive web platform with Next.js, TypeScript, PostgreSQL database, and Tailwind CSS.",
      price: 35000,
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Cloud REST API & Real-time Integrations",
      description: "High-throughput cloud backend with Redis caching, Razorpay billing webhooks, and Google Sheets real-time CRM sync.",
      price: 15000,
      image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
    }
  ],
  deliverables: [
    "Pixel-perfect responsive web application optimized for desktop and mobile",
    "Production PostgreSQL database with automated backups & SSL encryption",
    "Secure OTP / Passwordless authentication & role-based access control (RBAC)",
    "Razorpay / Stripe automated billing workflow with instant GST invoices",
    "Real-time Google Sheets lead synchronization & transactional email notifications",
    "95+ Google Lighthouse speed score, SEO meta optimization & security audit",
    "30 days of comprehensive post-launch warranty, bug fixes & tech support"
  ],
  milestones: [
    {
      title: "Phase 1: Architecture & UI/UX Wireframes",
      timeline: "Days 1 – 6",
      description: "Interactive prototype approval, database schema modeling & API contract sign-off."
    },
    {
      title: "Phase 2: Full-Stack Engineering & Core Modules",
      timeline: "Days 7 – 15",
      description: "Frontend components, cloud backend, payment integration, and database persistence."
    },
    {
      title: "Phase 3: Security QA, Staging Demo & Final Deployment",
      timeline: "Days 16 – 21",
      description: "End-to-end integration testing, custom domain SSL setup, and public production launch."
    }
  ],
  total_amount: 50000,
  deposit_percentage: 50,
  deposit_amount: 25000,
  currency: "INR",
  status: "sent",
  created_at: new Date().toISOString()
};

export default function Proposal() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, [slug]);

  const fetchProposal = async () => {
    setIsLoading(true);
    try {
      // 1. Try backend API
      const res = await fetch(`${API_BASE_URL}/api/proposals/${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.proposal) {
          const raw = data.proposal;
          setProposal({
            ...raw,
            services: typeof raw.services === "string" ? JSON.parse(raw.services) : (raw.services || []),
            deliverables: typeof raw.deliverables === "string" ? JSON.parse(raw.deliverables) : (raw.deliverables || []),
            milestones: typeof raw.milestones === "string" ? JSON.parse(raw.milestones) : (raw.milestones || []),
            total_amount: Number(raw.total_amount) || 0,
            deposit_amount: Number(raw.deposit_amount) || 0,
            deposit_percentage: Number(raw.deposit_percentage) || 50,
          });
          setIsLoading(false);
          return;
        }
      }

      // 2. Try localStorage fallback
      const savedProposals = localStorage.getItem("kfreelance_proposals");
      if (savedProposals) {
        const list: ProposalData[] = JSON.parse(savedProposals);
        const match = list.find((p) => p.slug === slug);
        if (match) {
          setProposal(match);
          setIsLoading(false);
          return;
        }
      }

      // 3. Fallback demo data
      setProposal({ ...SAMPLE_DEMO_PROPOSAL, slug: slug || "demo" });
    } catch (err) {
      console.warn("Could not fetch proposal from server, falling back to demo view:", err);
      setProposal({ ...SAMPLE_DEMO_PROPOSAL, slug: slug || "demo" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast({
      title: "Proposal Link Copied! 📋",
      description: "Direct link has been copied to your clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!proposal) return;
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(15, 15, 20);
      doc.rect(0, 0, 210, 45, "F");

      doc.setTextColor(239, 68, 68); // Red
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("K FREELANCE", 14, 20);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Enterprise Full-Stack Engineering & Cloud Architecture", 14, 28);
      doc.text("Email: kfreelance@kfreelance.online  |  Web: kfreelance.online", 14, 34);

      // Proposal Title & Client
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`PROJECT PROPOSAL: ${proposal.project_title}`, 14, 58);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Prepared Exclusively For: ${proposal.client_name}`, 14, 66);
      doc.text(`Date: ${new Date(proposal.created_at).toLocaleDateString("en-IN")}  |  Status: ${proposal.status.toUpperCase()}`, 14, 72);

      // Summary
      if (proposal.summary) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        const splitSummary = doc.splitTextToSize(proposal.summary, 180);
        doc.text(splitSummary, 14, 82);
      }

      // Services Table
      const servicesRows = proposal.services.map((s, idx) => [
        `0${idx + 1}`,
        s.service_name || s.title || "Service",
        s.description || "-",
        s.price ? `INR ${Number(s.price).toLocaleString("en-IN")}` : "Custom Scope",
      ]);

      autoTable(doc, {
        startY: proposal.summary ? 98 : 84,
        head: [["#", "Scope & Service Item", "Details", "Amount"]],
        body: servicesRows,
        theme: "striped",
        headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 9 },
      });

      // Deliverables
      const finalY = (doc as any).lastAutoTable.finalY + 12;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Key Deliverables & Technical Architecture:", 14, finalY);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      proposal.deliverables.forEach((item, i) => {
        doc.text(`[OK]  ${item}`, 16, finalY + 8 + i * 6);
      });

      // Financials Summary
      const financialsY = finalY + 14 + proposal.deliverables.length * 6;
      doc.setFillColor(245, 245, 245);
      doc.rect(14, financialsY, 182, 32, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("INVESTMENT SUMMARY", 20, financialsY + 8);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Project Investment: INR ${proposal.total_amount.toLocaleString("en-IN")}`, 20, financialsY + 16);
      doc.text(`Advance Deposit (${proposal.deposit_percentage}%): INR ${proposal.deposit_amount.toLocaleString("en-IN")}`, 20, financialsY + 22);
      doc.text(`Remaining Balance on Launch: INR ${(proposal.total_amount - proposal.deposit_amount).toLocaleString("en-IN")}`, 20, financialsY + 28);

      doc.save(`Proposal_${proposal.client_name.replace(/\s+/g, "_")}.pdf`);
      toast({
        title: "Proposal PDF Exported! 📄",
        description: "Official PDF downloaded successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "PDF Export Error",
        description: err.message,
      });
    }
  };

  const handlePayDeposit = async () => {
    if (!proposal) return;
    setIsPaying(true);

    try {
      // 1. Request deposit order from server
      const res = await fetch(`${API_BASE_URL}/api/proposals/${proposal.slug}/deposit-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok || !data.order) {
        throw new Error(data.message || "Failed to initiate advance payment");
      }

      const orderData = data.order;
      const keyId = data.keyId;

      // 2. Open Razorpay Checkout modal
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "Kishore Freelancing",
        description: `Advance Deposit (50%) for ${proposal.project_title}`,
        order_id: orderData.id,
        prefill: {
          name: proposal.client_name,
          email: proposal.client_email || "client@company.com",
          contact: proposal.client_phone?.replace(/\D/g, "") || "9876543210",
        },
        theme: { color: "#dc2626" },
        handler: async function (response: any) {
          try {
            // Verify with server
            const verifyRes = await fetch(`${API_BASE_URL}/api/proposals/${proposal.slug}/verify-deposit`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              setProposal((prev) => (prev ? { ...prev, status: "deposit_paid" } : prev));
              toast({
                title: "Deposit Authorized! 🎉",
                description: "Advance deposit confirmed. The sprint kickoff is officially authorized!",
              });
            } else {
              throw new Error(verifyData.message);
            }
          } catch (vErr: any) {
            toast({
              variant: "destructive",
              title: "Verification Notice",
              description: vErr.message || "Payment processed. Status will refresh shortly.",
            });
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast({
          variant: "destructive",
          title: "Payment Unsuccessful",
          description: response.error?.description || "Payment was not completed.",
        });
      });
      razorpay.open();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Could not open checkout",
        description: err.message,
      });
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
        <div>
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold">Proposal Not Found</h2>
          <p className="text-gray-400 text-sm mt-1 mb-4">The proposal link might have expired or is invalid.</p>
          <Link to="/" className="text-red-500 underline text-sm font-bold">Return Home</Link>
        </div>
      </div>
    );
  }

  const isPaid = proposal.status === "deposit_paid";
  const remainingAmount = proposal.total_amount - proposal.deposit_amount;
  const whatsappPitchUrl = `https://wa.me/917904001962?text=${encodeURIComponent(
    `Hi Kishore, I am reviewing the proposal for "${proposal.project_title}" (${window.location.href}). Let's discuss!`
  )}`;

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-red-600 selection:text-white pb-24">
      <ParticlesBackground />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 relative z-10">
        {/* Top Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-10 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-3xl rounded-full pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Tailored Client Proposal
              </div>
              <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">PREPARED EXCLUSIVELY FOR</p>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {proposal.client_name}
              </h1>
            </div>

            {/* Status & Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${
                isPaid 
                  ? "bg-green-500/20 text-green-400 border-green-500/40" 
                  : "bg-amber-500/20 text-amber-400 border-amber-500/40"
              }`}>
                {isPaid ? "✓ Authorized & Deposit Paid" : "● Active Proposal"}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="h-9 rounded-none border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold"
              >
                {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {isCopied ? "Link Copied" : "Share Link"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                className="h-9 rounded-none border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-bold"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Export PDF
              </Button>
            </div>
          </div>

          {/* Project Title & Meta */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {proposal.project_title}
            </h2>
            {proposal.summary && (
              <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed max-w-4xl">
                {proposal.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" />
                Date: {new Date(proposal.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Engineering: Kishore Freelance Architecture
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                Quote Validity: 14 Business Days
              </span>
            </div>
          </div>
        </motion.div>

        {/* Deposit Paid Banner */}
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 bg-gradient-to-r from-green-950/70 to-zinc-950 border border-green-500/50 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 border border-green-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Project Officially Authorized!</h4>
                <p className="text-xs text-green-300 font-medium mt-0.5">
                  The advance deposit of ₹{proposal.deposit_amount.toLocaleString("en-IN")} has been received. Sprint kickoff preparations are underway.
                </p>
              </div>
            </div>
            <a
              href={whatsappPitchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message on WhatsApp
            </a>
          </motion.div>
        )}

        {/* Scope of Work / Selected Services Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" /> Scope of Work & Selected Packages
            </h3>
            <span className="text-xs text-zinc-500 font-bold">{proposal.services.length} Core Modules Included</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposal.services.map((service, index) => (
              <div
                key={index}
                className="bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  {service.image_url && (
                    <div className="h-32 w-full mb-4 overflow-hidden border border-zinc-800 relative">
                      <img 
                        src={service.image_url} 
                        alt={service.service_name || service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/service_web.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                    </div>
                  )}

                  <h4 className="text-base font-black text-white">
                    {service.service_name || service.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed mt-1.5">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500 uppercase font-bold">Package Investment</span>
                  <span className="text-sm font-black text-white">
                    {service.price && Number(service.price) > 0
                      ? `₹${Number(service.price).toLocaleString("en-IN")}`
                      : "Included in Scope"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div className="mb-10 bg-zinc-950/70 border border-zinc-800 p-6 sm:p-8">
          <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" /> Guaranteed Technical Deliverables
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {proposal.deliverables.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5 border border-green-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-zinc-200 font-medium leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Roadmap */}
        {proposal.milestones && proposal.milestones.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Implementation Roadmap & Milestones
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proposal.milestones.map((m, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800 p-5 relative">
                  <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">
                    {m.timeline}
                  </div>
                  <h4 className="text-sm font-black text-white mb-2">{m.title}</h4>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financials & Authorization Box */}
        <div className="bg-zinc-950 border-2 border-red-600/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-zinc-800 pb-8">
            {/* Total */}
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Project Investment</p>
              <p className="text-3xl font-black text-white">₹{proposal.total_amount.toLocaleString("en-IN")}</p>
              <p className="text-[11px] text-zinc-400 font-medium">All deliverables & 30-day warranty included</p>
            </div>

            {/* Advance Deposit */}
            <div className="space-y-1 md:border-l md:border-r border-zinc-800 md:px-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-red-500 uppercase font-bold tracking-wider">Advance Deposit ({proposal.deposit_percentage}%)</p>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-600/20 text-red-400 border border-red-500/30">Due to Kick Off</span>
              </div>
              <p className="text-3xl font-black text-red-500">₹{proposal.deposit_amount.toLocaleString("en-IN")}</p>
              <p className="text-[11px] text-zinc-400 font-medium">Locks sprint schedule & begins wireframing</p>
            </div>

            {/* Remaining */}
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Final Milestone (On Delivery)</p>
              <p className="text-3xl font-black text-zinc-300">₹{remainingAmount.toLocaleString("en-IN")}</p>
              <p className="text-[11px] text-zinc-400 font-medium">Payable upon staging demo & deployment approval</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span>Payments secured by 256-bit encrypted Razorpay / UPI / Card gateway.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={whatsappPitchUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-green-400" /> Chat on WhatsApp
              </a>

              {!isPaid && (
                <Button
                  onClick={handlePayDeposit}
                  disabled={isPaying}
                  className="w-full sm:w-auto px-8 h-12 bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-wide rounded-none shadow-xl shadow-red-600/30 transition-all"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Connecting Razorpay Gateway...
                    </>
                  ) : (
                    <>
                      Pay Deposit (₹{proposal.deposit_amount.toLocaleString("en-IN")}) & Authorize Project
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="text-center pt-8 text-xs text-zinc-500 font-medium">
          <p>
            © {new Date().getFullYear()} Kishore Freelance Engineering. High-Performance Web & Mobile Products.
          </p>
          <p className="mt-1">
            Questions regarding this proposal? Email <a href="mailto:kfreelance@kfreelance.online" className="text-zinc-400 hover:underline">kfreelance@kfreelance.online</a> or WhatsApp <a href={whatsappPitchUrl} className="text-zinc-400 hover:underline">+91 7904001962</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
