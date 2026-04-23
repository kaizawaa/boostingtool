import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Platform, Service, Order } from "./types";
import { services } from "./utils/data";
import PlatformSelector from "./components/PlatformSelector";
import ServiceCard from "./components/ServiceCard";
import OrderForm from "./components/OrderForm";
import OrderHistory from "./components/OrderHistory";
import StatsBar from "./components/StatsBar";
import ProviderBadge from "./components/ProviderBadge";

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"order" | "history">("order");

  const filteredServices = useMemo(() => {
    let filtered = services;
    if (selectedPlatform) {
      filtered = filtered.filter(s => s.platform === selectedPlatform);
    }
    if (selectedCategory !== "All") {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    return filtered;
  }, [selectedPlatform, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(filteredServices.map(s => s.category));
    return ["All", ...Array.from(cats)];
  }, [selectedPlatform]);

  const handleOrderSubmit = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setSelectedService(null);
    setActiveTab("history");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black font-black text-lg">
              B
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight">BoostHub</h1>
              <p className="text-slate-500 text-xs font-semibold tracking-wider">SOCIAL MEDIA BOOSTING</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab("order"); setSelectedService(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === "order"
                  ? "bg-amber-500 text-black"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              New Order
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${
                activeTab === "history"
                  ? "bg-amber-500 text-black"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Orders
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {orders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "order" ? (
            <motion.div
              key="order"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats */}
              <div className="mb-6">
                <StatsBar services={services} totalOrders={orders.length} />
              </div>

              {/* Providers */}
              <div className="mb-6">
                <h3 className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-3">Trusted Providers</h3>
                <ProviderBadge />
              </div>

              {/* Platform Selector */}
              <div className="mb-6">
                <h3 className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-3">Select Platform</h3>
                <PlatformSelector selected={selectedPlatform} onSelect={setSelectedPlatform} />
              </div>

              {/* Service Selection or Order Form */}
              {selectedService ? (
                <OrderForm
                  service={selectedService}
                  onBack={() => setSelectedService(null)}
                  onSubmit={handleOrderSubmit}
                />
              ) : (
                <>
                  {/* Category Filter */}
                  {selectedPlatform && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              selectedCategory === cat
                                ? "bg-amber-500 text-black"
                                : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Grid */}
                  <div>
                    <h3 className="text-slate-500 text-xs font-bold tracking-wider uppercase mb-3">
                      {selectedPlatform ? `${filteredServices.length} Services Available` : "Select a platform to start"}
                    </h3>
                    {filteredServices.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredServices.map((service, index) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                            onSelect={setSelectedService}
                          />
                        ))}
                      </div>
                    ) : selectedPlatform ? (
                      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <h3 className="text-white font-bold">No services found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try a different category or platform</p>
                      </div>
                    ) : (
                      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-12 text-center">
                        <div className="text-6xl mb-4">🚀</div>
                        <h3 className="text-white font-black text-2xl mb-2">Boost Your Social Media</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                          Select a platform above to browse available boosting services from our trusted providers
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OrderHistory orders={orders} onClear={() => setOrders([])} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-slate-600 text-xs">BoostHub — Social Media Boosting Platform • All services provided by third-party providers</p>
        </div>
      </footer>
    </div>
  );
}