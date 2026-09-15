import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, PackageOpen, CreditCard, Clock, CheckCircle2, ChevronRight, UserCircle } from "lucide-react";
import { format } from "date-fns";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(user.whatsappNumber)}/orders`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative min-h-screen bg-zinc-50 text-black">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              <UserCircle className="w-10 h-10 text-red-600" />
              Welcome, {user.fullName.split(" ")[0]}
            </h1>
            <p className="text-zinc-500 font-medium">{user.email} • {user.whatsappNumber}</p>
          </div>
          <button 
            onClick={() => { logout(); navigate("/"); }}
            className="text-sm font-bold text-red-600 hover:text-black transition-colors"
          >
            Log Out
          </button>
        </div>

        <div className="bg-white border border-black/10 shadow-xl rounded-none overflow-hidden">
          <div className="p-6 border-b border-black/5 bg-zinc-100 flex items-center gap-2">
            <PackageOpen className="text-zinc-600" />
            <h2 className="text-xl font-bold tracking-tight">Your Orders</h2>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageOpen className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                <p className="text-zinc-500 mb-6 font-medium">When you book a service, it will appear here.</p>
                <button 
                  onClick={() => navigate("/freelancing")}
                  className="bg-black text-white px-6 py-2 font-bold hover:bg-red-600 transition-colors"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {orders.map((order, idx) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 hover:bg-zinc-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                        <Clock className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{order.service_name}</h3>
                        <p className="text-sm text-zinc-500 font-medium mb-1">
                          Ordered on {format(new Date(order.created_at), "MMM do, yyyy")}
                        </p>
                        <p className="text-sm text-zinc-600 line-clamp-1 max-w-md">{order.requirements}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8 md:min-w-[300px]">
                      <div>
                        <p className="text-xs text-zinc-400 font-bold uppercase mb-1">Amount</p>
                        <p className="font-black text-lg">₹{Number(order.amount).toLocaleString("en-IN")}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-zinc-400 font-bold uppercase mb-1">Payment</p>
                        <div className={`flex items-center gap-1.5 text-sm font-bold ${
                          order.verification_status === 'verified' ? 'text-green-600' : 
                          order.verification_status === 'failed' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {order.verification_status === 'verified' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          {order.verification_status === 'verified' ? 'Paid' : 'Pending'}
                        </div>
                      </div>

                      <ChevronRight className="text-zinc-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
