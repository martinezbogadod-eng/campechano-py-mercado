import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FERTILIZANTES = {
  'Urea': { N: 46, P: 0, K: 0 },
  'DAP': { N: 18, P: 46, K: 0 },
  'MAP': { N: 11, P: 52, K: 0 },
  'KCl': { N: 0, P: 0, K: 60 },
  'SFT': { N: 0, P: 46, K: 0 },
};

const FertilizacionCalc = () => {
  const [nNeed, setNNeed] = useState('');
  const [pNeed, setPNeed] = useState('');
  const [kNeed, setKNeed] = useState('');
  const [result, setResult] = useState<Record<string, number> | null>(null);

  const calcular = () => {
    const n = parseFloat(nNeed) || 0;
    const p = parseFloat(pNeed) || 0;
    const k = parseFloat(kNeed) || 0;

    const results: Record<string, number> = {};

    // Simple approach: Urea for N, DAP for P (contributes some N), KCl for K
    const dapKg = p > 0 ? (p / 46) * 100 : 0;
    const nFromDap = (dapKg * 18) / 100;
    const remainingN = Math.max(0, n - nFromDap);
    const ureaKg = remainingN > 0 ? (remainingN / 46) * 100 : 0;
    const kclKg = k > 0 ? (k / 60) * 100 : 0;

    if (dapKg > 0) results['DAP (18-46-0)'] = Math.round(dapKg);
    if (ureaKg > 0) results['Urea (46-0-0)'] = Math.round(ureaKg);
    if (kclKg > 0) results['KCl (0-0-60)'] = Math.round(kclKg);

    setResult(results);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Ingresá los kg/ha de nutriente requeridos:</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">N (kg/ha):</label>
          <Input type="number" value={nNeed} onChange={(e) => setNNeed(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">P₂O₅ (kg/ha):</label>
          <Input type="number" value={pNeed} onChange={(e) => setPNeed(e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">K₂O (kg/ha):</label>
          <Input type="number" value={kNeed} onChange={(e) => setKNeed(e.target.value)} placeholder="0" />
        </div>
      </div>
      <Button onClick={calcular} className="w-full">Calcular Mezcla</Button>
      {result && Object.keys(result).length > 0 && (
        <div className="rounded-lg bg-accent/10 p-3 space-y-1 text-sm">
          <p className="font-semibold mb-2">Fertilizantes necesarios (kg/ha):</p>
          {Object.entries(result).map(([name, qty]) => (
            <p key={name}><span className="font-medium">{name}:</span> {qty} kg/ha</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FertilizacionCalc;
