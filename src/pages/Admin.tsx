import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  IndianRupee, 
  ShoppingCart, 
  Users, 
  Loader2,
  CheckCircle2, 
  Clock, 
  Trash2,
  Search,
  Calendar,
  Download,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  FileText,
  LayoutDashboard,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  BookOpen,
  Image as ImageIcon,
  UploadCloud,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Sparkles,
  Eye,
  X,
  Layers,
  Check,
  Plus,
  Send,
  Briefcase,
  Building2
} from "lucide-react";
import { ClerkProvider, SignIn, UserButton, useAuth } from "@clerk/react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AdminDashboardWrapper() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 text-center">
        Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables.<br />
        Please add it and reload.
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AdminDashboard />
    </ClerkProvider>
  );
}

const IMAGE_PRESETS = [
  { label: "🌐 Web App", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
  { label: "📱 Mobile App", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" },
  { label: "🎨 UI/UX Design", url: "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80" },
  { label: "☁️ Cloud / API", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
  { label: "🤖 AI & Agents", url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80" },
  { label: "🎬 Film / Gear", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "proposals" | "users">("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ 
    service_name: '', 
    description: '', 
    price: '', 
    icon: 'Sparkles',
    image_url: '' 
  });
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [copiedServiceId, setCopiedServiceId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Proposals Management State
  const [proposalsList, setProposalsList] = useState<any[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [copiedProposalSlug, setCopiedProposalSlug] = useState<string | null>(null);

  // Proposal Creation Form State
  const [proposalForm, setProposalForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    project_title: "",
    summary: "",
    selectedServiceIds: [] as string[],
    deliverables: [
      "Custom responsive web application optimized for desktop & mobile",
      "Production PostgreSQL database schema & cloud backend",
      "Secure user authentication & role-based dashboard",
      "Automated Razorpay billing & GST invoicing workflow",
      "SEO meta-data, analytics & 30-day post-launch warranty"
    ],
    customDeliverable: "",
    total_amount: 45000,
    deposit_percentage: 50,
  });

  // Users Management State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  const { toast } = useToast();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      verifyAndLoadData();
      fetchUsers();
      fetchProposals();
    }
  }, [isLoaded, isSignedIn]);

  const verifyAndLoadData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No authentication token found");

      // 1. Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (!statsRes.ok) {
        throw new Error(statsData.message || "Authentication failed");
      }
      setStats(statsData.stats);
      
      // 2. Fetch Orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      if (ordersRes.ok && ordersData.orders) {
        setOrders(ordersData.orders);
      }

      // 3. Fetch Services
      const servicesRes = await fetch(`${API_BASE_URL}/api/services`);
      const servicesData = await servicesRes.json();
      if (servicesRes.ok && servicesData.services) {
        setServices(servicesData.services);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading dashboard",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Users with Search & Date Filters
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const token = await getToken();
      if (!token) return;

      const params = new URLSearchParams();
      if (userSearch.trim()) params.append("search", userSearch.trim());
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`${API_BASE_URL}/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.users) {
        setUsersList(data.users);
      } else {
        throw new Error(data.message || "Failed to load users");
      }
    } catch (error: any) {
      console.error("fetchUsers error:", error);
      toast({
        variant: "destructive",
        title: "Could not fetch users",
        description: error.message,
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Toggle Block / Unblock User
  const handleToggleBlock = async (userId: string, currentStatus: boolean, userName: string) => {
    const actionText = currentStatus ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${actionText} user '${userName}'?`)) {
      return;
    }

    setBlockingUserId(userId);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${encodeURIComponent(userId)}/toggle-block`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Status Updated",
          description: data.message || `User status changed successfully.`,
        });
        // Update state locally
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: !currentStatus } : u));
      } else {
        throw new Error(data.message || "Failed to update block status");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Block/Unblock Failed",
        description: error.message,
      });
    } finally {
      setBlockingUserId(null);
    }
  };

  // Export Users to CSV
  const handleExportCsv = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/users/csv`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error("Failed to export users CSV");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kfreelance_users_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "CSV Exported! 📥",
        description: "User records downloaded successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Export Error",
        description: err.message,
      });
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ 
        variant: "destructive", 
        title: "Invalid File Format", 
        description: "Please upload an image file (PNG, JPG, WEBP, or SVG)." 
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        variant: "destructive", 
        title: "File Too Large", 
        description: "Please select an image smaller than 5MB." 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_W = 1000;
        const MAX_H = 700;

        if (width > height && width > MAX_W) {
          height = Math.round((height * MAX_W) / width);
          width = MAX_W;
        } else if (height > MAX_H) {
          width = Math.round((width * MAX_H) / height);
          height = MAX_H;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setNewProduct(prev => ({ ...prev, image_url: compressed }));
        } else {
          setNewProduct(prev => ({ ...prev, image_url: rawUrl }));
        }
        toast({ title: "Image Attached! 📸", description: "Image attached and ready to save." });
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleCopyBookingLink = (serviceKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/booking?serviceId=${serviceKey}`;
    navigator.clipboard.writeText(url);
    setCopiedServiceId(serviceKey);
    toast({
      title: "Booking Link Copied! 📋",
      description: `Client direct link: ${url}`,
    });
    setTimeout(() => setCopiedServiceId(null), 2500);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingProduct(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast({ title: "Success", description: "Service added successfully" });
        setNewProduct({ service_name: '', description: '', price: '', icon: 'Sparkles', image_url: '' });
        verifyAndLoadData();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed to add service", description: error.message });
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok) {
        toast({ title: "Deleted", description: data.message });
        verifyAndLoadData();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: error.message });
    }
  };

  const fetchProposals = async () => {
    setIsLoadingProposals(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/api/admin/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.proposals) {
          setProposalsList(data.proposals);
          localStorage.setItem("kfreelance_proposals", JSON.stringify(data.proposals));
          return;
        }
      }
      const saved = localStorage.getItem("kfreelance_proposals");
      if (saved) setProposalsList(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not fetch proposals, using local cache:", e);
      const saved = localStorage.getItem("kfreelance_proposals");
      if (saved) setProposalsList(JSON.parse(saved));
    } finally {
      setIsLoadingProposals(false);
    }
  };

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.client_name.trim() || !proposalForm.project_title.trim()) {
      toast({ 
        variant: "destructive", 
        title: "Missing Required Fields", 
        description: "Please enter client name and project title." 
      });
      return;
    }

    setIsGeneratingProposal(true);
    try {
      const token = await getToken();
      const chosenServices = (services || []).filter(s => 
        proposalForm.selectedServiceIds.includes(s.service_key || String(s.id))
      );

      const calculatedDeposit = Math.round((Number(proposalForm.total_amount) * Number(proposalForm.deposit_percentage)) / 100);

      const payload = {
        client_name: proposalForm.client_name.trim(),
        client_email: proposalForm.client_email.trim() || null,
        client_phone: proposalForm.client_phone.trim() || null,
        project_title: proposalForm.project_title.trim(),
        summary: proposalForm.summary.trim() || `Tailored engineering and delivery proposal for ${proposalForm.client_name}.`,
        services: chosenServices.length > 0 ? chosenServices : [
          { service_name: proposalForm.project_title, description: "Full-stack application architecture and deployment", price: proposalForm.total_amount }
        ],
        deliverables: proposalForm.deliverables,
        milestones: [
          { title: "Phase 1: Architecture & UI/UX Wireframes", timeline: "Days 1–5", description: "Interactive prototype sign-off and database schema modeling." },
          { title: "Phase 2: Core Engineering & Integrations", timeline: "Days 6–14", description: "Frontend components, cloud backend, payment flow and testing." },
          { title: "Phase 3: Staging Demo & Production Launch", timeline: "Days 15–20", description: "QA testing, DNS/SSL rollout, and 30-day warranty activation." }
        ],
        total_amount: Number(proposalForm.total_amount),
        deposit_percentage: Number(proposalForm.deposit_percentage),
        deposit_amount: calculatedDeposit,
      };

      let newProposalResult: any = null;
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/proposals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          newProposalResult = data.proposal;
        }
      } catch (postErr) {
        console.warn("Backend proposal POST failed, storing locally:", postErr);
      }

      if (!newProposalResult) {
        const baseSlug = proposalForm.client_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        newProposalResult = {
          id: Date.now(),
          slug: `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`,
          ...payload,
          status: "sent",
          created_at: new Date().toISOString()
        };
      }

      const updatedList = [newProposalResult, ...proposalsList];
      setProposalsList(updatedList);
      localStorage.setItem("kfreelance_proposals", JSON.stringify(updatedList));

      toast({
        title: "Proposal Generated! 🚀",
        description: `Branded proposal created: /proposal/${newProposalResult.slug}`
      });

      setProposalForm(prev => ({
        ...prev,
        client_name: "",
        client_email: "",
        client_phone: "",
        project_title: "",
        summary: "",
        selectedServiceIds: [],
        total_amount: 45000,
      }));
    } catch (err: any) {
      toast({ variant: "destructive", title: "Could not create proposal", description: err.message });
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handleDeleteProposal = async (id: number | string, slug: string) => {
    if (!confirm("Are you sure you want to delete this proposal?")) return;
    try {
      const token = await getToken();
      try {
        await fetch(`${API_BASE_URL}/api/admin/proposals/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (_) {}

      const filtered = proposalsList.filter(p => p.id !== id && p.slug !== slug);
      setProposalsList(filtered);
      localStorage.setItem("kfreelance_proposals", JSON.stringify(filtered));
      toast({ title: "Proposal Deleted", description: "The proposal has been removed." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: err.message });
    }
  };

  const handleCopyProposalLink = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/proposal/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedProposalSlug(slug);
    toast({
      title: "Proposal Link Copied! 📋",
      description: `Client direct link: ${url}`,
    });
    setTimeout(() => setCopiedProposalSlug(null), 2500);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-black mb-8 tracking-tight">Kishore Admin Dashboard</h1>
        <SignIn routing="hash" forceRedirectUrl="/admin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Navigation Pills */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-sm">
                Super Admin
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Admin <span className="text-red-600">Console</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm mt-1">Manage orders, services, student profiles & invoices</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tab navigation pills */}
            <div className="flex bg-gray-900 p-1 border border-gray-800 rounded-none">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-xs font-bold rounded-none flex items-center gap-2 transition-all ${
                  activeTab === "overview" 
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Overview
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("proposals")}
                className={`px-4 py-2 text-xs font-bold rounded-none flex items-center gap-2 transition-all ${
                  activeTab === "proposals" 
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" /> Proposals & Deals
                {proposalsList.length > 0 && (
                  <span className="bg-gray-800 text-gray-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {proposalsList.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 text-xs font-bold rounded-none flex items-center gap-2 transition-all ${
                  activeTab === "users" 
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" /> Users / Students
                {usersList.length > 0 && (
                  <span className="bg-gray-800 text-gray-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {usersList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Quick link to Invoice Generator */}
            <Link to="/admin/invoice">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-xs font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-500" /> Invoices
              </Button>
            </Link>

            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* ======================= TAB: USERS MANAGEMENT ======================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-600" /> Registered Students & Users
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Users registered via Supabase mobile OTP and linked profiles table.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={fetchUsers}
                  variant="outline"
                  size="sm"
                  disabled={isLoadingUsers}
                  className="border-gray-800 bg-gray-900 hover:bg-gray-800 text-xs font-bold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoadingUsers ? "animate-spin" : ""}`} /> Refresh
                </Button>

                <Button
                  onClick={handleExportCsv}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-green-600/20"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </Button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <Card className="bg-gray-900 border-gray-800 rounded-none">
              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    <Input
                      placeholder="Search by Name or Mobile..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") fetchUsers();
                      }}
                      className="pl-9 bg-gray-950 border-gray-800 text-sm h-10 rounded-none focus:border-red-600"
                    />
                  </div>

                  {/* Date Filter: From */}
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-9 bg-gray-950 border-gray-800 text-sm h-10 rounded-none focus:border-red-600 text-gray-300"
                    />
                  </div>

                  {/* Date Filter: To */}
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-9 bg-gray-950 border-gray-800 text-sm h-10 rounded-none focus:border-red-600 text-gray-300"
                    />
                  </div>

                  {/* Apply & Reset Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={fetchUsers} 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold h-10 text-xs rounded-none"
                    >
                      <Filter className="w-3.5 h-3.5 mr-1" /> Apply
                    </Button>
                    {(userSearch || startDate || endDate) && (
                      <Button
                        onClick={() => {
                          setUserSearch("");
                          setStartDate("");
                          setEndDate("");
                          setTimeout(fetchUsers, 50);
                        }}
                        variant="ghost"
                        className="text-gray-400 hover:text-white text-xs h-10 px-2.5 rounded-none"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="bg-gray-900 border-gray-800 rounded-none overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-4 font-bold">User / Student</th>
                        <th className="py-3 px-4 font-bold">Mobile</th>
                        <th className="py-3 px-4 font-bold">Email</th>
                        <th className="py-3 px-4 font-bold">Course / Service</th>
                        <th className="py-3 px-4 font-bold">Registered Date</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                      {isLoadingUsers ? (
                        <tr>
                          <td colSpan={7} className="py-16 text-center text-gray-400">
                            <Loader2 className="w-6 h-6 animate-spin text-red-600 mx-auto mb-2" />
                            Loading users list...
                          </td>
                        </tr>
                      ) : usersList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-16 text-center text-gray-500">
                            <Users className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                            No users matched your query.
                          </td>
                        </tr>
                      ) : (
                        usersList.map((user) => {
                          const isBlocked = !!user.is_blocked;
                          const isCurrentlyProcessing = blockingUserId === user.id;

                          return (
                            <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                              {/* Full Name */}
                              <td className="py-3.5 px-4 font-bold text-white">
                                {user.full_name || "N/A"}
                              </td>

                              {/* Mobile Phone */}
                              <td className="py-3.5 px-4 font-mono text-zinc-300 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>{user.phone || "—"}</span>
                                </div>
                              </td>

                              {/* Email */}
                              <td className="py-3.5 px-4 text-gray-400 text-xs">
                                {user.email ? (
                                  <div className="flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                                    <span>{user.email}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-600">—</span>
                                )}
                              </td>

                              {/* Course */}
                              <td className="py-3.5 px-4 text-xs font-medium text-gray-300">
                                <div className="flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-red-500/80" />
                                  <span>{user.course || "General"}</span>
                                </div>
                              </td>

                              {/* Registered Date */}
                              <td className="py-3.5 px-4 text-xs text-gray-400 font-mono">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "—"}
                              </td>

                              {/* Status Badge */}
                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-full ${
                                  isBlocked 
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                                }`}>
                                  {isBlocked ? (
                                    <>
                                      <ShieldAlert className="w-3 h-3 mr-1" /> Blocked
                                    </>
                                  ) : (
                                    <>
                                      <ShieldCheck className="w-3 h-3 mr-1" /> Active
                                    </>
                                  )}
                                </span>
                              </td>

                              {/* Block / Unblock Action Button */}
                              <td className="py-3.5 px-4 text-right">
                                <Button
                                  size="sm"
                                  variant={isBlocked ? "outline" : "destructive"}
                                  disabled={isCurrentlyProcessing}
                                  onClick={() => handleToggleBlock(user.id, isBlocked, user.full_name)}
                                  className={`h-8 px-3 text-xs font-bold rounded-none ${
                                    isBlocked 
                                      ? "border-green-600 text-green-400 hover:bg-green-950/40" 
                                      : "bg-red-600/90 hover:bg-red-700"
                                  }`}
                                >
                                  {isCurrentlyProcessing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : isBlocked ? (
                                    <>
                                      <UserCheck className="w-3.5 h-3.5 mr-1" /> Unblock
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="w-3.5 h-3.5 mr-1" /> Block
                                    </>
                                  )}
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ======================= TAB: PROPOSALS & DEALS ======================= */}
        {activeTab === "proposals" && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm">
                    Live Deal Closer
                  </span>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-600" /> Automated 1-Click Client Proposal Generator
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Generate private branded proposals (<code className="text-red-400 font-mono">/proposal/:slug</code>) with customized scope, milestones roadmap, PDF export & embedded 50% Razorpay deposit checkout.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={fetchProposals}
                  disabled={isLoadingProposals}
                  className="border-gray-800 bg-gray-900 text-gray-300 hover:text-white text-xs h-8 rounded-none"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoadingProposals ? 'animate-spin text-red-500' : ''}`} />
                  Refresh Proposals
                </Button>
              </div>
            </div>

            {/* Form & Live Pitch Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Proposal Creator Form (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl">
                  <CardHeader className="border-b border-gray-800 pb-4">
                    <CardTitle className="text-lg font-black text-white flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-red-500" /> Client & Deal Specification
                      </span>
                      <span className="text-[11px] font-mono text-gray-400">Instant Branded Link</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleCreateProposal} className="space-y-6">
                      {/* Row 1: Client Name & Project Title */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-red-500" /> Client / Company Name *
                          </label>
                          <Input
                            required
                            value={proposalForm.client_name}
                            onChange={(e) => setProposalForm({ ...proposalForm, client_name: e.target.value })}
                            placeholder="e.g. Nexus FinTech Corp"
                            className="bg-gray-950 border-gray-800 text-sm rounded-none focus:border-red-600"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                            Project Title *
                          </label>
                          <Input
                            required
                            value={proposalForm.project_title}
                            onChange={(e) => setProposalForm({ ...proposalForm, project_title: e.target.value })}
                            placeholder="e.g. Next-Gen SaaS Platform MVP"
                            className="bg-gray-950 border-gray-800 text-sm rounded-none focus:border-red-600"
                          />
                        </div>
                      </div>

                      {/* Row 2: Client Email & Client Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-zinc-500" /> Client Email (Optional)
                          </label>
                          <Input
                            type="email"
                            value={proposalForm.client_email}
                            onChange={(e) => setProposalForm({ ...proposalForm, client_email: e.target.value })}
                            placeholder="founder@nexusfintech.io"
                            className="bg-gray-950 border-gray-800 text-sm rounded-none focus:border-red-600"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-green-500" /> Client WhatsApp / Phone
                          </label>
                          <Input
                            value={proposalForm.client_phone}
                            onChange={(e) => setProposalForm({ ...proposalForm, client_phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="bg-gray-950 border-gray-800 text-sm rounded-none focus:border-red-600"
                          />
                        </div>
                      </div>

                      {/* Quick Pitch Templates */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Pitch Template
                          </label>
                          <span className="text-[10px] text-gray-500">Click to autofill executive summary</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setProposalForm(prev => ({
                                ...prev,
                                project_title: prev.project_title || "Modern SaaS Platform MVP",
                                summary: "End-to-end full-stack SaaS platform featuring multi-tenant architecture, secure authentication, Stripe/Razorpay billing, and modern responsive dashboard.",
                                total_amount: 55000
                              }));
                              toast({ title: "Template Applied", description: "SaaS Platform MVP summary loaded." });
                            }}
                            className="text-left p-2.5 bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-red-500/40 transition-colors text-xs"
                          >
                            <p className="font-bold text-white">🚀 SaaS Platform</p>
                            <p className="text-[10px] text-gray-400 truncate">Multi-tenant, Auth & Billing</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setProposalForm(prev => ({
                                ...prev,
                                project_title: prev.project_title || "E-Commerce Growth Storefront",
                                summary: "High-performance bespoke e-commerce portal with rapid checkout, catalog management, payment gateway integration, and real-time inventory tracking.",
                                total_amount: 40000
                              }));
                              toast({ title: "Template Applied", description: "E-Commerce Growth summary loaded." });
                            }}
                            className="text-left p-2.5 bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-red-500/40 transition-colors text-xs"
                          >
                            <p className="font-bold text-white">🛒 E-Commerce</p>
                            <p className="text-[10px] text-gray-400 truncate">Fast checkout & Inventory</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setProposalForm(prev => ({
                                ...prev,
                                project_title: prev.project_title || "Enterprise AI Automation Workflow",
                                summary: "Custom business automation platform integrating cutting-edge AI agents, automated workflow pipelines, and secure cloud storage.",
                                total_amount: 75000
                              }));
                              toast({ title: "Template Applied", description: "AI Automation summary loaded." });
                            }}
                            className="text-left p-2.5 bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-red-500/40 transition-colors text-xs"
                          >
                            <p className="font-bold text-white">🤖 AI Automation</p>
                            <p className="text-[10px] text-gray-400 truncate">LLM agents & cloud sync</p>
                          </button>
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                          Executive Summary / Scope Overview
                        </label>
                        <textarea
                          rows={3}
                          value={proposalForm.summary}
                          onChange={(e) => setProposalForm({ ...proposalForm, summary: e.target.value })}
                          placeholder="Outline the client's strategic goals and what high-impact value this deliverable will achieve..."
                          className="w-full bg-gray-950 border border-gray-800 text-sm p-3 rounded-none text-white focus:outline-none focus:border-red-600 resize-none font-sans"
                        />
                      </div>

                      {/* Bundle Catalog Services */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-red-500" /> Select Services to Bundle
                          </label>
                          <span className="text-[10px] text-gray-400">
                            {proposalForm.selectedServiceIds.length} selected (auto-sums investment)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                          {(services || []).map((srv) => {
                            const srvId = srv.service_key || String(srv.id);
                            const isSelected = proposalForm.selectedServiceIds.includes(srvId);
                            return (
                              <div
                                key={srv.id}
                                onClick={() => {
                                  const newSelected = isSelected
                                    ? proposalForm.selectedServiceIds.filter(id => id !== srvId)
                                    : [...proposalForm.selectedServiceIds, srvId];
                                  
                                  const chosen = (services || []).filter(s => 
                                    newSelected.includes(s.service_key || String(s.id))
                                  );
                                  const total = chosen.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
                                  
                                  setProposalForm(prev => ({
                                    ...prev,
                                    selectedServiceIds: newSelected,
                                    total_amount: total > 0 ? total : prev.total_amount
                                  }));
                                }}
                                className={`p-2.5 border cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
                                  isSelected 
                                    ? "bg-red-950/40 border-red-500/60 text-white" 
                                    : "bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                  <div className={`w-4 h-4 rounded-none border flex items-center justify-center shrink-0 ${
                                    isSelected ? "bg-red-600 border-red-500 text-white" : "border-gray-700 bg-gray-900"
                                  }`}>
                                    {isSelected && <Check className="w-3 h-3" />}
                                  </div>
                                  <span className="font-bold truncate">{srv.service_name}</span>
                                </div>
                                <span className="font-mono text-xs text-red-400 shrink-0 font-bold">
                                  ₹{Number(srv.price || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            );
                          })}
                          {(services || []).length === 0 && (
                            <p className="text-xs text-gray-500 col-span-2 py-2">No catalog services available.</p>
                          )}
                        </div>
                      </div>

                      {/* Deliverables Checklist Editor */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                          <span>Scope Deliverables Checklist ({proposalForm.deliverables.length})</span>
                          <span className="text-[10px] text-gray-500 font-normal">Clients review these on the live page</span>
                        </label>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {proposalForm.deliverables.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-950 border border-gray-800 text-xs text-gray-300">
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                <span className="truncate">{item}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setProposalForm(prev => ({
                                    ...prev,
                                    deliverables: prev.deliverables.filter((_, i) => i !== idx)
                                  }));
                                }}
                                className="text-gray-500 hover:text-red-400 p-1 shrink-0 ml-2"
                                title="Remove deliverable"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add deliverable input */}
                        <div className="flex items-center gap-2 pt-1">
                          <Input
                            value={proposalForm.customDeliverable}
                            onChange={(e) => setProposalForm({ ...proposalForm, customDeliverable: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (proposalForm.customDeliverable.trim()) {
                                  setProposalForm(prev => ({
                                    ...prev,
                                    deliverables: [...prev.deliverables, prev.customDeliverable.trim()],
                                    customDeliverable: ""
                                  }));
                                }
                              }
                            }}
                            placeholder="Add custom deliverable (press Enter)..."
                            className="bg-gray-950 border-gray-800 text-xs rounded-none h-8"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (proposalForm.customDeliverable.trim()) {
                                setProposalForm(prev => ({
                                  ...prev,
                                  deliverables: [...prev.deliverables, prev.customDeliverable.trim()],
                                  customDeliverable: ""
                                }));
                              }
                            }}
                            className="border-gray-800 text-gray-300 hover:text-white h-8 text-xs shrink-0 rounded-none"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add
                          </Button>
                        </div>
                      </div>

                      {/* Financials & Advance Commitment Deposit */}
                      <div className="p-4 bg-gray-950 border border-gray-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                            <IndianRupee className="w-4 h-4 text-green-400" /> Commercials & Advance Deposit
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            Razorpay Checkout Enabled
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs text-gray-400 font-medium">Total Project Investment (₹) *</label>
                            <Input
                              type="number"
                              required
                              min={100}
                              value={proposalForm.total_amount}
                              onChange={(e) => setProposalForm({ ...proposalForm, total_amount: Number(e.target.value) })}
                              className="bg-gray-900 border-gray-700 text-sm font-bold text-white rounded-none focus:border-red-600"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-gray-400 font-medium flex items-center justify-between">
                              <span>Advance Commitment Deposit</span>
                              <span className="text-red-400 font-bold">{proposalForm.deposit_percentage}%</span>
                            </label>
                            <div className="flex items-center gap-2">
                              {[30, 50, 100].map((pct) => (
                                <button
                                  key={pct}
                                  type="button"
                                  onClick={() => setProposalForm({ ...proposalForm, deposit_percentage: pct })}
                                  className={`flex-1 py-1.5 text-xs font-bold border transition-all ${
                                    proposalForm.deposit_percentage === pct
                                      ? "bg-red-600 border-red-500 text-white"
                                      : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                                  }`}
                                >
                                  {pct}%
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs">
                          <span className="text-gray-400">Advance Due Today (via Razorpay):</span>
                          <span className="text-base font-black text-green-400 font-mono">
                            ₹{Math.round((Number(proposalForm.total_amount || 0) * Number(proposalForm.deposit_percentage || 50)) / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isGeneratingProposal}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-none uppercase tracking-wider text-sm shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        {isGeneratingProposal ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Generating Private Link...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> 1-Click Generate Branded Proposal
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Live Client Pitch Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl sticky top-6">
                  <CardHeader className="border-b border-gray-800 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs uppercase font-mono tracking-wider text-gray-400 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-red-500" /> Live Client View Preview
                      </CardTitle>
                      <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 font-mono">
                        Meeting Ready
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="border border-gray-800 bg-gray-950 p-4 space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pb-2 border-b border-gray-800/80">
                        <span>kfreelance.online/proposal/...</span>
                        <span className="text-red-400 font-bold">CONFIDENTIAL</span>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Prepared Specially For</p>
                        <h3 className="text-lg font-black text-white">
                          {proposalForm.client_name || "Client / Company Name"}
                        </h3>
                        <p className="text-sm font-semibold text-red-500 mt-0.5">
                          {proposalForm.project_title || "Project Title & Architecture"}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {proposalForm.summary || "Tailored project deliverables, sprint roadmap, and direct Razorpay advance deposit checkout."}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                        <div className="p-2 bg-gray-900/80 border border-gray-800">
                          <p className="text-[10px] text-gray-500 uppercase">Total Value</p>
                          <p className="text-sm font-bold text-white font-mono">
                            ₹{Number(proposalForm.total_amount || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-900/80 border border-gray-800">
                          <p className="text-[10px] text-green-400 uppercase">Advance ({proposalForm.deposit_percentage}%)</p>
                          <p className="text-sm font-bold text-green-400 font-mono">
                            ₹{Math.round((Number(proposalForm.total_amount || 0) * Number(proposalForm.deposit_percentage || 50)) / 100).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-red-950/20 border border-red-500/20 text-center text-xs">
                        <p className="font-bold text-gray-200">Integrated Client Checkout</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Client can click "Pay 50% Advance" via UPI/Cards in real-time during your pitch.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-950 border border-gray-800 text-xs text-gray-400 space-y-1">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pitch Strategy for Your Meeting:
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-400">
                        <li>Create the proposal in 10 seconds before or during the call.</li>
                        <li>Send the link in Zoom chat or WhatsApp.</li>
                        <li>Walk the client through the milestone roadmap & deliverables.</li>
                        <li>Have the client pay the 50% advance deposit right before hanging up!</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Active Proposals Table */}
            <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl">
              <CardHeader className="border-b border-gray-800 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-red-500" /> Generated Client Proposals ({proposalsList.length})
                    </CardTitle>
                    <p className="text-xs text-gray-400 mt-1">
                      Active pitch links, payment deposit status, and direct WhatsApp sharing.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-4 font-bold">Client / Company</th>
                        <th className="py-3 px-4 font-bold">Project Scope</th>
                        <th className="py-3 px-4 font-bold">Financials</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Created</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                      {proposalsList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-500 text-xs">
                            No proposals generated yet. Fill out the form above to create your first client proposal!
                          </td>
                        </tr>
                      ) : (
                        proposalsList.map((proposal) => {
                          const isPaid = proposal.status === "deposit_paid" || proposal.payment_status === "paid";
                          const proposalUrl = `${window.location.origin}/proposal/${proposal.slug}`;
                          const waText = encodeURIComponent(`Hi ${proposal.client_name},\n\nHere is your custom project proposal and roadmap for *${proposal.project_title}*:\n${proposalUrl}\n\nYou can review the milestones, deliverables, and authorize the project deposit online.\n\nBest regards,\nKishore`);
                          const waUrl = proposal.client_phone 
                            ? `https://wa.me/${proposal.client_phone.replace(/[^0-9]/g, "")}?text=${waText}`
                            : `https://wa.me/?text=${waText}`;

                          return (
                            <tr key={proposal.id || proposal.slug} className="hover:bg-gray-800/40 transition-colors">
                              <td className="py-3.5 px-4">
                                <p className="font-bold text-white text-xs">{proposal.client_name}</p>
                                {proposal.client_email && (
                                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                    <Mail className="w-3 h-3" /> {proposal.client_email}
                                  </p>
                                )}
                                {proposal.client_phone && (
                                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-green-500" /> {proposal.client_phone}
                                  </p>
                                )}
                              </td>

                              <td className="py-3.5 px-4 max-w-xs">
                                <p className="font-bold text-gray-200 text-xs truncate">{proposal.project_title}</p>
                                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{proposal.summary}</p>
                              </td>

                              <td className="py-3.5 px-4">
                                <p className="font-bold text-white text-xs font-mono">
                                  Total: ₹{Number(proposal.total_amount || 0).toLocaleString("en-IN")}
                                </p>
                                <p className="text-[11px] text-green-400 font-mono mt-0.5">
                                  Deposit: ₹{Number(proposal.deposit_amount || Math.round((proposal.total_amount * 50) / 100)).toLocaleString("en-IN")} ({proposal.deposit_percentage || 50}%)
                                </p>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full ${
                                  isPaid 
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}>
                                  {isPaid ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 mr-1" /> Deposit Paid
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="w-3 h-3 mr-1" /> Active Pitch
                                    </>
                                  )}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-xs text-gray-400 font-mono">
                                {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString("en-IN") : "Today"}
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Copy Link */}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => handleCopyProposalLink(proposal.slug, e)}
                                    className="h-8 px-2.5 text-xs border-gray-800 text-gray-300 hover:text-white rounded-none"
                                    title="Copy link"
                                  >
                                    {copiedProposalSlug === proposal.slug ? (
                                      <>
                                        <Check className="w-3 h-3 text-green-400 mr-1" />
                                        <span className="text-green-400 text-[11px]">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 mr-1" />
                                        <span className="text-[11px]">Copy</span>
                                      </>
                                    )}
                                  </Button>

                                  {/* Open Proposal in New Tab */}
                                  <Link to={`/proposal/${proposal.slug}`} target="_blank">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2.5 text-xs border-gray-800 text-gray-300 hover:text-white rounded-none"
                                      title="Preview as Client"
                                    >
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      <span className="text-[11px]">View</span>
                                    </Button>
                                  </Link>

                                  {/* Share on WhatsApp */}
                                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2.5 text-xs border-green-800/60 bg-green-950/20 text-green-400 hover:bg-green-900/40 rounded-none"
                                      title="Share on WhatsApp"
                                    >
                                      <Send className="w-3 h-3 mr-1" />
                                      <span className="text-[11px]">WhatsApp</span>
                                    </Button>
                                  </a>

                                  {/* Delete */}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteProposal(proposal.id, proposal.slug)}
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 rounded-none"
                                    title="Delete Proposal"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ======================= TAB: OVERVIEW (Existing Services & Orders) ======================= */}
        {activeTab === "overview" && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-400">Total Revenue</CardTitle>
                      <IndianRupee className="w-4 h-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-green-400">₹{stats.totalRevenue.toLocaleString("en-IN")}</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-400">Total Orders</CardTitle>
                      <ShoppingCart className="w-4 h-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-white">{stats.totalOrders}</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs uppercase tracking-wider font-bold text-gray-400">Registered Users</CardTitle>
                      <Users className="w-4 h-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-blue-400">{usersList.length || stats.totalCustomers}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Add New Service Form & Live Preview (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl">
                      <CardHeader className="border-b border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-red-500" /> Add New Service
                            </CardTitle>
                            <p className="text-xs text-gray-400 mt-1">
                              Add client services with custom banners, instant pricing & direct booking checkout
                            </p>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-red-600/20 border border-red-500/40 text-red-400">
                            Live Catalog
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <form onSubmit={handleAddProduct} className="space-y-5">
                          {/* Service Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                              <span>Service Name *</span>
                              <span className="text-[10px] text-gray-500 font-normal">Shown as primary title</span>
                            </label>
                            <Input 
                              required 
                              value={newProduct.service_name}
                              onChange={e => setNewProduct({...newProduct, service_name: e.target.value})}
                              placeholder="e.g. Next.js SaaS MVP Development"
                              className="bg-gray-950 border-gray-800 text-sm rounded-none focus:border-red-600"
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                              <span>Description *</span>
                              <span className="text-[10px] text-gray-500 font-normal">Scope & deliverables</span>
                            </label>
                            <Input 
                              required 
                              value={newProduct.description}
                              onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                              placeholder="e.g. Production-grade architecture with auth, billing, and database..."
                              className="bg-gray-950 border-gray-800 text-sm rounded-none focus:border-red-600"
                            />
                          </div>

                          {/* Price */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                              <span>Price in INR (₹)</span>
                              <span className="text-[10px] text-gray-500 font-normal">Leave blank for &quot;Custom Scope&quot;</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">₹</span>
                              <Input 
                                type="number"
                                value={newProduct.price}
                                onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                placeholder="14999 (or 0 for Custom Scope)"
                                className="bg-gray-950 border-gray-800 pl-7 text-sm rounded-none focus:border-red-600"
                              />
                            </div>
                          </div>

                          {/* Image & Visual Banner Section */}
                          <div className="space-y-3 pt-2 border-t border-gray-800/80">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-red-500" />
                                <span>Service Visual Banner</span>
                              </label>
                              
                              {/* Toggle Mode */}
                              <div className="flex items-center gap-1 bg-gray-950 p-1 border border-gray-800">
                                <button
                                  type="button"
                                  onClick={() => setImageInputMode("upload")}
                                  className={`px-2.5 py-1 text-[11px] font-bold transition-all ${
                                    imageInputMode === "upload" 
                                      ? "bg-red-600 text-white shadow-sm" 
                                      : "text-gray-400 hover:text-white"
                                  }`}
                                >
                                  Drag & Drop / Upload
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setImageInputMode("url")}
                                  className={`px-2.5 py-1 text-[11px] font-bold transition-all ${
                                    imageInputMode === "url" 
                                      ? "bg-red-600 text-white shadow-sm" 
                                      : "text-gray-400 hover:text-white"
                                  }`}
                                >
                                  Image URL
                                </button>
                              </div>
                            </div>

                            {/* Hidden file input */}
                            <input 
                              ref={fileInputRef}
                              type="file" 
                              accept="image/*" 
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFile(file);
                              }}
                            />

                            {/* Mode A: Drag & Drop Dropzone */}
                            {imageInputMode === "upload" && (
                              <div>
                                {newProduct.image_url ? (
                                  <div className="relative border border-gray-800 bg-gray-950 p-3 flex items-center gap-4">
                                    <img 
                                      src={newProduct.image_url} 
                                      alt="Banner Preview" 
                                      className="w-24 h-16 object-cover border border-gray-800"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-white truncate">Image Attached</p>
                                      <p className="text-[11px] text-green-400 font-medium">Ready for live client preview</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-8 text-xs border-gray-800 text-gray-300 hover:text-white rounded-none"
                                      >
                                        Replace
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setNewProduct(prev => ({ ...prev, image_url: '' }))}
                                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-none"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div 
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      setIsDragging(false);
                                      const file = e.dataTransfer.files?.[0];
                                      if (file) handleImageFile(file);
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
                                      isDragging 
                                        ? "border-red-500 bg-red-500/10 scale-[1.01]" 
                                        : "border-gray-800 hover:border-gray-700 bg-gray-950/70"
                                    }`}
                                  >
                                    <UploadCloud className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                                      isDragging ? "text-red-500 animate-bounce" : "text-gray-500"
                                    }`} />
                                    <p className="text-xs font-bold text-white">
                                      Drop image here, or <span className="text-red-500 underline">browse file</span>
                                    </p>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                      Supports PNG, JPG, WEBP, SVG (Auto-compressed for instant speed)
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Mode B: Direct Image URL */}
                            {imageInputMode === "url" && (
                              <div className="space-y-2">
                                <div className="relative">
                                  <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                  <Input 
                                    value={newProduct.image_url}
                                    onChange={e => setNewProduct({...newProduct, image_url: e.target.value})}
                                    placeholder="https://images.unsplash.com/... or any hosted image link"
                                    className="bg-gray-950 border-gray-800 pl-9 text-xs rounded-none focus:border-red-600"
                                  />
                                  {newProduct.image_url && (
                                    <button
                                      type="button"
                                      onClick={() => setNewProduct(prev => ({ ...prev, image_url: '' }))}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 1-Click Meeting Presets (Instant Demo Winner!) */}
                            <div className="pt-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <span>⚡ 1-Click Client Presets (Instant Demo):</span>
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {IMAGE_PRESETS.map((preset) => (
                                  <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => {
                                      setNewProduct(prev => ({ ...prev, image_url: preset.url }));
                                      toast({ title: "Preset Applied! 🎨", description: `Loaded ${preset.label} banner.` });
                                    }}
                                    className={`px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                                      newProduct.image_url === preset.url
                                        ? "bg-red-600/20 border-red-500 text-red-300 font-bold"
                                        : "bg-gray-950 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Live Client Card Preview (What your client sees on the website!) */}
                          <div className="pt-4 border-t border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                <span>Live Website Preview (What Clients See)</span>
                              </span>
                              <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Real-Time Sync
                              </span>
                            </div>

                            <div className="bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl relative">
                              {/* Preview Banner */}
                              <div className="h-36 w-full relative bg-zinc-900 overflow-hidden">
                                {newProduct.image_url ? (
                                  <img 
                                    src={newProduct.image_url} 
                                    alt="Client Preview" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-950">
                                    <ImageIcon className="w-8 h-8 mb-1 opacity-40" />
                                    <span className="text-[11px] text-gray-500">Image will appear here</span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 border border-white/10 text-red-500 text-xs font-bold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Freelance Service
                                </div>
                              </div>

                              {/* Preview Info */}
                              <div className="p-4 space-y-2">
                                <h4 className="text-base font-black text-white">
                                  {newProduct.service_name || "Your Service Title"}
                                </h4>
                                <p className="text-xs text-zinc-400 line-clamp-2">
                                  {newProduct.description || "Detailed scope of deliverables, tech stack, and milestones..."}
                                </p>
                                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                                  <div>
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Starting Price</p>
                                    <p className="text-lg font-black text-white">
                                      {newProduct.price && Number(newProduct.price) > 0
                                        ? `₹${Number(newProduct.price).toLocaleString("en-IN")}`
                                        : "Custom Scope Quote"}
                                    </p>
                                  </div>
                                  <span className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/20">
                                    Book Now
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <Button 
                            type="submit" 
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-black rounded-none h-12 text-sm tracking-wide shadow-lg shadow-red-600/30" 
                            disabled={isAddingProduct}
                          >
                            {isAddingProduct ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Adding Service & Publishing to Catalog...
                              </>
                            ) : (
                              "Publish Service to Website"
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Active Catalog Services (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <Card className="bg-gray-900 border-gray-800 rounded-none shadow-xl h-full flex flex-col">
                      <CardHeader className="border-b border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-gray-400" /> Active Catalog Services
                          </CardTitle>
                          <span className="text-xs font-bold px-2 py-0.5 bg-gray-800 text-gray-300">
                            {services.length} Total
                          </span>
                        </div>
                        
                        {/* Search Filter for Catalog */}
                        <div className="relative mt-3">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input 
                            value={serviceSearch}
                            onChange={(e) => setServiceSearch(e.target.value)}
                            placeholder="Filter catalog services..."
                            className="bg-gray-950 border-gray-800 pl-8 text-xs rounded-none h-8"
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4 flex-1 overflow-hidden">
                        <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                          {(services || [])
                            .filter(s => {
                              if (!serviceSearch.trim()) return true;
                              const q = serviceSearch.toLowerCase();
                              return (
                                s.service_name?.toLowerCase().includes(q) ||
                                s.description?.toLowerCase().includes(q) ||
                                s.service_key?.toLowerCase().includes(q)
                              );
                            })
                            .map((service) => (
                              <div 
                                key={service.id} 
                                className="p-3 bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all rounded-none flex items-start gap-3 group"
                              >
                                {/* Thumbnail Image */}
                                <div className="w-16 h-14 bg-gray-900 border border-gray-800 shrink-0 overflow-hidden relative">
                                  {service.image_url ? (
                                    <img 
                                      src={service.image_url} 
                                      alt={service.service_name} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/service_web.jpg";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">
                                      <ImageIcon className="w-5 h-5 opacity-40" />
                                    </div>
                                  )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-white text-xs truncate">
                                    {service.service_name}
                                  </h4>
                                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                                    {service.description || "No description"}
                                  </p>
                                  <p className="text-xs text-red-500 font-black mt-1">
                                    {service.price ? `₹${Number(service.price).toLocaleString("en-IN")}` : "Custom Scope"}
                                  </p>

                                  {/* Quick Actions */}
                                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800/80">
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyBookingLink(service.service_key || String(service.id), e)}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white transition-colors"
                                      title="Copy direct client checkout link"
                                    >
                                      {copiedServiceId === (service.service_key || String(service.id)) ? (
                                        <>
                                          <Check className="w-3 h-3 text-green-400" />
                                          <span className="text-green-400">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>Copy Link</span>
                                        </>
                                      )}
                                    </button>

                                    <Link
                                      to="/freelancing"
                                      target="_blank"
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-blue-400 transition-colors ml-auto"
                                    >
                                      <ExternalLink className="w-3 h-3" /> View
                                    </Link>

                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteProduct(service.id)}
                                      className="text-gray-500 hover:text-red-500 p-1 transition-colors"
                                      title="Delete Service"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {(services || []).length === 0 && (
                            <div className="py-12 text-center text-gray-500 text-xs">
                              No active catalog services found. Add one on the left to start!
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Orders List */}
                <Card className="bg-gray-900 border-gray-800 rounded-none">
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-white">Recent Payment Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wider">
                            <th className="py-3 px-4 font-bold">Order ID</th>
                            <th className="py-3 px-4 font-bold">Customer</th>
                            <th className="py-3 px-4 font-bold">Service</th>
                            <th className="py-3 px-4 font-bold">Amount</th>
                            <th className="py-3 px-4 font-bold">Date</th>
                            <th className="py-3 px-4 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                          {(orders?.length || 0) === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-500">
                                No orders found in database
                              </td>
                            </tr>
                          ) : (
                            (orders || []).map(order => (
                              <tr key={order.id || order.internal_order_id} className="hover:bg-gray-800/40 transition-colors">
                                <td className="py-3.5 px-4 text-xs font-mono text-gray-400">
                                  {(order.razorpay_order_id ? order.razorpay_order_id.substring(0, 14) : 'N/A')}...
                                </td>
                                <td className="py-3.5 px-4">
                                  <p className="font-bold text-gray-200 text-xs">{order.customer_name}</p>
                                  <p className="text-[11px] text-gray-500">{order.customer_email}</p>
                                </td>
                                <td className="py-3.5 px-4 text-gray-300 text-xs font-medium">{order.service_name}</td>
                                <td className="py-3.5 px-4 font-bold text-green-400 text-xs">₹{Number(order.amount).toLocaleString("en-IN")}</td>
                                <td className="py-3.5 px-4 text-xs text-gray-400">
                                  <div className="flex items-center gap-1 font-mono">
                                    <Clock className="w-3 h-3 text-zinc-500" />
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN") : "—"}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                    order.status === 'paid' || order.order_status === 'paid' 
                                      ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                  }`}>
                                    {(order.status === 'paid' || order.order_status === 'paid') && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                    {(order.status || order.order_status || "CREATED")}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
