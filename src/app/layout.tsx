
import { Providers } from '@/context/providers';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import HelpFloatingButton from '@/components/HelpFloatingButton';

export const metadata: Metadata = {
  title: 'SisLabs',
  description: 'Sistema de gerenciamento de laboratórios do DEINFO.',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="pt-BR" className={`${poppins.variable}`}>
      <body className={`antialiased`}>
        <Providers>
          {children}
          <HelpFloatingButton />
          </Providers>
      </body>
    </html>
  );
}
