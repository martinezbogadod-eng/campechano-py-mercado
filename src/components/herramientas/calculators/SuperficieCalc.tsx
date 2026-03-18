import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UNITS: Record<string, number> = {
  'Hectáreas': 1,
  'Acres': 2.47105,
  'Alqueires paulistas': 0.41322,
  'Alqueires mineiros': 0.20661,
  'Cuadras paraguayas': 0.571429,
  'Metros cuadrados': 10000,
};

const SuperficieCalc = () => {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('Hectáreas');
  const [to, setTo] = useState('Acres');
  const [result, setResult] = useState<string | null>(null);

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const inHa = num / UNITS[from];
    const converted = inHa * UNITS[to];
    setResult(`${num} ${from} = ${converted.toFixed(4)} ${to}`);
  };

  return (
    <div className="space-y-4">
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
              {Object.keys(UNITS).map((u) => (
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
              {Object.keys(UNITS).map((u) => (
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
    </div>
  );
};

export default SuperficieCalc;
