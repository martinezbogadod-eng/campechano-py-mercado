import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// All relative to kg
const UNITS: Record<string, number> = {
  'Kilogramos': 1,
  'Toneladas': 1000,
  'Quintales': 100,
  'Arrobas': 15,
  'Sacos 50kg': 50,
  'Sacos 60kg': 60,
  'Libras': 0.453592,
  'Bushels (Soja 60lb)': 27.2155,
  'Bushels (Maíz 56lb)': 25.4012,
};

const PesoVolumenCalc = () => {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('Kilogramos');
  const [to, setTo] = useState('Toneladas');
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const inKg = num * UNITS[from];
    const converted = inKg / UNITS[to];
    setResult(`${num} ${from} = ${converted.toFixed(4)} ${to}`);
  };

  return (
    <div className="space-y-4">
      <Input type="number" placeholder="Ingresá un valor" value={value} onChange={(e) => setValue(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">De:</label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(UNITS).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">A:</label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(UNITS).map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={convert} className="w-full">Convertir</Button>
      {result && <div className="rounded-lg bg-accent/10 p-3 text-center font-semibold text-accent">{result}</div>}
    </div>
  );
};

export default PesoVolumenCalc;
