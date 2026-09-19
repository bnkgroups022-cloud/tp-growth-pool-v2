import { siteConfig } from '@/lib/config/site';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-12 safe-top safe-bottom">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-cyan text-lg font-bold text-white shadow-glow-accent">
          TP
        </div>
        <h1 className="text-lg font-semibold text-white">{siteConfig.name}</h1>
        <p className="text-sm text-white/45">{siteConfig.brand}</p>
      </div>
      <div className="w-full max-w-sm animate-fade-up">{children}</div>
    </div>
  );
}
