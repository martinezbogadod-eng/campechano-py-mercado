import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import { useListings } from '@/hooks/useListings';
import { Category, CATEGORIES } from '@/types/listing';
import { Search, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

const CATEGORY_DATA: {
  key: Category;
  slug: string;
  description: string;
  image: string;
}[] = [
  {
    key: 'granos',
    slug: 'granos-cereales',
    description: 'Soja, maíz, trigo, girasol y más',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
  },
  {
    key: 'frutas-verduras',
    slug: 'frutas-verduras',
    description: 'Productos frescos del campo paraguayo',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
  },
  {
    key: 'ganaderia',
    slug: 'ganaderia',
    description: 'Ganado vacuno, porcino, avícola y más',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80',
  },
  {
    key: 'maquinaria',
    slug: 'maquinaria',
    description: 'Tractores, implementos y equipos agrícolas',
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=600&q=80',
  },
  {
    key: 'insumos',
    slug: 'insumos-agricolas',
    description: 'Fertilizantes, agroquímicos y semillas',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  },
  {
    key: 'servicios',
    slug: 'servicios',
    description: 'Pulverización, siembra, cosecha y asesoría',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80',
  },
  {
    key: 'forestal',
    slug: 'forestal',
    description: 'Madera, plantines y productos forestales',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=80',
  },
  {
    key: 'viveros',
    slug: 'viveros',
    description: 'Plantas ornamentales, frutales y forestales',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
  },
];

const STEPS = [
  {
    icon: Search,
    title: 'Explorá',
    description: 'Navegá por categorías y encontrá lo que necesitás para tu campo.',
  },
  {
    icon: MessageSquare,
    title: 'Conectá',
    description: 'Contactá directamente al vendedor por chat o WhatsApp.',
  },
  {
    icon: ShieldCheck,
    title: 'Transaccioná',
    description: 'Acordá las condiciones y cerrá el trato de forma segura.',
  },
];

const Index = () => {
  const { data: dbListings } = useListings();

  // Count listings per category
  const countByCategory = (cat: Category) =>
    dbListings?.filter((l) => l.category === cat).length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero carousel */}
        <div className="container py-6">
          <HeroCarousel />
        </div>

        {/* Categories grid */}
        <section className="container py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3">
              Explorá nuestras categorías
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Encontrá productos, insumos y servicios para el sector agrícola paraguayo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORY_DATA.map((cat) => {
              const info = CATEGORIES[cat.key];
              const count = countByCategory(cat.key);

              return (
                <Link
                  key={cat.key}
                  to={`/categoria/${cat.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_hsl(var(--primary)/0.15)] hover:border-primary"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={info.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <CategoryIcon name={info.icon} className="absolute top-3 left-3 h-6 w-6 text-white drop-shadow" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {info.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                        {count} anuncio{count !== 1 ? 's' : ''}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-3">
                ¿Cómo funciona?
              </h2>
              <p className="text-muted-foreground text-lg">
                Tres pasos simples para conectar con el campo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {STEPS.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 KAMPS PY — KAMPS PY es una plataforma de interconexión. Las transacciones son responsabilidad exclusiva de los usuarios.
          </p>
          <Link to="/terminos" className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors mt-1 inline-block">
            Términos y Condiciones
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
