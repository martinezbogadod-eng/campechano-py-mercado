import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useConversations, Conversation } from '@/hooks/useMessages';
import ChatDialog from '@/components/ChatDialog';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: conversations, isLoading } = useConversations();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Ayer';
    } else if (days < 7) {
      return date.toLocaleDateString('es-PY', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('es-PY', { day: 'numeric', month: 'short' });
    }
  };

  const totalUnread = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <MessageCircle className="h-6 w-6" />
              Mensajes
              {totalUnread > 0 && (
                <Badge className="bg-accent text-accent-foreground">{totalUnread}</Badge>
              )}
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                No tienes mensajes
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cuando contactes a un vendedor, tus conversaciones aparecerán aquí.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <Card
                    key={`${conv.listingId}-${conv.otherUserId}`}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{conv.listingTitle}</p>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                        <span className="ml-4 text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      {/* Chat Dialog */}
      {selectedConversation && (
        <ChatDialog
          open={!!selectedConversation}
          onClose={() => setSelectedConversation(null)}
          listingId={selectedConversation.listingId}
          listingTitle={selectedConversation.listingTitle}
          sellerId={selectedConversation.otherUserId}
          sellerPhone=""
        />
      )}
    </div>
  );
}
