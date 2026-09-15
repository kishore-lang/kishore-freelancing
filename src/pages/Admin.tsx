import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  IndianRupee, 
  ShoppingCart, 
  Users, 
  Lock, 
  LogOut,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ service_name: '', description: '', price: '', icon: 'Sparkles' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      verifyAndLoadData(savedPassword);
    }
  }, []);

  const verifyAndLoadData = async (pass: string) => {
    setIsLoading(true);
    try {
      // 1. Verify Password & Fetch Stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${pass}` }
      });
      
      const statsData = await statsRes.json();
      
      if (!statsRes.ok) {
        throw new Error(statsData.message || "Authentication failed");
      }

      setStats(statsData.stats);
      
      // 2. Fetch Orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${pass}` }
      });
      const ordersData = await ordersRes.json();
      
      if (ordersRes.ok && ordersData.orders) {
        setOrders(ordersData.orders);
      }

      // Success
      sessionStorage.setItem("adminPassword", pass);
      setIsAuthenticated(true);
      
    } catch (error: any) {
      sessionStorage.removeItem("adminPassword");
      setIsAuthenticated(false);
      toast({
        title: "Access Denied",
        description: error.message || "Invalid password or server error",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    verifyAndLoadData(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminPassword");
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.service_name) return;
    
    setIsAddingProduct(true);
    try {
      const pass = sessionStorage.getItem("adminPassword");
      const res = await fetch(`${API_BASE_URL}/api/admin/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pass}` 
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Success", description: "Product added instantly to website!" });
        setNewProduct({ service_name: '', description: '', price: '', icon: 'Sparkles' });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAddingProduct(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
            <CardHeader className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
              <p className="text-sm text-zinc-400">Enter master password to access the dashboard</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-zinc-800 text-white placeholder:text-zinc-500 h-12"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Dashboard"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Agency Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">Overview of your freelance business</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
              <IndianRupee className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Clients</CardTitle>
              <Users className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalCustomers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-black/40">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Date</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 rounded-tr-lg">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order: any, idx: number) => (
                      <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 text-zinc-300">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{order.customer_name}</div>
                          <div className="text-xs text-zinc-500">{order.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 text-zinc-300">{order.service_name || "Custom"}</td>
                        <td className="px-6 py-4 font-medium text-white">₹{order.amount}</td>
                        <td className="px-6 py-4">
                          {order.order_status === 'paid' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400">
                              <Clock className="w-3.5 h-3.5" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-zinc-500">
                          {order.razorpay_payment_id || "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add Product Form */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Add New Product</CardTitle>
            <p className="text-sm text-zinc-400">Products added here will instantly appear on your website.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Service Name</label>
                  <Input 
                    required 
                    placeholder="e.g. SEO Optimization" 
                    value={newProduct.service_name}
                    onChange={(e) => setNewProduct({...newProduct, service_name: e.target.value})}
                    className="bg-black/50 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Price (₹)</label>
                  <Input 
                    type="number"
                    placeholder="e.g. 5000" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="bg-black/50 border-zinc-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Description</label>
                <Input 
                  placeholder="Short description of the service..." 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="bg-black/50 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Icon Name (Lucide-react)</label>
                <Input 
                  placeholder="e.g. Sparkles, Globe, ShoppingCart" 
                  value={newProduct.icon}
                  onChange={(e) => setNewProduct({...newProduct, icon: e.target.value})}
                  className="bg-black/50 border-zinc-800"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isAddingProduct}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isAddingProduct ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Product to Website
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
