import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Receptionist',
  description: 'Takes calls and makes bookings'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header>
            <h1>AI Receptionist</h1>
            <nav>
              <a href="/">Home</a>
              <a href="/setup">Setup</a>
              <a href="/bookings">Bookings</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer>
            <small>? {new Date().getFullYear()} AI Receptionist</small>
          </footer>
        </div>
      </body>
    </html>
  );
}
