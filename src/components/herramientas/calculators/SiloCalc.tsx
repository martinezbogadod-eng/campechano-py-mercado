import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DENSIDADES: Record<string, number> = {
  'Soja': 720,
  'Maíz': 740,
  'Trigo': 760,
  'Arroz': 680,
  'Girasol': 400,
};

const SiloCalc = () => {
  const [diametro, setDiametro] = useState('');
  const [altura, setAltura] = useState('');
  const [grano, setGrano] = useState('Soja');
  const [result, setResult] = useState<{ volumen: number; toneladas: number; sacos: number } | null>(null);

  const calcular = () => {
    const d = parseFloat(diametro);
    const h = parseFloat(altura);
    if (isNaN(d) || isNaN(h)) return;

    const radio = d / 2;
    const volumen = Math.PI * radio * radio * h;
    const densidad = DENSIDADES[grano];
    const toneladas = (volumen * densidad) / 1000;
    const sacos = (toneladas * 1000) / 50;

    setResult({
      volumen: Math.round(volumen * 100) / 100,
      toneladas: Math.round(toneladas * 100) / 100,
      sacos: Math.round(sacos),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Diámetro (m):</label>
          <Input type="number" value={diametro} onChange={(e) => setDiametro(e.target.value)} placeholder="10" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Altura (m):</label>
          <Input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="15" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Grano:</label>
        <Select value={grano} onValueChange={setGrano}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.keys(DENSIDADES).map((g) => <SelectItem key={g} value={g}>{g} ({DENSIDADES[g]} kg/m³)</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calcular} className="w-full">Calcular Capacidad</Button>
      {result && (
        <div className="rounded-lg bg-accent/10 p-3 space-y-1 text-sm">
          <p><span className="font-semibold">Volumen:</span> {result.volumen.toLocaleString()} m³</p>
          <p><span className="font-semibold">Capacidad:</span> {result.toneladas.toLocaleString()} toneladas</p>
          <p><span className="font-semibold">Equivalente:</span> {result.sacos.toLocaleString()} sacos de 50kg</p>
        </div>
      )}
    </div>
  );
};

export default SiloCalc;
