import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-3xl font-bold text-foreground">Términos y Condiciones</h1>
          <p className="text-muted-foreground">Última actualización: Febrero 2026</p>

          {/* Naturaleza de la Plataforma */}
          <section className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Naturaleza de la Plataforma</h2>
            <p className="text-muted-foreground leading-relaxed">
              KAMPS PY es una plataforma de interconexión que facilita el contacto entre compradores, 
              productores y prestadores de servicios del sector agrícola paraguayo.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">KAMPS PY no intermedia, supervisa ni se responsabiliza 
              por las transacciones realizadas entre los usuarios.</strong> Todas las negociaciones, 
              acuerdos comerciales, entregas, pagos y documentaciones son responsabilidad exclusiva 
              de las partes involucradas.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              La plataforma actúa únicamente como un nexo de interconexión, brindando herramientas 
              para que los usuarios puedan encontrarse, comunicarse y establecer relaciones comerciales 
              de manera directa.
            </p>
          </section>

          {/* Uso de la Plataforma */}
          <section className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Uso de la Plataforma</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Los usuarios deben proporcionar información veraz y actualizada.</li>
              <li>Está prohibido publicar contenido fraudulento, engañoso o ilegal.</li>
              <li>Las publicaciones deben estar relacionadas con el sector agropecuario.</li>
              <li>KAMPS PY se reserva el derecho de eliminar publicaciones que violen estas condiciones.</li>
            </ul>
          </section>

          {/* Capacidades y Permisos */}
          <section className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Capacidades y Permisos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los usuarios pueden solicitar diferentes capacidades dentro de la plataforma 
              (publicar ofertas, demandas, servicios o comprar). La activación de nuevas 
              capacidades requiere aprobación administrativa para garantizar la calidad 
              y confiabilidad de la comunidad.
            </p>
          </section>

          {/* Reputación */}
          <section className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Sistema de Reputación</h2>
            <p className="text-muted-foreground leading-relaxed">
              Las calificaciones y reseñas deben reflejar experiencias reales. Está prohibido 
              manipular el sistema de reputación mediante calificaciones falsas o acordadas.
            </p>
          </section>

          {/* Privacidad */}
          <section className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Privacidad y Datos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los datos personales son tratados de forma confidencial. Los números de teléfono 
              no se muestran públicamente a menos que el usuario lo autorice explícitamente. 
              El contacto inicial siempre es a través del chat interno de la plataforma.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Terms;
