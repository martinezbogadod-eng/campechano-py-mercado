import { useState, useEffect } from 'react';
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

import imgSuperficie from '@/assets/tools/superficie.jpg';
import imgRendimiento from '@/assets/tools/rendimiento.jpg';
import imgPesoVolumen from '@/assets/tools/peso-volumen.jpg';
import imgRiegoGoteo from '@/assets/tools/riego-goteo.jpg';
import imgPulverizacion from '@/assets/tools/pulverizacion.jpg';
import imgFertilizacion from '@/assets/tools/fertilizacion.jpg';
import imgDensidadSiembra from '@/assets/tools/densidad-siembra.jpg';
import imgRiegoAspersion from '@/assets/tools/riego-aspersion.jpg';
import imgMargen from '@/assets/tools/margen.jpg';
import imgSilo from '@/assets/tools/silo.jpg';

import heroSoja from '@/assets/hero-tools/soja.jpg';
import heroMaiz from '@/assets/hero-tools/maiz.jpg';
import heroSorgo from '@/assets/hero-tools/sorgo.jpg';
import heroGirasol from '@/assets/hero-tools/girasol.jpg';
import heroEucaliptos from '@/assets/hero-tools/eucaliptos.jpg';
import heroNelore from '@/assets/hero-tools/nelore.jpg';

const HERO_IMAGES = [heroSoja, heroMaiz, heroSorgo, heroGirasol, heroEucaliptos, heroNelore];

const TOOLS = [
  { image: imgSuperficie, title: 'Medidas de Superficie', desc: 'Hectáreas, acres, alqueires, cuadras', component: SuperficieCalc },
  { image: imgRendimiento, title: 'Rendimiento de Cultivo', desc: 'kg/ha, Tn/Alqueire, sacos, bushels', component: RendimientoCalc },
  { image: imgPesoVolumen, title: 'Peso y Volumen', desc: 'Bushel, kg, sacos, quintales, arrobas', component: PesoVolumenCalc },
  { image: imgRiegoGoteo, title: 'Riego por Goteo', desc: 'Diseño de sistema, emisores, caudal', component: RiegoGoteoCalc },
  { image: imgPulverizacion, title: 'Caldo de Pulverización', desc: 'Mezcla, dosis, calibración', component: PulverizacionCalc },
  { image: imgFertilizacion, title: 'Fertilización NPK', desc: 'Cálculo de mezclas DAP, Urea, KCl', component: FertilizacionCalc },
  { image: imgDensidadSiembra, title: 'Densidad de Siembra', desc: 'Semillas/ha, kg semilla, plantas/m²', component: DensidadSiembraCalc },
  { image: imgRiegoAspersion, title: 'Riego por Aspersión', desc: 'Aspersores, caudal, cobertura', component: RiegoAspersionCalc },
  { image: imgMargen, title: 'Calculadora de Margen', desc: 'Costos, ingresos, ganancia neta', component: MargenCalc },
  { image: imgSilo, title: 'Capacidad de Silo', desc: 'Volumen, toneladas, sacos', component: SiloCalc },
];

const Herramientas = () => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero with dynamic background */}
      <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === currentBg ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
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
            <ToolCard key={i} image={tool.image} title={tool.title} description={tool.desc}>
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
