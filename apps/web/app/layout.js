import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>
        <main>
          <header className="panel page-header">
            <h1 className="page-title">API Collections</h1>
            <p className="page-subtitle">Neumorphic 介面 · 政府 API 探索</p>
          </header>

          <nav className="top-nav">
            <Link className="nav-link" href="/">API 列表</Link>
            <Link className="nav-link" href="/dashboard">Dashboard</Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
