import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>
        <main>
          <h1>API Collections</h1>
          <nav style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <Link href="/">API 列表</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
