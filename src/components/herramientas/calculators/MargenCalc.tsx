import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const MargenCalc = () => {
  const [rendimiento, setRendimiento] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [costoSemilla, setCostoSemilla] = useState('');
  const [costoFert, setCostoFert] = useState('');
  const [costoFito, setCostoFito] = useState('');
  const [costoLabores, setCostoLabores] = useState('');
  const [costoFlete, setCostoFlete] = useState('');
  const [result, setResult] = useState<{ ingreso: number; costoTotal: number; margen: number; rentabilidad: number } | null>(null);

  const calcular = () => {
    const rend = parseFloat(rendimiento) || 0;
    const pv = parseFloat(precioVenta) || 0;
    const cs = parseFloat(costoSemilla) || 0;
    const cf = parseFloat(costoFert) || 0;
    const cfi = parseFloat(costoFito) || 0;
    const cl = parseFloat(costoLabores) || 0;
    const cfl = parseFloat(costoFlete) || 0;

    const ingreso = rend * pv;
    const costoTotal = cs + cf + cfi + cl + cfl;
    const margen = ingreso - costoTotal;
    const rentabilidad = costoTotal > 0 ? (margen / costoTotal) * 100 : 0;

    setResult({
      ingreso: Math.round(ingreso),
      costoTotal: Math.round(costoTotal),
      margen: Math.round(margen),
      rentabilidad: Math.round(rentabilidad),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Rendimiento (Ton/ha):</label>
          <Input type="number" value={rendimiento} onChange={(e) => setRendimiento(e.target.value)} placeholder="3" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Precio venta (USD/Ton):</label>
          <Input type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} placeholder="380" />
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground">Costos (USD/ha):</p>
      <div className="grid grid-cols-2 gap-3">
        <Input type="number" value={costoSemilla} onChange={(e) => setCostoSemilla(e.target.value)} placeholder="Semilla" />
        <Input type="number" value={costoFert} onChange={(e) => setCostoFert(e.target.value)} placeholder="Fertilizante" />
        <Input type="number" value={costoFito} onChange={(e) => setCostoFito(e.target.value)} placeholder="Fitosanitarios" />
        <Input type="number" value={costoLabores} onChange={(e) => setCostoLabores(e.target.value)} placeholder="Labores" />
        <Input type="number" value={costoFlete} onChange={(e) => setCostoFlete(e.target.value)} placeholder="Flete/Acopio" />
      </div>
      <Button onClick={calcular} className="w-full">Calcular Margen</Button>
      {result && (
        <div className="rounded-lg bg-accent/10 p-3 space-y-1 text-sm">
          <p><span className="font-semibold">Ingreso bruto:</span> ${result.ingreso} USD/ha</p>
          <p><span className="font-semibold">Costo total:</span> ${result.costoTotal} USD/ha</p>
          <p className={`font-bold ${result.margen >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Margen neto: ${result.margen} USD/ha ({result.rentabilidad}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default MargenCalc;
