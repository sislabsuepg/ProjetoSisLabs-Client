import { Providers } from '@/context/providers';
import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'SisLabs',
  description: 'Sistema de gerenciamento de laboratórios do DEINFO.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`antialiased`}>
        {/* <p>HEADER</p> */}
        <Providers>{children}</Providers>
        {/* <p>FOOTER</p> */}
      </body>
    </html>
  );
}
