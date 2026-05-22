import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: process.env.GITHUB_ACTIONS ? '/saas-imobiliaria/' : '/',
    plugins: [
      react(),
      tailwindcss(),
      process.env.NODE_ENV === 'development' && VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: 'Imobi SaaS',
          short_name: 'Imobi',
          description: 'SaaS de Gestão Imobiliária',
          theme_color: '#f8fafc',
          background_color: '#ffffff',
          display: 'standalone',
        }
      })
    ].filter(Boolean),
    // SECURITY: GEMINI_API_KEY removed from client bundle. It was being inlined into JS
    // shipped to the browser (anyone could exfiltrate the key from DevTools).
    // Calls must go through the /api/generate-ad server route which reads the key
    // server-side from process.env.GEMINI_API_KEY.
    // TODO: ensure all client code calls /api/generate-ad instead of using process.env.GEMINI_API_KEY directly.
    // define: {
    //   'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    // },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
