import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/geist-mono';
import './index.css';
import App from './App';
import { ThemeProvider } from './provider/ThemeProvider';
import { SiteNavigation } from './components/SiteNavigation';
import { SiteFooter } from './components/SiteFooter';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 sm:px-8">
          <SiteNavigation />
          <main className="flex-1 space-y-14 py-8 sm:space-y-16 sm:py-12">
            <App />
          </main>
          <SiteFooter />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
