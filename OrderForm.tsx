import { useState } from "react";
import { motion } from "framer-motion";
import { Service, Order } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { getPlatformInfo, formatCurrency, formatNumber, generateOrderId } from "../utils/helpers";

interface Props {
  service: Service;
  onBack: () => void;
  onSubmit: (order: Order) => void;
}

export default function OrderForm({ service, onBack, onSubmit }: Props) {
  const platformInfo = getPlatformInfo(service.platform);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(service.min);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCost = quantity * service.rate;
  const isValid = link.trim().length > 0 && quantity >= service.min && quantity <= service.max;

  const handleSubmit = () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        id: generateOrderId(),
        service,
        link,
        quantity,
        totalCost,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-slate-900 border border-slate-700 rounded-2xl p-6"
    >
      <button
        onClick={onBack}
        className="text-slate-400 hover:text-white text-sm mb-4 flex items-center gap-1 transition-colors"
      >
        ← Back to services
      </button>

      <div className={`${platformInfo.bgColor} border ${platformInfo.borderColor} rounded-xl p-4 mb-6`}>
        <h2 className={`text-lg font-bold ${platformInfo.color}`}>{service.name}</h2>
        <p className="text-slate-400 text-sm mt-1">{service.description}</p>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="text-slate-500">Provider: <span className="text-amber-400 font-bold">{service.provider}</span></span>
          <span className="text-slate-500">Speed: <span className="text-white">{service.averageTime}</span></span>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-slate-300 text-sm font-semibold mb-2 block">Link / URL</Label>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder={`Enter your ${platformInfo.name} link here...`}
            className="bg-slate-950 border-slate-600 text-white placeholder:text-slate-600 focus:border-slate-400"
          />
        </div>

        <div>
          <Label className="text-slate-300 text-sm font-semibold mb-2 block">
            Quantity ({formatNumber(service.min)} — {formatNumber(service.max)})
          </Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={service.min}
            max={service.max}
            className="bg-slate-950 border-slate-600 text-white focus:border-slate-400"
          />
          <input
            type="range"
            min={service.min}
            max={Math.min(service.max, 100000)}
            value={Math.min(quantity, 100000)}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full mt-2 accent-amber-500"
          />
        </div>

        <div className="bg-slate-950 border border-slate-700 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Service</span>
            <span className="text-white font-semibold">{service.name}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Rate per 1000</span>
            <span className="text-white">{formatCurrency(service.rate * 1000)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Quantity</span>
            <span className="text-white">{formatNumber(quantity)}</span>
          </div>
          <div className="border-t border-slate-700 my-3" />
          <div className="flex justify-between">
            <span className="text-slate-300 font-bold">Total Cost</span>
            <span className="text-2xl font-black text-amber-400">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`w-full py-6 text-base font-bold ${isValid ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Processing...
            </span>
          ) : (
            `Place Order — ${formatCurrency(totalCost)}`
          )}
        </Button>
      </div>
    </motion.div>
  );
}