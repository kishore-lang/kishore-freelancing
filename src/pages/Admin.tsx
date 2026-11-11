import { useState, useEffect } from "react";
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
  BookOpen
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

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ service_name: '', description: '', price: '', icon: 'Sparkles' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
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
        setNewProduct({ service_name: '', description: '', price: '', icon: 'Sparkles' });
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Add New Service Form */}
                  <Card className="bg-gray-900 border-gray-800 rounded-none">
                    <CardHeader>
                      <CardTitle className="text-lg font-black text-white">Add New Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddProduct} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Name</label>
                          <Input 
                            required 
                            value={newProduct.service_name}
                            onChange={e => setNewProduct({...newProduct, service_name: e.target.value})}
                            placeholder="e.g. Full-Stack Web App"
                            className="bg-gray-950 border-gray-800 text-sm rounded-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                          <Input 
                            required 
                            value={newProduct.description}
                            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                            placeholder="Brief description..."
                            className="bg-gray-950 border-gray-800 text-sm rounded-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price (₹)</label>
                          <Input 
                            required 
                            type="number"
                            value={newProduct.price}
                            onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="14999"
                            className="bg-gray-950 border-gray-800 text-sm rounded-none"
                          />
                        </div>
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black rounded-none h-11" disabled={isAddingProduct}>
                          {isAddingProduct ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add Service"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Current Services List */}
                  <Card className="bg-gray-900 border-gray-800 rounded-none">
                    <CardHeader>
                      <CardTitle className="text-lg font-black text-white">Active Catalog Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                        {(services || []).map(service => (
                          <div key={service.id} className="p-3.5 bg-gray-950 rounded-none flex justify-between items-center border border-gray-800 hover:border-gray-700 transition-colors">
                            <div>
                              <h4 className="font-bold text-white text-sm">{service.service_name}</h4>
                              <p className="text-xs text-red-500 font-bold mt-0.5">
                                {service.price ? `₹${Number(service.price).toLocaleString("en-IN")}` : "Custom Scope"}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteProduct(service.id)}
                              className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-none"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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
