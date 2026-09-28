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
  Trash2
} from "lucide-react";
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton, useAuth } from "@clerk/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AdminDashboardWrapper() {
  if (!PUBLISHABLE_KEY) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 text-center">Missing VITE_CLERK_PUBLISHABLE_KEY in Firebase environment variables.<br/>Please add it to Firebase and deploy again.</div>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AdminDashboard />
    </ClerkProvider>
  );
}

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ service_name: '', description: '', price: '', icon: 'Sparkles' });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const { toast } = useToast();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      verifyAndLoadData();
    }
  }, [isLoaded, isSignedIn]);

  const verifyAndLoadData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token found");

      // 1. Verify Password & Fetch Stats
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
        title: "Error loading data",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
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
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Admin...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-8">Kishore Admin Dashboard</h1>
        <SignIn routing="hash" forceRedirectUrl="/admin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your freelance business</p>
          </div>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Dashboard Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
                  <IndianRupee className="w-4 h-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">â‚¹{stats.totalRevenue}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Orders</CardTitle>
                  <ShoppingCart className="w-4 h-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{stats.totalOrders}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Customers</CardTitle>
                  <Users className="w-4 h-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{stats.totalCustomers}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Add New Product Form */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl">Add New Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Service Name</label>
                      <Input 
                        required 
                        value={newProduct.service_name}
                        onChange={e => setNewProduct({...newProduct, service_name: e.target.value})}
                        placeholder="e.g. Full-Stack Web App"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Description</label>
                      <Input 
                        required 
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Brief description..."
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Price (â‚¹)</label>
                      <Input 
                        required 
                        type="number"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="10000"
                        className="bg-gray-900 border-gray-700"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isAddingProduct}>
                      {isAddingProduct ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Add Service"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Current Services List */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl">Current Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {(services || []).map(service => (
                      <div key={service.id} className="p-4 bg-gray-900 rounded-lg flex justify-between items-center border border-gray-700">
                        <div>
                          <h4 className="font-medium text-white">{service.service_name}</h4>
                          <p className="text-sm text-gray-400">â‚¹{service.price}</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleDeleteProduct(service.id)}
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
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Service</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {(orders?.length || 0) === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        (orders || []).map(order => (
                          <tr key={order.id} className="hover:bg-gray-900/50 transition-colors">
                            <td className="py-4 text-sm font-mono text-gray-400">{(order.razorpay_order_id ? order.razorpay_order_id.substring(0, 12) : 'N/A')}...</td>
                            <td className="py-4">
                              <p className="font-medium text-gray-200">{order.customer_name}</p>
                              <p className="text-xs text-gray-500">{order.customer_email}</p>
                            </td>
                            <td className="py-4 text-gray-300">{order.service_name}</td>
                            <td className="py-4 font-medium text-green-400">â‚¹{order.amount}</td>
                            <td className="py-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(order.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {order.status === 'paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {(order.status ? order.status.toUpperCase() : "UNKNOWN")}
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
      </div>
    </div>
  );
}
