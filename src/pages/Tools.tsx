import React, { useState, useEffect } from 'react';
import { Calculator, Share2, MessageCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

type Unit = 'Square Feet' | 'Square Yards/Gaj' | 'Acre' | 'Hectare' | 'Bigha' | 'Biswa' | 'Kanal' | 'Marla' | 'Guntha' | 'Ground' | 'Cent';
type State = 'UP' | 'Rajasthan' | 'Bihar' | 'Punjab';

const CONVERSION_FACTORS: Record<Unit, number> = {
  'Square Feet': 1,
  'Square Yards/Gaj': 9,
  'Acre': 43560,
  'Hectare': 107639,
  'Guntha': 1089,
  'Ground': 2400,
  'Cent': 435.6,
  'Kanal': 5445,
  'Marla': 272.25,
  'Bigha': 27000, // Default (UP)
  'Biswa': 1350,   // Default (UP)
};

const BIGHA_FACTORS: Record<State, { bigha: number; biswa: number }> = {
  'UP': { bigha: 27000, biswa: 1350 },
  'Rajasthan': { bigha: 27225, biswa: 1361.25 },
  'Bihar': { bigha: 27225, biswa: 1361.25 },
  'Punjab': { bigha: 9075, biswa: 453.75 },
};

export function Tools() {
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<Unit>('Bigha');
  const [toUnit, setToUnit] = useState<Unit>('Acre');
  const [state, setState] = useState<State>('UP');
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const numValue = parseFloat(value) || 0;
    
    let fromFactor = CONVERSION_FACTORS[fromUnit];
    if (fromUnit === 'Bigha') fromFactor = BIGHA_FACTORS[state].bigha;
    if (fromUnit === 'Biswa') fromFactor = BIGHA_FACTORS[state].biswa;

    let toFactor = CONVERSION_FACTORS[toUnit];
    if (toUnit === 'Bigha') toFactor = BIGHA_FACTORS[state].bigha;
    if (toUnit === 'Biswa') toFactor = BIGHA_FACTORS[state].biswa;

    const converted = (numValue * fromFactor) / toFactor;
    setResult(converted);
  }, [value, fromUnit, toUnit, state]);

  const handleShare = () => {
    const text = `Key Deals Land Calculator:\n${value} ${fromUnit}${fromUnit === 'Bigha' || fromUnit === 'Biswa' ? ` (${state})` : ''} = ${result.toFixed(2)} ${toUnit}\nCheck it out on Key Deals!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const units: Unit[] = [
    'Square Feet', 'Square Yards/Gaj', 'Acre', 'Hectare', 
    'Bigha', 'Biswa', 'Kanal', 'Marla', 'Guntha', 'Ground', 'Cent'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-700 tracking-tight flex items-center gap-3">
          <Calculator className="w-8 h-8 text-[#002366]" /> Vernacular Land Calculator
        </h1>
        <p className="text-slate-500 mt-1">Convert land areas across regional Indian units.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Enter Area</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full text-4xl font-bold text-[#002366] bg-slate-50 border-none focus:ring-0 p-6 rounded-2xl placeholder:text-slate-300"
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Unit */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">From</label>
              <div className="relative">
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value as Unit)}
                  className="w-full pl-4 pr-10 py-4 bg-white border-2 border-slate-100 rounded-2xl appearance-none focus:border-[#002366] outline-none transition-all font-semibold text-slate-700"
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* To Unit */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">To</label>
              <div className="relative">
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value as Unit)}
                  className="w-full pl-4 pr-10 py-4 bg-white border-2 border-slate-100 rounded-2xl appearance-none focus:border-[#002366] outline-none transition-all font-semibold text-slate-700"
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Regional Selector */}
          {(fromUnit === 'Bigha' || fromUnit === 'Biswa' || toUnit === 'Bigha' || toUnit === 'Biswa') && (
            <div className="p-4 bg-[#002366]/5 rounded-2xl border border-[#002366]/10 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-[#002366] uppercase tracking-wider mb-3 block">Select State for Bigha/Biswa</label>
              <div className="flex flex-wrap gap-2">
                {(['UP', 'Rajasthan', 'Bihar', 'Punjab'] as State[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setState(s)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                      state === s 
                        ? "bg-[#002366] text-white shadow-md" 
                        : "bg-white text-slate-600 hover:bg-[#002366]/10"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result Section */}
          <div className="pt-8 border-t border-slate-100">
            <div className="bg-slate-900 rounded-3xl p-8 text-center space-y-2 shadow-2xl shadow-slate-900/20">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Result</p>
              <h2 className="text-5xl font-black text-white">
                {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </h2>
              <p className="text-[#002366] font-bold text-lg">{toUnit}</p>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
          >
            <MessageCircle className="w-6 h-6" />
            Share Calculation
          </button>
        </div>
      </div>
    </div>
  );
}
