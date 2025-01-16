import type { Metadata } from 'next';
import { Roboto, Open_Sans } from 'next/font/google';
import './globals.css';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  // metadataBase: new URL(SERVER_URL),
};

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
