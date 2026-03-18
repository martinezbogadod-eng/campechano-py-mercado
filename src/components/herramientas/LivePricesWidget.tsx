import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const CHICAGO_PRICES = [
  { nameKey: 'Soja', price: 382.58, change: 0.5, up: true },
  { nameKey: 'Maíz', price: 165.75, change: -0.7, up: false },
];

const PARAGUAY_PRICES = [
  { nameKey: 'Soja', price: 379.0 },
  { nameKey: 'Maíz', price: 175.0 },
];

const LivePricesWidget = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-6 w-full max-w-3xl rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          📊 {t('tools.livePrices')}
        </h3>
        <span className="text-white/60 text-xs">
          {t('tools.updatedAgo')}{' '}
          <span className="inline-block animate-pulse text-accent">●</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Chicago */}
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-white/80 text-xs font-semibold mb-2">🌎 CHICAGO (CBOT)</p>
          <div className="space-y-1.5">
            {CHICAGO_PRICES.map((item) => (
              <div key={item.nameKey} className="flex items-center justify-between">
                <span className="text-white text-sm">{item.nameKey}</span>
                <span
                  className={`text-sm font-bold flex items-center gap-1 ${
                    item.up ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ${item.price.toFixed(2)}{' '}
                  {item.up ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Paraguay */}
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-white/80 text-xs font-semibold mb-2">🇵🇾 PARAGUAY (Asunción)</p>
          <div className="space-y-1.5">
            {PARAGUAY_PRICES.map((item) => (
              <div key={item.nameKey} className="flex items-center justify-between">
                <span className="text-white text-sm">{item.nameKey}</span>
                <span className="text-white text-sm font-bold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-white/40 text-xs text-center mt-2">{t('tools.pricesUnit')}</p>
    </div>
  );
};

export default LivePricesWidget;
