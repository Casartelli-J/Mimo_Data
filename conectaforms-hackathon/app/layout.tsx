import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ConectaForms | Seus clientes, mais perto',
  description: 'Formulários personalizados e organização de contatos para pequenos negócios.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
