import Header from '@/components/Header';
import ToolCard from '@/components/herramientas/ToolCard';
import LivePricesWidget from '@/components/herramientas/LivePricesWidget';
import SuperficieCalc from '@/components/herramientas/calculators/SuperficieCalc';
import RendimientoCalc from '@/components/herramientas/calculators/RendimientoCalc';
import PesoVolumenCalc from '@/components/herramientas/calculators/PesoVolumenCalc';
import RiegoGoteoCalc from '@/components/herramientas/calculators/RiegoGoteoCalc';
import PulverizacionCalc from '@/components/herramientas/calculators/PulverizacionCalc';
import FertilizacionCalc from '@/components/herramientas/calculators/FertilizacionCalc';
import DensidadSiembraCalc from '@/components/herramientas/calculators/DensidadSiembraCalc';
import RiegoAspersionCalc from '@/components/herramientas/calculators/RiegoAspersionCalc';
import MargenCalc from '@/components/herramientas/calculators/MargenCalc';
import SiloCalc from '@/components/herramientas/calculators/SiloCalc';
import { Link } from 'react-router-dom';
import { ChevronRight, Wrench } from 'lucide-react';

const TOOLS = [
  { icon: '📏', title: 'Medidas de Superficie', desc: 'Hectáreas, acres, alqueires, cuadras', component: SuperficieCalc },
  { icon: '🌾', title: 'Rendimiento de Cultivo', desc: 'kg/ha, Tn/Alqueire, sacos, bushels', component: RendimientoCalc },
  { icon: '📦', title: 'Peso y Volumen', desc: 'Bushel, kg, sacos, quintales, arrobas', component: PesoVolumenCalc },
  { icon: '💧', title: 'Riego por Goteo', desc: 'Diseño de sistema, emisores, caudal', component: RiegoGoteoCalc },
  { icon: '🧪', title: 'Caldo de Pulverización', desc: 'Mezcla, dosis, calibración', component: PulverizacionCalc },
  { icon: '🌱', title: 'Fertilización NPK', desc: 'Cálculo de mezclas DAP, Urea, KCl', component: FertilizacionCalc },
  { icon: '🌾', title: 'Densidad de Siembra', desc: 'Semillas/ha, kg semilla, plantas/m²', component: DensidadSiembraCalc },
  { icon: '🌧️', title: 'Riego por Aspersión', desc: 'Aspersores, caudal, cobertura', component: RiegoAspersionCalc },
  { icon: '💰', title: 'Calculadora de Margen', desc: 'Costos, ingresos, ganancia neta', component: MargenCalc },
  { icon: '🏭', title: 'Capacidad de Silo', desc: 'Volumen, toneladas, sacos', component: SiloCalc },
];

const Herramientas = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative h-[300px] sm:h-[400px] overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Wrench className="h-10 w-10 text-white mb-3" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Herramientas Agrícolas
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/90 drop-shadow">
            Calculadoras y conversiones para el campo paraguayo
          </p>

          <LivePricesWidget />
        </div>
      </div>

      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">Herramientas</span>
        </nav>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool, i) => (
            <ToolCard key={i} icon={tool.icon} title={tool.title} description={tool.desc}>
              <tool.component />
            </ToolCard>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8 mt-8">
        <div className="container text-center">
          <p className="text-base font-semibold text-primary mb-2">
            Conectamos al Campo Paraguayo
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kamps Py — Mercado Agrícola Digital
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Herramientas;
