import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Leaf, Plus, User, LogOut, FileText } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
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
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button onClick={() => navigate('/publicar')} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Publicar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/mis-anuncios')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Mis Anuncios
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/auth')} size="sm">
                Ingresar
              </Button>
              <Button onClick={() => navigate('/auth')} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Publicar</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
