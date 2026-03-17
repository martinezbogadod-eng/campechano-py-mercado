import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import { useListings } from '@/hooks/useListings';
import { useLanguage } from '@/hooks/useLanguage';
import { Category, CATEGORIES } from '@/types/listing';
import { Search, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { CategoryIcon } from '@/components/CategoryIcon';

const CATEGORY_DATA: {
  key: Category;
  slug: string;
  descKey: string;
  image: string;
}[] = [
  {
    key: 'granos',
    slug: 'granos-cereales',
    descKey: 'category.desc.granos',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
  },
  {
    key: 'frutas-verduras',
    slug: 'frutas-verduras',
    descKey: 'category.desc.frutas-verduras',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
  },
  {
    key: 'ganaderia',
    slug: 'ganaderia',
    descKey: 'category.desc.ganaderia',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80',
  },
  {
    key: 'maquinaria',
    slug: 'maquinaria',
    descKey: 'category.desc.maquinaria',
    image: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=600&q=80',
  },
  {
    key: 'insumos',
    slug: 'insumos-agricolas',
    descKey: 'category.desc.insumos',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  },
  {
    key: 'servicios',
    slug: 'servicios',
    descKey: 'category.desc.servicios',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=80',
  },
  {
    key: 'forestal',
    slug: 'forestal',
    descKey: 'category.desc.forestal',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=80',
  },
  {
    key: 'viveros',
    slug: 'viveros',
    descKey: 'category.desc.viveros',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
  },
];

const STEP_KEYS = [
  { icon: Search, titleKey: 'home.step1Title', descKey: 'home.step1Desc' },
  { icon: MessageSquare, titleKey: 'home.step2Title', descKey: 'home.step2Desc' },
  { icon: ShieldCheck, titleKey: 'home.step3Title', descKey: 'home.step3Desc' },
];

const Index = () => {
  const { data: dbListings } = useListings();
  const { t } = useLanguage();

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
              {t('home.exploreCategories')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t('home.exploreCategoriesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORY_DATA.map((cat) => {
              const info = CATEGORIES[cat.key];
              const count = countByCategory(cat.key);
              const countText = t('home.listingsCount')
                .replace('{count}', String(count))
                .replace('{plural}', count !== 1 ? 's' : '');

              return (
                <Link
                  key={cat.key}
                  to={`/categoria/${cat.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_24px_hsl(var(--primary)/0.15)] hover:border-primary"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={t(`category.${cat.key}`)}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <CategoryIcon name={info.icon} className="absolute top-3 left-3 h-6 w-6 text-white drop-shadow" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {t(`category.${cat.key}`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {t(cat.descKey)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                        {countText}
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
                {t('home.howItWorks')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t('home.howItWorksDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {STEP_KEYS.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{t(step.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container text-center">
          <p className="text-base font-semibold text-primary mb-2">
            Conectamos al campo paraguayo
          </p>
          <p className="text-xs text-muted-foreground">
            {t('home.footer')}
          </p>
          <Link to="/terminos" className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors mt-1 inline-block">
            {t('home.terms')}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Index;
