import { motion, AnimatePresence } from "framer-motion";
import { Order } from "../types";
import { formatCurrency, formatNumber, getStatusColor } from "../utils/helpers";

interface Props {
  orders: Order[];
  onClear: () => void;
}

export default function OrderHistory({ orders, onClear }: Props) {
  if (orders.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📋</div>
        <h3 className="text-white font-bold text-lg">No orders yet</h3>
        <p className="text-slate-500 text-sm mt-1">Place your first order to see it here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-lg">Recent Orders</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Clear All
        </button>
      </div>
      <AnimatePresence>
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-900 border border-slate-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-bold text-sm">{order.service.name}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{order.id}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <span className="text-slate-400">Qty: <span className="text-white font-semibold">{formatNumber(order.quantity)}</span></span>
              <span className="text-slate-400">Cost: <span className="text-amber-400 font-semibold">{formatCurrency(order.totalCost)}</span></span>
              <span className="text-slate-400">Provider: <span className="text-white">{order.service.provider}</span></span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}