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
import { useLanguage } from '@/hooks/useLanguage';

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
  { image: imgSuperficie, titleKey: 'tools.superficie', descKey: 'tools.superficieDesc', component: SuperficieCalc },
  { image: imgRendimiento, titleKey: 'tools.rendimiento', descKey: 'tools.rendimientoDesc', component: RendimientoCalc },
  { image: imgPesoVolumen, titleKey: 'tools.pesoVolumen', descKey: 'tools.pesoVolumenDesc', component: PesoVolumenCalc },
  { image: imgRiegoGoteo, titleKey: 'tools.riegoGoteo', descKey: 'tools.riegoGoteoDesc', component: RiegoGoteoCalc },
  { image: imgPulverizacion, titleKey: 'tools.pulverizacion', descKey: 'tools.pulverizacionDesc', component: PulverizacionCalc },
  { image: imgFertilizacion, titleKey: 'tools.fertilizacion', descKey: 'tools.fertilizacionDesc', component: FertilizacionCalc },
  { image: imgDensidadSiembra, titleKey: 'tools.densidadSiembra', descKey: 'tools.densidadSiembraDesc', component: DensidadSiembraCalc },
  { image: imgRiegoAspersion, titleKey: 'tools.riegoAspersion', descKey: 'tools.riegoAspersionDesc', component: RiegoAspersionCalc },
  { image: imgMargen, titleKey: 'tools.margen', descKey: 'tools.margenDesc', component: MargenCalc },
  { image: imgSilo, titleKey: 'tools.silo', descKey: 'tools.siloDesc', component: SiloCalc },
];

const Herramientas = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const { t } = useLanguage();

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
            {t('tools.heroTitle')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/90 drop-shadow">
            {t('tools.heroSubtitle')}
          </p>

          <LivePricesWidget />
        </div>
      </div>

      <main className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">{t('tools.breadcrumbHome')}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{t('tools.breadcrumb')}</span>
        </nav>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool, i) => (
            <ToolCard key={i} image={tool.image} title={t(tool.titleKey)} description={t(tool.descKey)}>
              <tool.component />
            </ToolCard>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8 mt-8">
        <div className="container text-center">
          <p className="text-base font-semibold text-primary mb-2">
            {t('tools.footerSlogan')}
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t('tools.footerCopy')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Herramientas;
