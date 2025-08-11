import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TelegramBot Manager - Crie e Gerencie Bots do Telegram',
  description: 'Plataforma completa para criar, configurar e gerenciar bots do Telegram com interface intuitiva e design moderno.',
  keywords: ['telegram', 'bot', 'saas', 'automação', 'chatbot', 'gestão'],
  authors: [{ name: 'TelegramBot Manager' }],
  creator: 'TelegramBot Manager',
  publisher: 'TelegramBot Manager',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TelegramBot Manager',
    description: 'Crie e gerencie bots do Telegram de forma visual e intuitiva',
    url: '/',
    siteName: 'TelegramBot Manager',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TelegramBot Manager',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TelegramBot Manager',
    description: 'Crie e gerencie bots do Telegram de forma visual e intuitiva',
    images: ['/og-image.png'],
    creator: '@telegrambotmanager',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased bg-background-primary text-text-primary overflow-x-hidden`}>
        <div id="root" className="min-h-screen">
          {children}
        </div>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  )
}