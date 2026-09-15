import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Github, Linkedin, Mail, Instagram, Phone, Loader2, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const socials = [
  { name: "GitHub", icon: Github, url: "https://github.com/kishore-lang" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/kishore-jagadesan/" },
  { name: "Phone", icon: Phone, url: "tel:+916379311955" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/kishorx.__/#" },
  { name: "Email", icon: Mail, url: "mailto:kishorekishore0783@gmail.com" },
];

export const Social = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        toast({ title: "Message Sent!", description: "We will get back to you shortly." });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative overflow-hidden bg-white text-black border-t border-black/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Get in <span className="text-red-600">Touch</span>
            </h2>
            <p className="text-zinc-600 font-medium">Ready to start your next project? Drop us a message.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-zinc-50 border border-black/10 p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Name</label>
                  <Input 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-white border-black/20 focus-visible:ring-red-600 rounded-none h-12" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Email</label>
                  <Input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-white border-black/20 focus-visible:ring-red-600 rounded-none h-12" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Message</label>
                  <Textarea 
                    required 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-white border-black/20 focus-visible:ring-red-600 rounded-none min-h-[120px]" 
                    placeholder="Tell us about your project..." 
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-none text-lg"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
                <p className="text-zinc-600 leading-relaxed mb-8 font-medium">
                  Whether you have a question about our services, pricing, or just want to say hi, we're always here to help. 
                  Connect with us on social media or reach out directly.
                </p>
                <div className="flex flex-wrap gap-4">
                  {socials.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-14 h-14 bg-black text-white hover:bg-red-600 transition-colors shadow-lg"
                      aria-label={social.name}
                    >
                      <social.icon size={24} />
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="bg-black text-white p-8 border-l-4 border-red-600">
                <h4 className="text-xl font-bold mb-2">Direct Contact</h4>
                <p className="text-zinc-400 font-medium">kishorekishore0783@gmail.com</p>
                <p className="text-zinc-400 font-medium">+91 63793 11955</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
