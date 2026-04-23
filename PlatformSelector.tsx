import { motion } from "framer-motion";
import { Platform, PlatformInfo } from "../types";
import { platforms } from "../utils/data";

interface Props {
  selected: Platform | null;
  onSelect: (platform: Platform) => void;
}

export default function PlatformSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {platforms.map((p: PlatformInfo) => (
        <motion.button
          key={p.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(p.id)}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
            selected === p.id
              ? `${p.bgColor} ${p.borderColor} shadow-lg`
              : "bg-slate-900 border-slate-700 hover:border-slate-500"
          }`}
        >
          <span className={`text-3xl ${selected === p.id ? p.color : 'text-slate-400'}`}>
            {p.id === 'tiktok' && '♪'}
            {p.id === 'youtube' && '▶'}
            {p.id === 'instagram' && '◉'}
            {p.id === 'telegram' && '✈'}
            {p.id === 'facebook' && 'f'}
            {p.id === 'twitter' && '𝕏'}
          </span>
          <span className={`text-xs font-bold tracking-wide ${
            selected === p.id ? 'text-white' : 'text-slate-400'
          }`}>
            {p.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}