import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PulverizacionCalc = () => {
  const [volumenHa, setVolumenHa] = useState('100');
  const [dosisProducto, setDosisProducto] = useState('2');
  const [capacidadTanque, setCapacidadTanque] = useState('2000');
  const [result, setResult] = useState<{ productoTanque: number; tanquesHa: number; superficieTanque: number } | null>(null);

  const calcular = () => {
    const vh = parseFloat(volumenHa);
    const dp = parseFloat(dosisProducto);
    const ct = parseFloat(capacidadTanque);
    if ([vh, dp, ct].some(isNaN) || vh === 0) return;

    const superficieTanque = ct / vh;
    const productoTanque = dp * superficieTanque;
    const tanquesHa = vh / ct;

    setResult({
      productoTanque: Math.round(productoTanque * 100) / 100,
      tanquesHa: Math.round(tanquesHa * 100) / 100,
      superficieTanque: Math.round(superficieTanque * 100) / 100,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Volumen de caldo (L/ha):</label>
        <Input type="number" value={volumenHa} onChange={(e) => setVolumenHa(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Dosis del producto (L o kg/ha):</label>
        <Input type="number" value={dosisProducto} onChange={(e) => setDosisProducto(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Capacidad del tanque (L):</label>
        <Input type="number" value={capacidadTanque} onChange={(e) => setCapacidadTanque(e.target.value)} />
      </div>
      <Button onClick={calcular} className="w-full">Calcular</Button>
      {result && (
        <div className="rounded-lg bg-accent/10 p-3 space-y-1 text-sm">
          <p><span className="font-semibold">Superficie por tanque:</span> {result.superficieTanque} ha</p>
          <p><span className="font-semibold">Producto por tanque:</span> {result.productoTanque} L/kg</p>
          <p><span className="font-semibold">Tanques por ha:</span> {result.tanquesHa}</p>
        </div>
      )}
    </div>
  );
};

export default PulverizacionCalc;
