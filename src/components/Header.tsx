import { Leaf } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-foreground">
              Campechano Py
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Mercado Agrícola Local
            </span>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <span>🇵🇾</span>
          <span>Paraguay</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
