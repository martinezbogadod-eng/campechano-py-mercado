import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RiegoAspersionCalc = () => {
  const [numAspersores, setNumAspersores] = useState('10');
  const [caudalAspersor, setCaudalAspersor] = useState('1500');
  const [distAspersores, setDistAspersores] = useState('12');
  const [distLaterales, setDistLaterales] = useState('12');
  const [result, setResult] = useState<{ caudalTotal: number; cobertura: number; lamina: number } | null>(null);

  const calcular = () => {
    const n = parseFloat(numAspersores);
    const ca = parseFloat(caudalAspersor);
    const da = parseFloat(distAspersores);
    const dl = parseFloat(distLaterales);
    if ([n, ca, da, dl].some(isNaN)) return;

    const caudalTotal = n * ca;
    const coberturaPorAspersor = da * dl;
    const coberturaTotal = n * coberturaPorAspersor;
    const lamina = (caudalTotal / coberturaTotal) * 1; // mm/hora

    setResult({
      caudalTotal: Math.round(caudalTotal),
      cobertura: Math.round(coberturaTotal),
      lamina: Math.round(lamina * 100) / 100,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Nº aspersores:</label>
          <Input type="number" value={numAspersores} onChange={(e) => setNumAspersores(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Caudal c/u (L/h):</label>
          <Input type="number" value={caudalAspersor} onChange={(e) => setCaudalAspersor(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Dist. aspersores (m):</label>
          <Input type="number" value={distAspersores} onChange={(e) => setDistAspersores(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Dist. laterales (m):</label>
          <Input type="number" value={distLaterales} onChange={(e) => setDistLaterales(e.target.value)} />
        </div>
      </div>
      <Button onClick={calcular} className="w-full">Calcular</Button>
      {result && (
        <div className="rounded-lg bg-accent/10 p-3 space-y-1 text-sm">
          <p><span className="font-semibold">Caudal total:</span> {result.caudalTotal.toLocaleString()} L/h</p>
          <p><span className="font-semibold">Cobertura:</span> {result.cobertura.toLocaleString()} m²</p>
          <p><span className="font-semibold">Lámina aplicada:</span> {result.lamina} mm/h</p>
        </div>
      )}
    </div>
  );
};

export default RiegoAspersionCalc;
