import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserRoles, useCanPublish, ROLE_INFO, SelectableRole } from '@/hooks/useUserRoles';
import { useConversations } from '@/hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import LanguageSelector from '@/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, User, LogOut, FileText, MessageCircle, Shield, UserCircle } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { data: roles } = useUserRoles();
  const { data: conversations } = useConversations();
  const canPublish = useCanPublish();
  const navigate = useNavigate();

  const isAdmin = roles?.includes('admin') || false;
  const unreadCount = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) || 0;

  // Get display roles (exclude admin for display)
  const displayRoles = roles?.filter(r => r !== 'admin' && r !== 'productor') as SelectableRole[] | undefined;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size="md" showText={true} />
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          {user ? (
            <>
              {/* Messages button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/mensajes')}
                className="relative"
              >
                <MessageCircle className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-accent text-accent-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Show publish button only for producers/service providers */}
              {canPublish && (
                <Button onClick={() => navigate('/publicar')} size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t('header.publish')}</span>
                </Button>
              )}
              
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
                  {displayRoles && displayRoles.length > 0 && (
                    <div className="px-2 py-1 flex flex-wrap gap-1">
                      {displayRoles.map(r => {
                        const info = ROLE_INFO[r];
                        return (
                          <span 
                            key={r} 
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${info?.color || 'bg-muted text-muted-foreground'}`}
                          >
                            {info?.emoji} {t(`role.${r}`)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    {t('header.myProfile')}
                  </DropdownMenuItem>
                  {canPublish && (
                    <DropdownMenuItem onClick={() => navigate('/mis-anuncios')}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t('header.myListings')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/mensajes')}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('header.messages')}
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-accent text-accent-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        {t('header.adminPanel')}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('header.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/auth')} size="sm">
                {t('header.login')}
              </Button>
              <Button onClick={() => navigate('/auth')} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">{t('header.publish')}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
