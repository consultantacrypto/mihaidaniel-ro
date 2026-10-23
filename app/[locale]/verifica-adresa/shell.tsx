import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { EmbedResize } from './embed-resize';

const EMBED_STYLE =
  'html.verifica-embed .cookie-banner{display:none!important}html.verifica-embed body{padding-bottom:0!important}';

export function CheckerShell({
  embed,
  returnOrigin,
  children,
}: {
  embed: boolean;
  returnOrigin: string;
  children: React.ReactNode;
}) {
  return (
    <div className={embed ? 'bg-[#070b14] text-white' : 'min-h-screen bg-[#070b14] text-white'}>
      {embed ? (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: "document.documentElement.classList.add('verifica-embed')",
            }}
          />
          <style dangerouslySetInnerHTML={{ __html: EMBED_STYLE }} />
          <EmbedResize returnOrigin={returnOrigin} />
        </>
      ) : (
        <Navbar />
      )}
      <main className={embed ? 'px-4 py-5' : 'px-4 pb-24 pt-28 md:px-8'}>{children}</main>
      {embed ? null : <Footer />}
    </div>
  );
}
