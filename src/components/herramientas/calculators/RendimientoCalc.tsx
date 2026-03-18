import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CULTIVOS: Record<string, number> = {
  'Soja': 60,
  'Maíz': 56,
  'Trigo': 60,
};

// All conversions go through kg/ha as base
const UNITS: Record<string, (kgHa: number, pesoSaco: number) => number> = {
  'kg/ha': (v) => v,
  'Ton/ha': (v) => v / 1000,
  'Tn/Alqueire (BR)': (v) => (v / 1000) * 2.42,
  'Sacos 50kg/ha (PY)': (v) => v / 50,
  'Sacos 60kg/Alq (BR)': (v) => (v / 60) * 2.42,
  'Bushel/acre': (v, ps) => (v / (ps * 0.0359237)) / 2.47105,
};

const FROM_TO_KGHA: Record<string, (v: number, pesoSaco: number) => number> = {
  'kg/ha': (v) => v,
  'Ton/ha': (v) => v * 1000,
  'Tn/Alqueire (BR)': (v) => (v * 1000) / 2.42,
  'Sacos 50kg/ha (PY)': (v) => v * 50,
  'Sacos 60kg/Alq (BR)': (v) => (v * 60) / 2.42,
  'Bushel/acre': (v, ps) => v * (ps * 0.0359237) * 2.47105,
};

const unitNames = Object.keys(UNITS);

const RendimientoCalc = () => {
  const [cultivo, setCultivo] = useState('Soja');
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('kg/ha');
  const [to, setTo] = useState('Ton/ha');
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const ps = CULTIVOS[cultivo];
    const kgHa = FROM_TO_KGHA[from](num, ps);
    const converted = UNITS[to](kgHa, ps);
    setResult(`${num} ${from} = ${converted.toFixed(4)} ${to}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Cultivo:</label>
        <Select value={cultivo} onValueChange={setCultivo}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.keys(CULTIVOS).map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        type="number"
        placeholder="Ingresá un valor"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">De:</label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {unitNames.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">A:</label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {unitNames.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={convert} className="w-full">Convertir</Button>
      {result && (
        <div className="rounded-lg bg-accent/10 p-3 text-center font-semibold text-accent">
          {result}
        </div>
      )}
      <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        <p className="font-semibold mb-1">💡 Referencia Soja:</p>
        <p>Paraguay: 2.5-3.5 Ton/ha (10-14 Tn/Alq)</p>
        <p>Brasil alto: 18-25 Tn/Alq (7-10 Ton/ha)</p>
      </div>
    </div>
  );
};

export default RendimientoCalc;
