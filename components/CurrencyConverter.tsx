
import React, { useState, useEffect } from 'react';

interface CurrencyConverterProps {
  onClose: () => void;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ onClose }) => {
  const [amount, setAmount] = useState<string>('100');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'RUB'>('USD');
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Fetch Live Rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/GEL');
        const data = await res.json();
        
        if (data && data.rates) {
          setRates({
            USD: data.rates.USD,
            EUR: data.rates.EUR,
            RUB: data.rates.RUB
          });
          // Format date
          const date = new Date(data.time_last_update_utc);
          setLastUpdated(date.toLocaleDateString());
        }
      } catch (e) {
        console.error("Failed to fetch rates", e);
        // Fallback rates if offline
        setRates({ USD: 0.37, EUR: 0.34, RUB: 33.5 }); 
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const rate = rates ? rates[currency] : 0;
  const converted = (parseFloat(amount || '0') * rate).toFixed(2);

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
        
        {/* Close Overlay */}
        <div className="absolute inset-0" onClick={onClose}></div>

        <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative animate-slide-up border border-white/40">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-slate-900 font-serif">Lari Lens</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                       {loading ? 'Syncing...' : `Live Rates • ${lastUpdated}`}
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                    ✕
                </button>
            </div>

            {/* Currency Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                {(['USD', 'EUR', 'RUB'] as const).map((c) => (
                    <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${currency === c ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Calculator */}
            <div className="flex flex-col gap-4">
                {/* Input GEL */}
                <div className="relative">
                    <label className="absolute top-3 left-4 text-[10px] font-bold text-slate-400">GEL (₾)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pt-7 pb-3 px-4 text-3xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        placeholder="0"
                    />
                </div>

                <div className="flex items-center justify-center -my-2 z-10">
                    <div className="bg-white border border-slate-200 rounded-full p-1.5 shadow-sm text-slate-300 text-xs">
                        ⬇️
                    </div>
                </div>

                {/* Output Target */}
                <div className="relative">
                    <label className="absolute top-3 left-4 text-[10px] font-bold text-emerald-600">{currency}</label>
                    <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pt-7 pb-3 px-4 text-3xl font-black text-emerald-700">
                        {loading ? <span className="text-lg opacity-50">...</span> : converted}
                    </div>
                </div>
            </div>

            {/* Quick Reference */}
            <div className="mt-6 text-center bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 font-bold">
                    100 GEL ≈ {rates ? (100 * rates[currency]).toFixed(0) : '...'} {currency}
                </p>
            </div>

        </div>
    </div>
  );
};

export default CurrencyConverter;
