import { motion } from "framer-motion";
import { Service } from "../types";

interface Props {
  services: Service[];
  totalOrders: number;
}

export default function StatsBar({ services, totalOrders }: Props) {
  const totalProviders = new Set(services.map(s => s.provider)).size;
  const totalPlatforms = new Set(services.map(s => s.platform)).size;

  const stats = [
    { label: "Platforms", value: totalPlatforms, icon: "🌐", color: "text-sky-400" },
    { label: "Services", value: services.length, icon: "⚡", color: "text-amber-400" },
    { label: "Providers", value: totalProviders, icon: "🛡", color: "text-emerald-400" },
    { label: "Your Orders", value: totalOrders, icon: "📦", color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center"
        >
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
          <div className="text-slate-500 text-xs font-semibold tracking-wider uppercase">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}