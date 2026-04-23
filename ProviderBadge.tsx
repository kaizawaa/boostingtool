import { providers } from "../utils/data";

export default function ProviderBadge() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {providers.map(p => (
        <div
          key={p.id}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
        >
          <span className={`font-bold text-sm ${p.color}`}>{p.name}</span>
          <span className="text-xs text-slate-500">★ {p.rating}</span>
          <span className="text-xs text-slate-600">|</span>
          <span className="text-xs text-slate-500">{(p.completed / 1000000).toFixed(1)}M+ done</span>
        </div>
      ))}
    </div>
  );
}