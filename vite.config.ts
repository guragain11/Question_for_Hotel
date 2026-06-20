import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Redirect /admin to /#/admin so hash-based routing works without server SPA fallback
function adminRedirectPlugin(): Plugin {
  return {
    name: 'admin-redirect',
    configureServer(server) {
      server.middlewares.use('/admin', (_req, res) => {
        res.writeHead(302, { Location: '/#/admin' });
        res.end();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  appType: 'spa',
  plugins: [adminRedirectPlugin(), react(), tailwindcss(), command === 'build' && viteSingleFile()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
}));
