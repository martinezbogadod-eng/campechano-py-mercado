import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CULTIVOS: Record<string, { pesoMil: number; germinacion: number }> = {
  'Soja': { pesoMil: 170, germinacion: 85 },
  'Maíz': { pesoMil: 330, germinacion: 92 },
  'Trigo': { pesoMil: 40, germinacion: 88 },
  'Girasol': { pesoMil: 70, germinacion: 85 },
};

const DensidadSiembraCalc = () => {
  const [cultivo, setCultivo] = useState('Soja');
  const [plantasM2, setPlantasM2] = useState('30');
  const [germinacion, setGerminacion] = useState('');
  const [result, setResult] = useState<{ semillasHa: number; kgHa: number } | null>(null);

  const calcular = () => {
    const plantas = parseFloat(plantasM2);
    if (isNaN(plantas)) return;
    const info = CULTIVOS[cultivo];
    const germ = parseFloat(germinacion) || info.germinacion;

    const semillasHa = Math.round((plantas * 10000) / (germ / 100));
    const kgHa = Math.round((semillasHa * info.pesoMil) / 1000000 * 100) / 100;

    setResult({ semillasHa, kgHa });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Cultivo:</label>
        <Select value={cultivo} onValueChange={setCultivo}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.keys(CULTIVOS).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Plantas deseadas/m²:</label>
          <Input type="number" value={plantasM2} onChange={(e) => setPlantasM2(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Germinación (%):</label>
          <Input type="number" value={germinacion} onChange={(e) => setGerminacion(e.target.value)} placeholder={String(CULTIVOS[cultivo].germinacion)} />
        </div>
      </div>
      <Button onClick={calcular} className="w-full">Calcular</Button>
      {result && (
        <div className="rounded-lg bg-accent/10 p-3 space-y-1 text-sm">
          <p><span className="font-semibold">Semillas/ha:</span> {result.semillasHa.toLocaleString()}</p>
          <p><span className="font-semibold">kg semilla/ha:</span> {result.kgHa}</p>
        </div>
      )}
    </div>
  );
};

export default DensidadSiembraCalc;
