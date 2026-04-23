import { motion } from "framer-motion";
import { Service } from "../types";
import { getPlatformInfo, formatCurrency, formatNumber } from "../utils/helpers";

interface Props {
  service: Service;
  index: number;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({ service, index, onSelect }: Props) {
  const platformInfo = getPlatformInfo(service.platform);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onSelect(service)}
      className={`${platformInfo.bgColor} border ${platformInfo.borderColor} rounded-xl p-4 cursor-pointer transition-shadow duration-200 hover:shadow-xl hover:shadow-black/30`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-white font-bold text-sm">{service.name}</h3>
          <span className={`text-xs ${platformInfo.color} font-semibold`}>{service.category}</span>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-950 px-2 py-1 rounded-lg">
          {service.provider}
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-3">{service.description}</p>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-slate-500 mb-0.5">Rate</div>
          <div className="text-white font-bold">{formatCurrency(service.rate)}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-slate-500 mb-0.5">Min</div>
          <div className="text-white font-bold">{formatNumber(service.min)}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-slate-500 mb-0.5">Max</div>
          <div className="text-white font-bold">{formatNumber(service.max)}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
        <Clock size={12} />
        <span>{service.averageTime}</span>
      </div>
    </motion.div>
  );
}

function Clock({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}