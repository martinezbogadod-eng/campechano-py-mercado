import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RiegoGoteoCalc = () => {
  const [area, setArea] = useState('');
  const [distLineas, setDistLineas] = useState('1.5');
  const [distEmisores, setDistEmisores] = useState('0.3');
  const [caudalEmisor, setCaudalEmisor] = useState('2');
  const [result, setResult] = useState<{ emisores: number; caudalTotal: number; tiempoRiego: number } | null>(null);

  const calcular = () => {
    const a = parseFloat(area);
    const dl = parseFloat(distLineas);
    const de = parseFloat(distEmisores);
    const ce = parseFloat(caudalEmisor);
    if ([a, dl, de, ce].some(isNaN)) return;

    const areaM2 = a * 10000;
    const lineas = areaM2 / (dl * (areaM2 / dl));
    const emisoresPorLinea = (Math.sqrt(areaM2) / de);
    const totalEmisores = Math.round(areaM2 / (dl * de));
    const caudalTotal = totalEmisores * ce;
    const tiempoRiego = (5 * areaM2) / (caudalTotal * 1); // 5mm de lámina

    setResult({
      emisores: totalEmisores,
      caudalTotal: Math.round(caudalTotal),
      tiempoRiego: Math.round(tiempoRiego * 10) / 10,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Área (ha):</label>
          <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="1" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Dist. líneas (m):</label>
          <Input type="number" value={distLineas} onChange={(e) => setDistLineas(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Dist. emisores (m):</label>
          <Input type="number" value={distEmisores} onChange={(e) => setDistEmisores(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Caudal emisor (L/h):</label>
          <Input type="number" value={caudalEmisor} onChange={(e) => setCaudalEmisor(e.target.value)} />
        </div>
      </div>
      <Button onClick={calcular} className="w-full">Calcular</Button>
      {result && (
        <div className="rounded-lg bg-accent/10 p-3 space-y-1 text-sm">
          <p><span className="font-semibold">Emisores totales:</span> {result.emisores.toLocaleString()}</p>
          <p><span className="font-semibold">Caudal total:</span> {result.caudalTotal.toLocaleString()} L/h</p>
          <p><span className="font-semibold">Tiempo para 5mm:</span> ~{result.tiempoRiego} horas</p>
        </div>
      )}
    </div>
  );
};

export default RiegoGoteoCalc;
